import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const habits = pgTable("habits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 255 }).notNull(), // Telegram user ID
  name: text("name").notNull(),
  isGoodHabit: boolean("is_good_habit").notNull().default(true),
  duration: integer("duration").notNull(),
  streak: integer("streak").notNull().default(0),
  startDate: timestamp("start_date").notNull().defaultNow(),
  completionData: jsonb("completion_data").$type<Record<string, boolean>>().notNull().default(sql`'{}'::jsonb`),
  // Reminder settings
  reminderEnabled: boolean("reminder_enabled").notNull().default(false),
  reminderTime: varchar("reminder_time", { length: 5 }).default("09:00"), // HH:mm format
  reminderTimezone: varchar("reminder_timezone", { length: 50 }).default("Asia/Tashkent"),
});

// User settings table for global preferences
export const userSettings = pgTable("user_settings", {
  userId: varchar("user_id", { length: 255 }).primaryKey(),
  chatId: varchar("chat_id", { length: 255 }).notNull(),
  notificationsEnabled: boolean("notifications_enabled").notNull().default(true),
  streakReminders: boolean("streak_reminders").notNull().default(true),
  milestoneNotifications: boolean("milestone_notifications").notNull().default(true),
  timezone: varchar("timezone", { length: 50 }).default("Asia/Tashkent"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertHabitSchema = createInsertSchema(habits).omit({
  id: true,
  streak: true,
  startDate: true,
  completionData: true,
});

// Frontend uchun schema (userId avtomatik qo'shiladi)
export const insertHabitSchemaWithoutUserId = insertHabitSchema.omit({
  userId: true,
});

export const insertUserSettingsSchema = createInsertSchema(userSettings).omit({
  createdAt: true,
  updatedAt: true,
});

export type InsertHabit = z.infer<typeof insertHabitSchema>;
export type Habit = typeof habits.$inferSelect;
export type UserSettings = typeof userSettings.$inferSelect;
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
