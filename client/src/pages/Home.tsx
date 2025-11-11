import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import HabitCard from "@/components/HabitCard";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Habit } from "@shared/schema";

export default function Home() {
  const [, setLocation] = useLocation();

  const { data: habits = [], isLoading } = useQuery<Habit[]>({
    queryKey: ["/api/habits"],
  });

  const calculateProgress = (habit: Habit) => {
    const totalDays = habit.duration;
    const completedDays = Object.values(habit.completionData).filter(
      (v) => v === true
    ).length;
    return Math.round((completedDays / totalDays) * 100);
  };

  const getTodayStatus = (habit: Habit): boolean | null => {
    const today = new Date().toISOString().split("T")[0];
    const status = habit.completionData[today];
    return status === undefined ? null : status;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

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
          {habits.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                Hali odatlar yo'q. Birinchi odatingizni qo'shing!
              </p>
            </div>
          ) : (
            habits.map((habit, index) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
              >
                <HabitCard
                  id={parseInt(habit.id) || 0}
                  name={habit.name}
                  streak={habit.streak}
                  progress={calculateProgress(habit)}
                  completedToday={getTodayStatus(habit)}
                  onClick={() => setLocation(`/habit/${habit.id}`)}
                />
              </motion.div>
            ))
          )}
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
