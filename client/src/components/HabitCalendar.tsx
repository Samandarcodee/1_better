import { CheckCircle2, XCircle, Circle } from "lucide-react";
import { motion } from "framer-motion";

type DayStatus = "completed" | "missed" | "future" | "today";

interface CalendarDay {
  date: number;
  status: DayStatus;
}

interface HabitCalendarProps {
  days: CalendarDay[];
}

export default function HabitCalendar({ days }: HabitCalendarProps) {
  const weekDays = ["Du", "Se", "Cho", "Pa", "Ju", "Sha", "Ya"];

  const getStatusIcon = (status: DayStatus) => {
    switch (status) {
      case "completed":
        return <span className="text-xl">✅</span>;
      case "missed":
        return <span className="text-xl">❌</span>;
      case "future":
        return <span className="text-lg opacity-30">⚪️</span>;
      case "today":
        return <span className="text-xl animate-pulse">⭕️</span>;
    }
  };

  const getStatusBg = (status: DayStatus) => {
    switch (status) {
      case "completed":
        return "bg-green-100 dark:bg-green-950 border border-green-300 dark:border-green-800";
      case "missed":
        return "bg-red-100 dark:bg-red-950 border border-red-300 dark:border-red-800";
      case "future":
        return "bg-muted/30 border border-transparent";
      case "today":
        return "bg-blue-100 dark:bg-blue-950 border-2 border-blue-500 dark:border-blue-600";
    }
  };

  const getStatusLabel = (status: DayStatus) => {
    switch (status) {
      case "completed":
        return "Bajarilgan";
      case "missed":
        return "O'tkazib yuborilgan";
      case "future":
        return "Kelajak";
      case "today":
        return "Bugun";
    }
  };

  return (
    <div className="w-full" data-testid="container-calendar">
      {/* Legend */}
      <div className="flex gap-4 justify-center mb-4 text-xs flex-wrap">
        <div className="flex items-center gap-1">
          <span>✅</span>
          <span className="text-muted-foreground">Bajarilgan</span>
        </div>
        <div className="flex items-center gap-1">
          <span>❌</span>
          <span className="text-muted-foreground">O'tkazib yuborilgan</span>
        </div>
        <div className="flex items-center gap-1">
          <span>⭕️</span>
          <span className="text-muted-foreground">Bugun</span>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-2 mb-3">
        {weekDays.map((day, idx) => (
          <div
            key={day}
            className="text-xs text-center text-muted-foreground font-semibold"
            data-testid={`text-weekday-${idx}`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.02, duration: 0.2 }}
            className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-1 ${getStatusBg(day.status)} transition-all hover:scale-105`}
            data-testid={`day-${day.date}-${day.status}`}
            title={getStatusLabel(day.status)}
          >
            <div className="text-xs font-semibold text-foreground">{day.date}</div>
            {getStatusIcon(day.status)}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
