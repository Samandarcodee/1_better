import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { ArrowLeft, Check, X, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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

  const deleteHabitMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("DELETE", `/api/habits/${habitId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/habits"] });
      toast({
        description: "Odat o'chirildi",
      });
      setLocation("/");
    },
    onError: () => {
      toast({
        description: "Xatolik yuz berdi",
        variant: "destructive",
      });
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
          {/* Habit Header with Icon, Name, and Actions */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="text-6xl mb-3"
            >
              {habit.icon || "🎯"}
            </motion.div>
            <h2 className="text-3xl font-bold text-foreground mb-2" data-testid="text-habit-name">
              {habit.name}
            </h2>
            {habit.description && (
              <p className="text-base text-muted-foreground mb-3 max-w-md mx-auto">
                {habit.description}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              {habit.duration} kunlik sayohat
            </p>
            
            {/* Edit and Delete buttons */}
            <div className="flex gap-2 justify-center mt-4">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => {
                  webApp.HapticFeedback.impactOccurred("light");
                  setLocation(`/edit/${habitId}`);
                }}
              >
                <Edit2 className="w-4 h-4" />
                Tahrirlash
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    O'chirish
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Odatni o'chirish</AlertDialogTitle>
                    <AlertDialogDescription>
                      Haqiqatan ham bu odatni o'chirmoqchimisiz? Bu amalni bekor qilib bo'lmaydi va barcha ma'lumotlar yo'qoladi.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteHabitMutation.mutate()}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      O'chirish
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* Streak Counter */}
          <div className="mb-6">
            <StreakCounter streak={habit.streak} />
          </div>

          {/* Circular Progress with card and stats */}
          <motion.div 
            className="flex justify-center mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="bg-card border rounded-2xl p-6 shadow-lg w-full max-w-md">
              <h3 className="text-center text-sm font-semibold text-muted-foreground mb-4">
                UMUMIY PROGRESS
              </h3>
              <CircularProgress percentage={calculateProgress()} size={160} />
              
              {/* Stats below progress */}
              <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {Object.values(habit.completionData).filter(v => v === true).length}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Bajarilgan kunlar
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-primary">
                    {habit.duration}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Jami kunlar
                  </div>
                </div>
              </div>

              {/* Progress bar visualization */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>Boshlanish</span>
                  <span>Yakunlanish</span>
                </div>
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${calculateProgress()}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </div>
                <div className="text-center mt-2 text-sm font-medium text-muted-foreground">
                  {Object.values(habit.completionData).filter(v => v === true).length} / {habit.duration} kun bajarildi
                </div>
              </div>
            </div>
          </motion.div>

          <div className="my-8">
            <h3 className="text-lg font-semibold mb-4 text-foreground" data-testid="text-calendar-heading">
              📅 Kalendar
            </h3>
            <HabitCalendar days={getCalendarDays()} />
          </div>

          {/* Action Buttons with better styling */}
          <motion.div 
            className="flex flex-col gap-3 my-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {completedToday === null && (
              <div className="text-center mb-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Bugun odatni bajardingizmi?
                </p>
              </div>
            )}

            {completedToday === true && (
              <div className="text-center mb-2 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-900">
                <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                  ✅ Bugun bajarildi! Ajoyib!
                </p>
              </div>
            )}

            {completedToday === false && (
              <div className="text-center mb-2 p-4 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-900">
                <p className="text-sm font-semibold text-orange-700 dark:text-orange-400">
                  ⏭️ Bugun o'tkazib yuborildi
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1 gap-2 h-14 text-base font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg"
                onClick={handleComplete}
                disabled={completedToday === true || markDayMutation.isPending}
                data-testid="button-complete"
              >
                <Check className="w-6 h-6" />
                Bajarildi
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-1 gap-2 h-14 text-base font-semibold border-2 hover:bg-muted"
                onClick={handleSkip}
                disabled={completedToday === false || markDayMutation.isPending}
                data-testid="button-skip"
              >
                <X className="w-6 h-6" />
                O'tkazish
              </Button>
            </div>
          </motion.div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 text-foreground" data-testid="text-chart-heading">
              📊 Haftalik Progress
            </h3>
            <MiniLineChart data={getWeeklyProgress()} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
