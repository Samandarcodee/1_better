import { motion } from "framer-motion";

interface CircularProgressProps {
  percentage: number;
  size?: number;
}

export default function CircularProgress({
  percentage,
  size = 120,
}: CircularProgressProps) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  // Color gradient based on percentage
  const getProgressColor = () => {
    if (percentage >= 75) return "url(#gradient-green)";
    if (percentage >= 50) return "url(#gradient-blue)";
    if (percentage >= 25) return "url(#gradient-orange)";
    return "url(#gradient-red)";
  };

  return (
    <div className="flex flex-col items-center gap-4" data-testid="container-circular-progress">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90 drop-shadow-lg"
          data-testid="svg-progress"
        >
          {/* Define gradients */}
          <defs>
            <linearGradient id="gradient-green" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <linearGradient id="gradient-orange" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="gradient-red" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>

          {/* Background circle with glow */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={strokeWidth}
            opacity="0.2"
          />
          
          {/* Progress circle with animation */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={getProgressColor()}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{
              filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))",
            }}
          />
        </svg>

        {/* Center content with animation */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <span className="text-4xl font-black bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent" data-testid="text-percentage">
            {percentage}%
          </span>
          <span className="text-xs text-muted-foreground mt-1 font-medium">
            bajarildi
          </span>
        </motion.div>

        {/* Celebration effect at 100% */}
        {percentage === 100 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center text-4xl"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0] }}
            transition={{ duration: 1, delay: 1 }}
          >
            🎉
          </motion.div>
        )}
      </div>
    </div>
  );
}
