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

export type InsertHabit = z.infer<typeof insertHabitSchema>;
export type Habit = typeof habits.$inferSelect;
