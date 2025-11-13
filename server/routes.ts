import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertHabitSchema } from "@shared/schema";
import { z } from "zod";

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

        if (text === "/start") {
          const webAppUrl = process.env.WEB_APP_URL || "https://one-better.onrender.com";
          const result = await sendMessage(
            chatId,
            "Salom! 👋\n\n1% Better ilovasiga xush kelibsiz!\n\nOdatlarni boshqarish uchun quyidagi tugmani bosing yoki menu tugmasidan foydalaning.",
            webAppUrl
          );
          console.log("✅ Start message sent:", result);
        } else {
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
