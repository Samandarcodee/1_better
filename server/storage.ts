import { type Habit, type InsertHabit, habits } from "@shared/schema";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getAllHabits(userId: string): Promise<Habit[]>;
  getHabit(id: string, userId: string): Promise<Habit | undefined>;
  createHabit(habit: InsertHabit): Promise<Habit>;
  updateHabit(id: string, userId: string, updates: Partial<Habit>): Promise<Habit | undefined>;
  deleteHabit(id: string, userId: string): Promise<boolean>;
  markHabitDay(id: string, userId: string, date: string, completed: boolean): Promise<Habit | undefined>;
}

// Database connection
const getDatabase = () => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  try {
    const sql = neon(databaseUrl);
    return drizzle(sql);
  } catch (error) {
    console.error("❌ Database connection error:", error);
    throw error;
  }
};

export class PostgresStorage implements IStorage {
  private db;

  constructor() {
    try {
      this.db = getDatabase();
      console.log("✅ PostgreSQL database connected");
    } catch (error) {
      console.error("❌ Failed to initialize PostgreSQL storage:", error);
      throw error;
    }
  }

  async getAllHabits(userId: string): Promise<Habit[]> {
    try {
      console.log(`📊 Fetching habits for user ${userId}...`);
      const result = await this.db
        .select()
        .from(habits)
        .where(eq(habits.userId, userId));
      console.log(`✅ Found ${result.length} habits for user ${userId}`);
      return result.map(this.mapDbToHabit);
    } catch (error) {
      console.error("❌ Error fetching all habits:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      throw error;
    }
  }

  async getHabit(id: string, userId: string): Promise<Habit | undefined> {
    try {
      const result = await this.db
        .select()
        .from(habits)
        .where(and(eq(habits.id, id), eq(habits.userId, userId)))
        .limit(1);
      if (result.length === 0) return undefined;
      return this.mapDbToHabit(result[0]);
    } catch (error) {
      console.error("Error fetching habit:", error);
      throw error;
    }
  }

  async createHabit(insertHabit: InsertHabit): Promise<Habit> {
    try {
      const result = await this.db
        .insert(habits)
        .values({
          userId: insertHabit.userId,
          name: insertHabit.name,
          isGoodHabit: insertHabit.isGoodHabit ?? true,
          duration: insertHabit.duration,
          streak: 0,
          startDate: new Date(),
          completionData: {},
          // Reminder defaults
          reminderEnabled: false,
          reminderTime: "09:00",
          reminderTimezone: "Asia/Tashkent",
        })
        .returning();

      return this.mapDbToHabit(result[0]);
    } catch (error) {
      console.error("Error creating habit:", error);
      throw error;
    }
  }

  async updateHabit(id: string, userId: string, updates: Partial<Habit>): Promise<Habit | undefined> {
    try {
      const updateData: any = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.isGoodHabit !== undefined) updateData.isGoodHabit = updates.isGoodHabit;
      if (updates.duration !== undefined) updateData.duration = updates.duration;
      if (updates.streak !== undefined) updateData.streak = updates.streak;
      if (updates.startDate !== undefined) updateData.startDate = updates.startDate;
      if (updates.completionData !== undefined) updateData.completionData = updates.completionData;

      const result = await this.db
        .update(habits)
        .set(updateData)
        .where(and(eq(habits.id, id), eq(habits.userId, userId)))
        .returning();

      if (result.length === 0) return undefined;
      return this.mapDbToHabit(result[0]);
    } catch (error) {
      console.error("Error updating habit:", error);
      throw error;
    }
  }

  async deleteHabit(id: string, userId: string): Promise<boolean> {
    try {
      const result = await this.db
        .delete(habits)
        .where(and(eq(habits.id, id), eq(habits.userId, userId)))
        .returning();
      return result.length > 0;
    } catch (error) {
      console.error("Error deleting habit:", error);
      throw error;
    }
  }

  async markHabitDay(
    id: string,
    userId: string,
    date: string,
    completed: boolean
  ): Promise<Habit | undefined> {
    try {
      const habit = await this.getHabit(id, userId);
      if (!habit) return undefined;

      const completionData: Record<string, boolean> = {
        ...(habit.completionData as Record<string, boolean>),
        [date]: completed,
      };

      const streak = this.calculateStreak(completionData);

      const result = await this.db
        .update(habits)
        .set({
          completionData,
          streak,
        })
        .where(and(eq(habits.id, id), eq(habits.userId, userId)))
        .returning();

      if (result.length === 0) return undefined;
      return this.mapDbToHabit(result[0]);
    } catch (error) {
      console.error("Error marking habit day:", error);
      throw error;
    }
  }

