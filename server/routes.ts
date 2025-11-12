import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertHabitSchema } from "@shared/schema";
import { z } from "zod";

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
    return await response.json();
  } catch (error) {
    console.error("Error sending message:", error);
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
  app.get("/api/habits", async (req, res) => {
    try {
      const habits = await storage.getAllHabits();
      res.json(habits);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch habits" });
    }
  });

  app.get("/api/habits/:id", async (req, res) => {
    try {
      const habit = await storage.getHabit(req.params.id);
      if (!habit) {
        return res.status(404).json({ error: "Habit not found" });
      }
      res.json(habit);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch habit" });
    }
  });

  app.post("/api/habits", async (req, res) => {
    try {
      const validatedData = insertHabitSchema.parse(req.body);
      const habit = await storage.createHabit(validatedData);
      res.status(201).json(habit);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create habit" });
    }
  });

  app.patch("/api/habits/:id", async (req, res) => {
    try {
      const habit = await storage.updateHabit(req.params.id, req.body);
      if (!habit) {
        return res.status(404).json({ error: "Habit not found" });
      }
      res.json(habit);
    } catch (error) {
      res.status(500).json({ error: "Failed to update habit" });
    }
  });

  app.delete("/api/habits/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteHabit(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Habit not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete habit" });
    }
  });

  app.post("/api/habits/:id/mark", async (req, res) => {
    try {
      const { date, completed } = req.body;
      if (typeof date !== "string" || typeof completed !== "boolean") {
        return res.status(400).json({ error: "Invalid request body" });
      }

      const habit = await storage.markHabitDay(req.params.id, date, completed);
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
