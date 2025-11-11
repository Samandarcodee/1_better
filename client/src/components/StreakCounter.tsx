import { motion } from "framer-motion";

interface StreakCounterProps {
  streak: number;
}

export default function StreakCounter({ streak }: StreakCounterProps) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-8"
      data-testid="container-streak-counter"
    >
      <div className="text-7xl mb-4" data-testid="icon-streak-large">
        🔥
      </div>
      <div className="text-6xl font-bold text-foreground mb-2" data-testid="text-streak-count">
        {streak}
      </div>
      <div className="text-lg text-muted-foreground" data-testid="text-streak-label">
        days streak
      </div>
    </motion.div>
  );
}
