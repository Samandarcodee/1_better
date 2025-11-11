import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import HabitCard from "@/components/HabitCard";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

export default function Home() {
  const [, setLocation] = useLocation();

  const habits = [
    {
      id: 1,
      name: "Morning Meditation",
      streak: 12,
      progress: 40,
      completedToday: true as boolean | null,
    },
    {
      id: 2,
      name: "Read 30 Minutes",
      streak: 7,
      progress: 23,
      completedToday: null as boolean | null,
    },
    {
      id: 3,
      name: "No Social Media",
      streak: 5,
      progress: 16,
      completedToday: false as boolean | null,
    },
    {
      id: 4,
      name: "Exercise",
      streak: 21,
      progress: 70,
      completedToday: true as boolean | null,
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24" data-testid="page-home">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold text-foreground mb-2" data-testid="text-app-title">
            1% Better
          </h1>
          <p className="text-muted-foreground text-base" data-testid="text-app-tagline">
            Har kuni 1% yaxshiroq
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-4"
        >
          {habits.map((habit, index) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.3 }}
            >
              <HabitCard
                {...habit}
                onClick={() => setLocation(`/habit/${habit.id}`)}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="fixed bottom-8 right-8"
        >
          <Button
            size="lg"
            className="rounded-full w-16 h-16 shadow-lg"
            onClick={() => setLocation("/add")}
            data-testid="button-add-habit"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
