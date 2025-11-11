import { useState } from "react";
import { motion } from "framer-motion";

interface DurationChipsProps {
  onSelect?: (duration: number) => void;
  selected?: number;
}

export default function DurationChips({ onSelect, selected }: DurationChipsProps) {
  const [selectedDuration, setSelectedDuration] = useState<number>(selected || 21);

  const durations = [
    { value: 7, label: "7 days" },
    { value: 21, label: "21 days" },
    { value: 30, label: "30 days" },
    { value: 60, label: "60 days" },
    { value: 90, label: "90 days" },
  ];

  const handleSelect = (value: number) => {
    setSelectedDuration(value);
    onSelect?.(value);
    console.log(`Duration selected: ${value} days`);
  };

  return (
    <div className="flex flex-wrap gap-3" data-testid="container-duration-chips">
      {durations.map((duration) => (
        <motion.button
          key={duration.value}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSelect(duration.value)}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            selectedDuration === duration.value
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground hover-elevate active-elevate-2"
          }`}
          data-testid={`chip-duration-${duration.value}`}
        >
          {duration.label}
        </motion.button>
      ))}
    </div>
  );
}
