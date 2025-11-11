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
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const getStatusIcon = (status: DayStatus) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case "missed":
        return <XCircle className="w-5 h-5 text-destructive" />;
      case "future":
        return <Circle className="w-5 h-5 text-muted-foreground/30" />;
      case "today":
        return <Circle className="w-5 h-5 text-primary" />;
    }
  };

  const getStatusBg = (status: DayStatus) => {
    switch (status) {
      case "completed":
        return "bg-success/10";
      case "missed":
        return "bg-destructive/10";
      case "future":
        return "bg-muted/30";
      case "today":
        return "bg-primary/10";
    }
  };

  return (
    <div className="w-full" data-testid="container-calendar">
      <div className="grid grid-cols-7 gap-2 mb-3">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-xs text-center text-muted-foreground font-medium"
            data-testid={`text-weekday-${day.toLowerCase()}`}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.02, duration: 0.2 }}
            className={`aspect-square rounded-md flex flex-col items-center justify-center gap-1 ${getStatusBg(day.status)}`}
            data-testid={`day-${day.date}-${day.status}`}
          >
            <div className="text-xs font-medium text-foreground">{day.date}</div>
            {getStatusIcon(day.status)}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
