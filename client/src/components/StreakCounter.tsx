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
      className="flex flex-col items-center justify-center py-8 px-6"
      data-testid="container-streak-counter"
    >
      {/* Fire icon with glow effect */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="text-8xl mb-4 drop-shadow-2xl"
        data-testid="icon-streak-large"
      >
        🔥
      </motion.div>

      {/* Streak number with gradient */}
      <div className="relative mb-3" data-testid="text-streak-count">
        <div className="text-7xl font-black bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
          {streak}
        </div>
      </div>

      {/* Label with better styling */}
      <div className="text-lg font-medium text-muted-foreground tracking-wide" data-testid="text-streak-label">
        kun ketma-ket 🎯
      </div>

      {/* Motivational message */}
      {streak > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-sm text-center text-muted-foreground max-w-xs"
        >
          {streak >= 21 && "🏆 Ajoyib! Odat shakllanmoqda!"}
          {streak >= 7 && streak < 21 && "💪 Zo'r! Davom eting!"}
          {streak >= 3 && streak < 7 && "🚀 Yaxshi boshladingiz!"}
          {streak < 3 && "✨ Har bir kun muhim!"}
        </motion.div>
      )}
    </motion.div>
  );
}