  private calculateStreak(completionData: Record<string, boolean>): number {
    const dates = Object.keys(completionData).sort().reverse();
    let streak = 0;

    for (const date of dates) {
      if (completionData[date] === true) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  // Map database result to Habit type (handle date conversions)
  private mapDbToHabit(dbRow: any): Habit {
    try {
      const habit = {
        id: dbRow.id,
        userId: dbRow.userId ?? dbRow.user_id,
        name: dbRow.name,
        isGoodHabit: dbRow.isGoodHabit ?? dbRow.is_good_habit ?? true,
        duration: dbRow.duration,
        streak: dbRow.streak ?? 0,
        startDate: dbRow.startDate instanceof Date 
          ? dbRow.startDate 
          : dbRow.start_date instanceof Date
          ? dbRow.start_date
          : new Date(dbRow.startDate || dbRow.start_date || Date.now()),
        completionData: (dbRow.completionData || dbRow.completion_data || {}) as Record<string, boolean>,
        // Reminder fields
        reminderEnabled: dbRow.reminderEnabled ?? dbRow.reminder_enabled ?? false,
        reminderTime: dbRow.reminderTime ?? dbRow.reminder_time ?? "09:00",
        reminderTimezone: dbRow.reminderTimezone ?? dbRow.reminder_timezone ?? "Asia/Tashkent",
      };
      return habit;
    } catch (error) {
      console.error("❌ Error mapping database row to Habit:", error);
      console.error("Database row:", JSON.stringify(dbRow, null, 2));
      throw error;
    }
  }
}

// Fallback to MemStorage if DATABASE_URL is not set (for development)
export class MemStorage implements IStorage {
  private habits: Map<string, Habit>;

  constructor() {
    this.habits = new Map();
  }

  async getAllHabits(userId: string): Promise<Habit[]> {
    return Array.from(this.habits.values()).filter(h => h.userId === userId);
  }

  async getHabit(id: string, userId: string): Promise<Habit | undefined> {
    const habit = this.habits.get(id);
    if (habit && habit.userId === userId) {
      return habit;
    }
    return undefined;
  }

  async createHabit(insertHabit: InsertHabit): Promise<Habit> {
    const { randomUUID } = await import("crypto");
    const id = randomUUID();
    const habit: Habit = {
      id,
      userId: insertHabit.userId,
      name: insertHabit.name,
      isGoodHabit: insertHabit.isGoodHabit ?? true,
      duration: insertHabit.duration,
      streak: 0,
      startDate: new Date(),
      completionData: {},
      // Reminder defaults
      reminderEnabled: false,
      reminderTime: "09:00",
      reminderTimezone: "Asia/Tashkent",
    };
    this.habits.set(id, habit);
    return habit;
  }

  async updateHabit(id: string, userId: string, updates: Partial<Habit>): Promise<Habit | undefined> {
    const habit = this.habits.get(id);
    if (!habit || habit.userId !== userId) return undefined;
    const updatedHabit = { ...habit, ...updates };
    this.habits.set(id, updatedHabit);
    return updatedHabit;
  }

  async deleteHabit(id: string, userId: string): Promise<boolean> {
    const habit = this.habits.get(id);
    if (!habit || habit.userId !== userId) return false;
    return this.habits.delete(id);
  }

  async markHabitDay(id: string, userId: string, date: string, completed: boolean): Promise<Habit | undefined> {
    const habit = this.habits.get(id);
    if (!habit || habit.userId !== userId) return undefined;
    const completionData: Record<string, boolean> = {
      ...(habit.completionData as Record<string, boolean>),
      [date]: completed,
    };
    const dates = Object.keys(completionData).sort().reverse();
    let streak = 0;
    for (const d of dates) {
      if (completionData[d] === true) {
        streak++;
      } else {
        break;
      }
    }
    const updatedHabit: Habit = { ...habit, completionData, streak };
    this.habits.set(id, updatedHabit);
    return updatedHabit;
  }
}

// Use PostgreSQL if DATABASE_URL is set, otherwise fallback to memory
let storage: IStorage;

try {
  if (process.env.DATABASE_URL) {
    console.log("🔌 Attempting to connect to PostgreSQL database...");
    storage = new PostgresStorage();
  } else {
    console.log("💾 Using in-memory storage (DATABASE_URL not set)");
    storage = new MemStorage();
  }
} catch (error) {
  console.error("⚠️ Failed to initialize PostgreSQL storage, falling back to memory:", error);
  console.log("💾 Using in-memory storage as fallback");
  storage = new MemStorage();
}

export { storage };
