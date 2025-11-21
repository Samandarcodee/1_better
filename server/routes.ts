import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertHabitSchema, userSettings } from "@shared/schema";
import { z } from "zod";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";

// Telegram user ID'ni olish uchun middleware
function getUserId(req: Request): string | null {
  // 1. Header'dan olish (Telegram Mini App)
  const telegramData = req.headers['x-telegram-init-data'] as string;
  if (telegramData) {
    try {
      const params = new URLSearchParams(telegramData);
      const userJson = params.get('user');
      if (userJson) {
        const user = JSON.parse(userJson);
        return user.id?.toString();
      }
    } catch (e) {
      console.error("Error parsing Telegram data:", e);
    }
  }
  
  // 2. Query parameter'dan olish (test uchun)
  if (req.query.userId) {
    return req.query.userId as string;
  }
  
  // 3. Body'dan olish
  if (req.body?.userId) {
    return req.body.userId;
  }
  
  return null;
}

// Authentication middleware
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ 
      error: "Unauthorized",
      message: "Telegram user ID required" 
    });
  }
  // userId'ni request object'ga qo'shamiz
  (req as any).userId = userId;
  next();
}

const BOT_TOKEN = "8300153631:AAFfdf9HexrQn8v1oqj9P93trhDFeIj1MQk";
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function sendMessage(chatId: number, text: string, webAppUrl?: string) {
  try {
    const body: any = {
      chat_id: chatId,
      text: text,
      parse_mode: "HTML",
    };

    // Agar webAppUrl berilsa, inline keyboard qo'shamiz
    if (webAppUrl) {
      body.reply_markup = {
        inline_keyboard: [
          [
            {
              text: "🚀 Mini App'ni ochish",
              web_app: {
                url: webAppUrl,
              },
            },
          ],
        ],
      };
    }

    const response = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = await response.json();
    
    if (!result.ok) {
      console.error("❌ Telegram API error:", result);
    }
    
    return result;
  } catch (error) {
    console.error("❌ Error sending message:", error);
    return null;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Telegram bot webhook
  app.post("/api/telegram/webhook", async (req, res) => {
    try {
      const update = req.body;
      console.log("📨 Webhook received:", JSON.stringify(update, null, 2));
      
      if (update.message) {
        const chatId = update.message.chat.id;
        const text = update.message.text;
        console.log(`💬 Message from ${chatId}: ${text}`);

        const userId = update.message.from.id.toString();

        // Initialize database
        const databaseUrl = process.env.DATABASE_URL;
        if (!databaseUrl) {
          throw new Error("DATABASE_URL not set");
        }
        const sql = neon(databaseUrl);
        const db = drizzle(sql);

        if (text === "/start") {
          // Create or update user settings
          try {
            await db.insert(userSettings).values({
              userId,
              chatId: chatId.toString(),
              notificationsEnabled: true,
            }).onConflictDoUpdate({
              target: userSettings.userId,
              set: {
                chatId: chatId.toString(),
              },
            });
          } catch (error) {
            console.error("Error creating user settings:", error);
          }

          const webAppUrl = process.env.WEB_APP_URL || "https://one-better.onrender.com";
          const message = `Salom! 👋

1% Better ilovasiga xush kelibsiz!

Odatlarni boshqarish uchun quyidagi tugmani bosing yoki menu tugmasidan foydalaning.

<b>Mavjud buyruqlar:</b>
/today - Bugungi status
/remind - Eslatma sozlamalari
/stats - Statistika
/help - Yordam`;

          await sendMessage(chatId, message, webAppUrl);
        } 
        
        else if (text === "/today") {
          const userHabits = await storage.getAllHabits(userId);
          if (userHabits.length === 0) {
            await sendMessage(chatId, "❌ Sizda hali odatlar yo'q. Ilova orqali birinchi odatingizni qo'shing!");
            res.status(200).json({ ok: true });
            return;
          }

          const today = new Date().toISOString().split("T")[0];
          let message = "📊 <b>Bugungi holat:</b>\n\n";

          userHabits.forEach((habit) => {
            const completed = habit.completionData[today] === true;
            const icon = completed ? "✅" : "⏳";
            message += `${icon} <b>${habit.name}</b>\n`;
            message += `   🔥 Streak: ${habit.streak} kun\n\n`;
          });

          const completedCount = userHabits.filter(h => h.completionData[today] === true).length;
          message += `\n📈 Bugun: ${completedCount}/${userHabits.length} bajarildi`;

          await sendMessage(chatId, message);
        }
        
        else if (text === "/stats") {
          const userHabits = await storage.getAllHabits(userId);
          if (userHabits.length === 0) {
            await sendMessage(chatId, "❌ Sizda hali odatlar yo'q.");
            res.status(200).json({ ok: true });
            return;
          }

          let message = "📊 <b>Statistika:</b>\n\n";
          let totalStreak = 0;
          let totalCompleted = 0;

          userHabits.forEach((habit) => {
            const completed = Object.values(habit.completionData).filter(v => v === true).length;
            const percentage = Math.round((completed / habit.duration) * 100);
            
            message += `📌 <b>${habit.name}</b>\n`;
            message += `   🔥 Streak: ${habit.streak} kun\n`;
            message += `   ✅ Bajarildi: ${completed}/${habit.duration} (${percentage}%)\n\n`;
            
            totalStreak += habit.streak;
            totalCompleted += completed;
          });

          message += `\n<b>Umumiy:</b>\n`;
          message += `📈 Jami odatlar: ${userHabits.length}\n`;
          message += `🔥 O'rtacha streak: ${Math.round(totalStreak / userHabits.length)} kun\n`;
          message += `✅ Jami bajarilgan: ${totalCompleted} kun`;

          await sendMessage(chatId, message);
        }
        
        else if (text.startsWith("/remind")) {
          const helpMessage = `⏰ <b>Eslatma sozlamalari</b>

Eslatma o'rnatish uchun ilovani oching va har bir odat uchun eslatma vaqtini sozlang.

<i>Tez orada /remind 09:00 kabi buyruq ham qo'shiladi!</i>`;
          
          await sendMessage(chatId, helpMessage);
        }
        
        else if (text === "/help") {
          const helpMessage = `ℹ️ <b>Yordam</b>

<b>Mavjud buyruqlar:</b>

/start - Botni ishga tushirish
/today - Bugungi odatlar holati
/stats - Batafsil statistika
/remind - Eslatma sozlamalari
/help - Bu yordam xabari

<b>Mini App:</b>
Pastdagi menu tugmasini bosing yoki /start buyrug'idagi tugmani bosing.`;
          
          await sendMessage(chatId, helpMessage);
        }
        
        else {
          console.log("ℹ️ Unknown command:", text);
        }
      } else {
        console.log("ℹ️ Update type:", Object.keys(update).join(", "));
      }

      res.status(200).json({ ok: true });
    } catch (error) {
      console.error("❌ Webhook error:", error);
      res.status(200).json({ ok: true }); // Telegram ga har doim 200 qaytaramiz
    }
  });

  // Webhook test endpoint
  app.get("/api/telegram/webhook", (req, res) => {
    res.json({ 
      status: "ok", 
      message: "Webhook endpoint is ready",
      url: "/api/telegram/webhook",
      method: "POST"
    });
  });

  // Manual trigger for notifications (for testing)
  app.post("/api/notifications/trigger", async (req, res) => {
    try {
      const { triggerRemindersManually } = await import("./notifications");
      await triggerRemindersManually();
      res.json({ 
        status: "ok", 
        message: "Notifications triggered successfully"
      });
    } catch (error) {
      console.error("❌ Error triggering notifications:", error);
      res.status(500).json({ 
        error: "Failed to trigger notifications",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app.get("/api/habits", requireAuth, async (req, res) => {
    try {
      const userId = (req as any).userId;
      const habits = await storage.getAllHabits(userId);
      res.json(habits);
    } catch (error) {
      console.error("❌ Error in GET /api/habits:", error);
      res.status(500).json({ 
        error: "Failed to fetch habits",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/habits/:id", requireAuth, async (req, res) => {
    try {
      const userId = (req as any).userId;
      const habit = await storage.getHabit(req.params.id, userId);
      if (!habit) {
        return res.status(404).json({ error: "Habit not found" });
      }
      res.json(habit);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch habit" });
    }
  });

  app.post("/api/habits", requireAuth, async (req, res) => {
    try {
      const userId = (req as any).userId;
      // userId'ni body'ga qo'shamiz
      const habitData = { ...req.body, userId };
      const validatedData = insertHabitSchema.parse(habitData);
      const habit = await storage.createHabit(validatedData);
      res.status(201).json(habit);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create habit" });
    }
  });

  app.patch("/api/habits/:id", requireAuth, async (req, res) => {
    try {
      const userId = (req as any).userId;
      const habit = await storage.updateHabit(req.params.id, userId, req.body);
      if (!habit) {
        return res.status(404).json({ error: "Habit not found" });
      }
      res.json(habit);
    } catch (error) {
      res.status(500).json({ error: "Failed to update habit" });
    }
  });

  app.delete("/api/habits/:id", requireAuth, async (req, res) => {
    try {
      const userId = (req as any).userId;
      const deleted = await storage.deleteHabit(req.params.id, userId);
      if (!deleted) {
        return res.status(404).json({ error: "Habit not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete habit" });
    }
  });

  app.post("/api/habits/:id/mark", requireAuth, async (req, res) => {
    try {
      const userId = (req as any).userId;
      const { date, completed } = req.body;
      if (typeof date !== "string" || typeof completed !== "boolean") {
        return res.status(400).json({ error: "Invalid request body" });
      }

      const habit = await storage.markHabitDay(req.params.id, userId, date, completed);
      if (!habit) {
        return res.status(404).json({ error: "Habit not found" });
      }
      res.json(habit);
    } catch (error) {
      res.status(500).json({ error: "Failed to mark habit day" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
