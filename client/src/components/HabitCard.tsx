import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";

interface HabitCardProps {
  id: number;
  name: string;
  streak: number;
  progress: number;
  completedToday: boolean | null;
  onClick?: () => void;
}

export default function HabitCard({
  name,
  streak,
  progress,
  completedToday,
  onClick,
}: HabitCardProps) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      data-testid={`card-habit-${name.toLowerCase().replace(/\s/g, '-')}`}
    >
      <Card
        className="p-6 cursor-pointer hover-elevate active-elevate-2"
        onClick={onClick}
        data-testid="button-habit-card"
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <h3 className="text-lg font-semibold text-foreground" data-testid="text-habit-name">
            {name}
          </h3>
          <div className="flex-shrink-0">
            {completedToday === true && (
              <CheckCircle2
                className="w-6 h-6 text-success"
                data-testid="icon-completed"
              />
            )}
            {completedToday === false && (
              <XCircle
                className="w-6 h-6 text-destructive"
                data-testid="icon-skipped"
              />
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl" data-testid="icon-streak">🔥</span>
          <span className="text-base font-semibold text-foreground" data-testid="text-streak">
            {streak} kun
          </span>
        </div>

        <Progress value={progress} className="h-2" data-testid="progress-habit" />
      </Card>
    </motion.div>
  );
}
