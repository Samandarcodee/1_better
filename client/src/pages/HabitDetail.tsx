import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { ArrowLeft, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import StreakCounter from "@/components/StreakCounter";
import CircularProgress from "@/components/CircularProgress";
import HabitCalendar from "@/components/HabitCalendar";
import MiniLineChart from "@/components/MiniLineChart";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function HabitDetail() {
  const [, params] = useRoute("/habit/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [completedToday, setCompletedToday] = useState<boolean | null>(null);

  const habitData = {
    id: params?.id || "1",
    name: "Morning Meditation",
    streak: 12,
    progress: 40,
  };

  const calendarDays = [
    { date: 1, status: "completed" as const },
    { date: 2, status: "completed" as const },
    { date: 3, status: "missed" as const },
    { date: 4, status: "completed" as const },
    { date: 5, status: "completed" as const },
    { date: 6, status: "completed" as const },
    { date: 7, status: "missed" as const },
    { date: 8, status: "completed" as const },
    { date: 9, status: "completed" as const },
    { date: 10, status: "completed" as const },
    { date: 11, status: "completed" as const },
    { date: 12, status: "completed" as const },
    { date: 13, status: "missed" as const },
    { date: 14, status: "today" as const },
    { date: 15, status: "future" as const },
    { date: 16, status: "future" as const },
    { date: 17, status: "future" as const },
    { date: 18, status: "future" as const },
    { date: 19, status: "future" as const },
    { date: 20, status: "future" as const },
    { date: 21, status: "future" as const },
  ];

  const chartData = [
    { day: "Mon", value: 60 },
    { day: "Tue", value: 80 },
    { day: "Wed", value: 70 },
    { day: "Thu", value: 90 },
    { day: "Fri", value: 85 },
    { day: "Sat", value: 95 },
    { day: "Sun", value: 100 },
  ];

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
    setCompletedToday(true);
    const message =
      motivationalMessages.completed[
        Math.floor(Math.random() * motivationalMessages.completed.length)
      ];
    toast({
      description: message,
      duration: 3000,
    });
  };

  const handleSkip = () => {
    setCompletedToday(false);
    const message =
      motivationalMessages.skipped[
        Math.floor(Math.random() * motivationalMessages.skipped.length)
      ];
    toast({
      description: message,
      duration: 3000,
    });
  };

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
            {habitData.name}
          </h2>

          <StreakCounter streak={habitData.streak} />

          <div className="flex justify-center my-8">
            <CircularProgress percentage={habitData.progress} size={140} />
          </div>

          <div className="my-8">
            <h3 className="text-lg font-semibold mb-4 text-foreground" data-testid="text-calendar-heading">
              Calendar
            </h3>
            <HabitCalendar days={calendarDays} />
          </div>

          <div className="flex gap-4 my-8">
            <Button
              size="lg"
              className="flex-1 gap-2"
              onClick={handleComplete}
              disabled={completedToday === true}
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
              disabled={completedToday === false}
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
            <MiniLineChart data={chartData} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
