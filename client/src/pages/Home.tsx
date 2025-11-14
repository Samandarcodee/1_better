import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import HabitCard from "@/components/HabitCard";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Habit } from "@shared/schema";
import { useTelegram } from "@/lib/telegram";
import { useEffect } from "react";

export default function Home() {
  const [, setLocation] = useLocation();
  const { webApp } = useTelegram();

  const { data: habits = [], isLoading } = useQuery<Habit[]>({
    queryKey: ["/api/habits"],
  });

  useEffect(() => {
    webApp.BackButton.hide();
  }, [webApp]);

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
        <div className="text-muted-foreground">Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/20 to-purple-50/20 pb-24" data-testid="page-home">
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Hero Section with improved design */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block mb-4"
          >
            <div className="relative">
              <div className="text-6xl">📈</div>
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 360]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
                className="absolute -top-2 -right-2 text-2xl"
              >
                ✨
              </motion.div>
            </div>
          </motion.div>
          
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3" data-testid="text-app-title">
            1% Better
          </h1>
          <p className="text-muted-foreground text-lg font-medium" data-testid="text-app-tagline">
            Har kuni 1% yaxshiroq bo'ling
          </p>
          
          {/* Quick Stats */}
          {habits.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 flex justify-center gap-4"
            >
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-blue-200/50">
                <div className="text-2xl font-bold text-blue-600">{habits.length}</div>
                <div className="text-xs text-muted-foreground">Odatlar</div>
              </div>
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-purple-200/50">
                <div className="text-2xl font-bold text-purple-600">
                  {habits.reduce((sum, h) => sum + h.streak, 0)}
                </div>
                <div className="text-xs text-muted-foreground">Jami Streak</div>
              </div>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-4"
        >
          {habits.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Birinchi odatingizni boshlang!
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Kichik qadam - katta o'zgarish. Bugun birinchi odatingizni yarating va hayotingizni o'zgartiring.
              </p>
              <div className="flex justify-center gap-2 text-sm text-muted-foreground">
                <span>💪 Kuchli bo'ling</span>
                <span>•</span>
                <span>🔥 Izchil bo'ling</span>
                <span>•</span>
                <span>🚀 O'sib boring</span>
              </div>
            </motion.div>
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
                  description={habit.description}
                  icon={habit.icon}
                  streak={habit.streak}
                  progress={calculateProgress(habit)}
                  completedToday={getTodayStatus(habit)}
                  onClick={() => {
                    webApp.HapticFeedback.impactOccurred("light");
                    setLocation(`/habit/${habit.id}`);
                  }}
                />
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Enhanced Floating Action Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="fixed bottom-8 right-8"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="lg"
              className="rounded-full w-16 h-16 shadow-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 relative overflow-hidden group"
              onClick={() => {
                webApp.HapticFeedback.impactOccurred("medium");
                setLocation("/add");
              }}
              data-testid="button-add-habit"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
              <Plus className="w-7 h-7 relative z-10" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
