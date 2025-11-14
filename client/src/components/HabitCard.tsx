import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface HabitCardProps {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  streak: number;
  progress: number;
  completedToday: boolean | null;
  onClick?: () => void;
}

export default function HabitCard({
  name,
  description,
  icon = "🎯",
  streak,
  progress,
  completedToday,
  onClick,
}: HabitCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      data-testid={`card-habit-${name.toLowerCase().replace(/\s/g, '-')}`}
    >
      <Card
        className="relative overflow-hidden cursor-pointer bg-gradient-to-br from-card to-card/90 border-2 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
        onClick={onClick}
        data-testid="button-habit-card"
      >
        {/* Completed Badge */}
        {completedToday === true && (
          <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
            ✓ Bajarildi
          </div>
        )}
        {completedToday === false && (
          <div className="absolute top-0 right-0 bg-orange-400 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
            O'tkazildi
          </div>
        )}

        <div className="p-5">
          {/* Header with Icon and Name */}
          <div className="flex items-start gap-4 mb-3">
            <motion.div
              className="text-4xl flex-shrink-0"
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              {icon}
            </motion.div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-foreground truncate mb-1" data-testid="text-habit-name">
                {name}
              </h3>
              {description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {description}
                </p>
              )}
            </div>

            <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" />
          </div>

          {/* Streak and Progress */}
          <div className="space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl" data-testid="icon-streak">🔥</span>
                <span className="text-lg font-bold text-foreground" data-testid="text-streak">
                  {streak} kun
                </span>
              </div>
              <div className="text-sm font-semibold text-muted-foreground">
                {progress}% bajarildi
              </div>
            </div>

            <div className="relative">
              <Progress 
                value={progress} 
                className="h-3 bg-muted" 
                data-testid="progress-habit"
              />
              {progress >= 100 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-1 -top-1 text-2xl"
                >
                  🎉
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Gradient overlay for visual appeal */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50" />
      </Card>
    </motion.div>
  );
}
