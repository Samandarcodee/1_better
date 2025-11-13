import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface StreakCounterProps {
  streak: number;
}

export default function StreakCounter({ streak }: StreakCounterProps) {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full"
      data-testid="container-streak-counter"
    >
      {/* Card container */}
      <div className="bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-orange-950/30 dark:via-red-950/30 dark:to-pink-950/30 rounded-2xl p-6 border border-orange-200/50 dark:border-orange-800/50 shadow-lg">
        <div className="flex flex-col items-center justify-center">
          {/* Small flame icon */}
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="mb-4"
            data-testid="icon-streak-small"
          >
            <Flame className="w-8 h-8 text-orange-500 dark:text-orange-400" fill="currentColor" />
          </motion.div>

          {/* Streak number with gradient */}
          <div className="relative mb-2" data-testid="text-streak-count">
            <div className="text-6xl font-black bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
              {streak}
            </div>
          </div>

          {/* Label */}
          <div className="text-base font-semibold text-foreground mb-1" data-testid="text-streak-label">
            Kun ketma-ket
          </div>

          {/* Progress indicator */}
          <div className="w-full max-w-xs mt-4">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((streak / 21) * 100, 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <div className="text-xs text-muted-foreground text-center mt-2">
              {streak < 21 ? `${21 - streak} kun qoldi` : "Odat shakllandi! 🎉"}
            </div>
          </div>

          {/* Motivational message */}
          {streak > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4 text-sm text-center text-muted-foreground max-w-xs font-medium"
            >
              {streak >= 21 && "🏆 Ajoyib! Odat to'liq shakllandi!"}
              {streak >= 7 && streak < 21 && "💪 Zo'r! Davom eting, yaqinlashyapsiz!"}
              {streak >= 3 && streak < 7 && "🚀 Yaxshi boshladingiz!"}
              {streak < 3 && streak > 0 && "✨ Har bir kun muhim!"}
            </motion.div>
          )}

          {/* Empty state */}
          {streak === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-sm text-center text-muted-foreground"
            >
              <p className="font-medium">Bugun birinchi kunni boshlang!</p>
              <p className="text-xs mt-1">Odatni bajarib, streak'ni boshlang</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
