import cron from "node-cron";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, and } from "drizzle-orm";
import { habits, userSettings } from "@shared/schema";

const BOT_TOKEN = "8300153631:AAFfdf9HexrQn8v1oqj9P93trhDFeIj1MQk";
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

// Database connection
const getDatabase = () => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  const sql = neon(databaseUrl);
  return drizzle(sql);
};

// Send Telegram message
async function sendTelegramMessage(chatId: string, text: string, parseMode: string = "HTML") {
  try {
    const response = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: parseMode,
      }),
    });
    
    const result = await response.json();
    
    if (!result.ok) {
      console.error("❌ Telegram API error:", result);
    }
    
    return result;
  } catch (error) {
    console.error("❌ Error sending Telegram message:", error);
    return null;
  }
}

// Check if today's habit is completed
function isTodayCompleted(completionData: Record<string, boolean>): boolean {
  const today = new Date().toISOString().split("T")[0];
  return completionData[today] === true;
}

// Get current time in HH:mm format
function getCurrentTime(timezone: string = "Asia/Tashkent"): string {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  return now.toLocaleTimeString("en-US", options);
}

// Send daily reminder
async function sendDailyReminder(chatId: string, habit: any) {
  const message = `
⏰ <b>Eslatma!</b>

Bugun "<b>${habit.name}</b>" odatingizni bajarish vaqti keldi!

🔥 Hozirgi streak: ${habit.streak} kun
💪 Davom eting va maqsadingizga yetib boring!

📱 <i>Ilovani ochib, odatni belgilang</i>
  `.trim();

  await sendTelegramMessage(chatId, message);
  console.log(`✅ Daily reminder sent for habit: ${habit.name} to chat: ${chatId}`);
}

// Send streak protection reminder
async function sendStreakProtectionReminder(chatId: string, habit: any) {
  if (habit.streak < 3) return; // Faqat 3+ kun streak bo'lsa

  const message = `
🔥 <b>Streak himoyasi!</b>

Diqqat! Sizning "<b>${habit.name}</b>" uchun ${habit.streak} kunlik streak'ingiz xavf ostida!

⚠️ Bugun bu odatni bajarmasangiz, streak yo'qoladi.

💪 <i>Hoziroq bajaring va streak'ni saqlab qoling!</i>
  `.trim();

  await sendTelegramMessage(chatId, message);
  console.log(`🔥 Streak protection reminder sent for habit: ${habit.name} to chat: ${chatId}`);
}

// Send milestone notification
async function sendMilestoneNotification(chatId: string, habit: any, milestone: number) {
  const milestones = {
    7: { emoji: "🥉", title: "Birinchi hafta!", message: "Ajoyib! 7 kunni muvaffaqiyatli bajardingiz!" },
    21: { emoji: "🥈", title: "Odat shakllandi!", message: "21 kun - bu odat shakllangan demakdir. Davom eting!" },
    30: { emoji: "🏅", title: "Bir oy!", message: "Bir oy davom ettirdingiz! Bu katta yutuq!" },
    66: { emoji: "🥇", title: "Master darajasi!", message: "66 kun - odat to'liq shakllandi. Siz mastersiz!" },
    100: { emoji: "💎", title: "Legend!", message: "100 kun! Siz haqiqiy legendasiz!" },
    365: { emoji: "👑", title: "Yillik qahramon!", message: "Butun yil! Siz g'ayrioddiy odamsiz!" },
  };

  const info = milestones[milestone as keyof typeof milestones];
  if (!info) return;

  const message = `
${info.emoji} <b>${info.title}</b>

"<b>${habit.name}</b>" uchun ${milestone} kunlik milestone ga erishdingiz!

${info.message}

🎉 <i>Biz siz bilan faxrlanamiz!</i>
  `.trim();

  await sendTelegramMessage(chatId, message);
  console.log(`🎉 Milestone notification sent: ${milestone} days for habit: ${habit.name}`);
}

// Check and send reminders
async function checkAndSendReminders() {
  try {
    const db = getDatabase();
    
    // Get all habits with reminders enabled
    const allHabits = await db
      .select()
      .from(habits)
      .where(eq(habits.reminderEnabled, true));

    console.log(`⏰ Checking reminders for ${allHabits.length} habits...`);

    for (const habit of allHabits) {
      try {
        // Get user settings
        const userSettingsResult = await db
          .select()
          .from(userSettings)
          .where(eq(userSettings.userId, habit.userId))
          .limit(1);

        if (userSettingsResult.length === 0) {
          console.log(`⚠️ No user settings found for user: ${habit.userId}`);
          continue;
        }

        const settings = userSettingsResult[0];

        // Check if notifications are enabled
        if (!settings.notificationsEnabled) {
          continue;
        }

        // Check if it's time to send reminder
        const currentTime = getCurrentTime(habit.reminderTimezone || settings.timezone || "Asia/Tashkent");
        const reminderTime = habit.reminderTime || "09:00";

        // Check if current time matches reminder time (within 1 minute window)
        const [currentHour, currentMinute] = currentTime.split(":").map(Number);
        const [reminderHour, reminderMinute] = reminderTime.split(":").map(Number);

        if (currentHour === reminderHour && currentMinute === reminderMinute) {
          // Check if today is already completed
          if (!isTodayCompleted(habit.completionData as Record<string, boolean>)) {
            await sendDailyReminder(settings.chatId, habit);
          }
        }

        // Streak protection (send 2 hours before end of day if not completed)
        if (currentTime === "22:00" && settings.streakReminders) {
          if (!isTodayCompleted(habit.completionData as Record<string, boolean>) && habit.streak >= 3) {
            await sendStreakProtectionReminder(settings.chatId, habit);
          }
        }

        // Check for milestones
        if (settings.milestoneNotifications) {
          const milestones = [7, 21, 30, 66, 100, 365];
          if (milestones.includes(habit.streak)) {
            await sendMilestoneNotification(settings.chatId, habit, habit.streak);
          }
        }

      } catch (error) {
        console.error(`❌ Error processing habit ${habit.id}:`, error);
      }
    }

  } catch (error) {
    console.error("❌ Error in checkAndSendReminders:", error);
  }
}

// Initialize notification scheduler
export function initializeNotificationScheduler() {
  console.log("🔔 Initializing notification scheduler...");

  // Run every minute
  cron.schedule("* * * * *", async () => {
    await checkAndSendReminders();
  });

  console.log("✅ Notification scheduler initialized - running every minute");
}

// Manually trigger reminders (for testing)
export async function triggerRemindersManually() {
  console.log("🧪 Manually triggering reminders...");
  await checkAndSendReminders();
}

