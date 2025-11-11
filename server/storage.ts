import { type Habit, type InsertHabit } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getAllHabits(): Promise<Habit[]>;
  getHabit(id: string): Promise<Habit | undefined>;
  createHabit(habit: InsertHabit): Promise<Habit>;
  updateHabit(id: string, updates: Partial<Habit>): Promise<Habit | undefined>;
  deleteHabit(id: string): Promise<boolean>;
  markHabitDay(id: string, date: string, completed: boolean): Promise<Habit | undefined>;
}

export class MemStorage implements IStorage {
  private habits: Map<string, Habit>;

  constructor() {
    this.habits = new Map();
    this.seedData();
  }

  private seedData() {
    const now = new Date();
    const mockHabits: Habit[] = [
      {
        id: "1",
        name: "Morning Meditation",
        isGoodHabit: true,
        duration: 30,
        streak: 12,
        startDate: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000),
        completionData: {
          "2025-01-01": true,
          "2025-01-02": true,
          "2025-01-03": false,
          "2025-01-04": true,
          "2025-01-05": true,
          "2025-01-06": true,
          "2025-01-07": false,
          "2025-01-08": true,
          "2025-01-09": true,
          "2025-01-10": true,
          "2025-01-11": true,
          "2025-01-12": true,
        },
      },
      {
        id: "2",
        name: "Read 30 Minutes",
        isGoodHabit: true,
        duration: 21,
        streak: 7,
        startDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        completionData: {
          "2025-01-06": true,
          "2025-01-07": true,
          "2025-01-08": true,
          "2025-01-09": true,
          "2025-01-10": true,
          "2025-01-11": true,
          "2025-01-12": true,
        },
      },
      {
        id: "3",
        name: "No Social Media",
        isGoodHabit: false,
        duration: 21,
        streak: 5,
        startDate: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
        completionData: {
          "2025-01-05": false,
          "2025-01-06": true,
          "2025-01-07": true,
          "2025-01-08": true,
          "2025-01-09": true,
          "2025-01-10": true,
        },
      },
      {
        id: "4",
        name: "Exercise",
        isGoodHabit: true,
        duration: 30,
        streak: 21,
        startDate: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000),
        completionData: Object.fromEntries(
          Array.from({ length: 21 }, (_, i) => {
            const date = new Date(now.getTime() - (21 - i) * 24 * 60 * 60 * 1000);
            const dateStr = date.toISOString().split("T")[0];
            return [dateStr, i % 7 !== 2];
          })
        ),
      },
    ];

    mockHabits.forEach((habit) => this.habits.set(habit.id, habit));
  }

  async getAllHabits(): Promise<Habit[]> {
    return Array.from(this.habits.values());
  }

  async getHabit(id: string): Promise<Habit | undefined> {
    return this.habits.get(id);
  }

  async createHabit(insertHabit: InsertHabit): Promise<Habit> {
    const id = randomUUID();
    const habit: Habit = {
      id,
      name: insertHabit.name,
      isGoodHabit: insertHabit.isGoodHabit ?? true,
      duration: insertHabit.duration,
      streak: 0,
      startDate: new Date(),
      completionData: {},
    };
    this.habits.set(id, habit);
    return habit;
  }

  async updateHabit(id: string, updates: Partial<Habit>): Promise<Habit | undefined> {
    const habit = this.habits.get(id);
    if (!habit) return undefined;

    const updatedHabit = { ...habit, ...updates };
    this.habits.set(id, updatedHabit);
    return updatedHabit;
  }

  async deleteHabit(id: string): Promise<boolean> {
    return this.habits.delete(id);
  }

  async markHabitDay(
    id: string,
    date: string,
    completed: boolean
  ): Promise<Habit | undefined> {
    const habit = this.habits.get(id);
    if (!habit) return undefined;

    const completionData: Record<string, boolean> = { 
      ...(habit.completionData as Record<string, boolean>), 
      [date]: completed 
    };
    
    const streak = this.calculateStreak(completionData);

    const updatedHabit: Habit = {
      ...habit,
      completionData,
      streak,
    };

    this.habits.set(id, updatedHabit);
    return updatedHabit;
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
}

export const storage = new MemStorage();
