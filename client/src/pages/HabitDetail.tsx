import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { ArrowLeft, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import StreakCounter from "@/components/StreakCounter";
import CircularProgress from "@/components/CircularProgress";
import HabitCalendar from "@/components/HabitCalendar";
import MiniLineChart from "@/components/MiniLineChart";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Habit } from "@shared/schema";
import { useTelegram } from "@/lib/telegram";

export default function HabitDetail() {
  const [, params] = useRoute("/habit/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const habitId = params?.id || "";
  const { webApp } = useTelegram();

  useEffect(() => {
    webApp.BackButton.show();
    webApp.BackButton.onClick(() => {
      setLocation("/");
    });

    return () => {
      webApp.BackButton.hide();
      webApp.BackButton.offClick(() => {
        setLocation("/");
      });
    };
  }, [webApp, setLocation]);

  const { data: habit, isLoading } = useQuery<Habit>({
    queryKey: ["/api/habits", habitId],
    enabled: !!habitId,
  });

  const markDayMutation = useMutation({
    mutationFn: async (completed: boolean) => {
      const today = new Date().toISOString().split("T")[0];
      return apiRequest("POST", `/api/habits/${habitId}/mark`, {
        date: today,
        completed,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/habits", habitId] });
      queryClient.invalidateQueries({ queryKey: ["/api/habits"] });
    },
  });

  const getTodayStatus = (): boolean | null => {
    if (!habit) return null;
    const today = new Date().toISOString().split("T")[0];
    const status = habit.completionData[today];
    return status === undefined ? null : status;
  };

  const motivationalMessages = {
    completed: [
      "Ajoyib! Bugun 1% oldindasan 💪",
      "Davom et, sen kuchlisan 🔥",
      "Bajarildi. O'zing bilan faxrlan 🚀",
    ],
    skipped: [
      "O'tkazib yubordingmi? Hechqisi yo'q, ertaga davom et 🧠",
      "Yiqilish muammosi emas, qaytadan turishdir 💪",
      "Ertaga yangi imkoniyat 🌅",
    ],
  };

  const handleComplete = () => {
    webApp.HapticFeedback.notificationOccurred("success");
    
    const message =
      motivationalMessages.completed[
        Math.floor(Math.random() * motivationalMessages.completed.length)
      ];
    
    markDayMutation.mutate(true);
    
    toast({
      description: message,
      duration: 3000,
    });
  };

  const handleSkip = () => {
    webApp.HapticFeedback.impactOccurred("light");
    
    const message =
      motivationalMessages.skipped[
        Math.floor(Math.random() * motivationalMessages.skipped.length)
      ];
    
    markDayMutation.mutate(false);
    
    toast({
      description: message,
      duration: 3000,
    });
  };

  const getCalendarDays = () => {
    if (!habit) return [];

    const days = [];
    const today = new Date();
    const startDate = new Date(habit.startDate);
    
    const daysSinceStart = Math.floor(
      (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const daysToShow = Math.min(daysSinceStart + 7, habit.duration);

    for (let i = 0; i < daysToShow; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      const todayStr = today.toISOString().split("T")[0];

      let status: "completed" | "missed" | "future" | "today";
      
      if (dateStr === todayStr) {
        status = "today";
      } else if (date > today) {
        status = "future";
      } else {
        status = habit.completionData[dateStr] === true ? "completed" : "missed";
      }

      days.push({
        date: date.getDate(),
        status,
      });
    }

    return days;
  };

  const getWeeklyProgress = () => {
    if (!habit) return [];

    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const data = weekDays.map((day, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      const dateStr = date.toISOString().split("T")[0];
      
      const completed = habit.completionData[dateStr] === true;
      return {
        day,
        value: completed ? 100 : 0,
      };
    });

    return data;
  };

  const calculateProgress = () => {
    if (!habit) return 0;
    const totalDays = habit.duration;
    const completedDays = Object.values(habit.completionData).filter(
      (v) => v === true
    ).length;
    return Math.round((completedDays / totalDays) * 100);
  };

  if (isLoading || !habit) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const completedToday = getTodayStatus();

  return (
    <div className="min-h-screen bg-background" data-testid="page-habit-detail">
      <div className="max-w-2xl mx-auto px-6 py-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation("/")}
          className="mb-6"
          data-testid="button-back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-2xl font-semibold text-center mb-8 text-foreground" data-testid="text-habit-name">
            {habit.name}
          </h2>

          <StreakCounter streak={habit.streak} />

          <div className="flex justify-center my-8">
            <CircularProgress percentage={calculateProgress()} size={140} />
          </div>

          <div className="my-8">
            <h3 className="text-lg font-semibold mb-4 text-foreground" data-testid="text-calendar-heading">
              Calendar
            </h3>
            <HabitCalendar days={getCalendarDays()} />
          </div>

          <div className="flex gap-4 my-8">
            <Button
              size="lg"
              className="flex-1 gap-2"
              onClick={handleComplete}
              disabled={completedToday === true || markDayMutation.isPending}
              data-testid="button-complete"
            >
              <Check className="w-5 h-5" />
              Bajarildi
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1 gap-2"
              onClick={handleSkip}
              disabled={completedToday === false || markDayMutation.isPending}
              data-testid="button-skip"
            >
              <X className="w-5 h-5" />
              O'tkazib yuborish
            </Button>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 text-foreground" data-testid="text-chart-heading">
              Haftalik Progress
            </h3>
            <MiniLineChart data={getWeeklyProgress()} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
