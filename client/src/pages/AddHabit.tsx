import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import DurationChips from "@/components/DurationChips";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { InsertHabit, Habit } from "@shared/schema";
import { useTelegram } from "@/lib/telegram";

// Tanlash uchun emoji icons
const ICON_OPTIONS = ["🎯", "💪", "📚", "🏃", "🧘", "💧", "🥗", "😴", "✍️", "🎨", "🎵", "🚫"];

export default function AddHabit() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [habitName, setHabitName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("🎯");
  const [isGoodHabit, setIsGoodHabit] = useState(true);
  const [duration, setDuration] = useState(21);
  const { webApp } = useTelegram();
  
  // Edit mode - check if we have habitId in route
  const [match, params] = useRoute("/edit/:id");
  const isEditMode = !!match;
  const habitId = params?.id;

  // Load habit data if in edit mode
  const { data: existingHabit } = useQuery<Habit>({
    queryKey: [`/api/habits/${habitId}`],
    enabled: isEditMode && !!habitId,
  });

  useEffect(() => {
    if (existingHabit && isEditMode) {
      setHabitName(existingHabit.name);
      setDescription(existingHabit.description || "");
      setIcon(existingHabit.icon || "🎯");
      setIsGoodHabit(existingHabit.isGoodHabit);
      setDuration(existingHabit.duration);
    }
  }, [existingHabit, isEditMode]);

  useEffect(() => {
    webApp.BackButton.show();
    webApp.BackButton.onClick(() => {
      if (isEditMode && habitId) {
        setLocation(`/habit/${habitId}`);
      } else {
        setLocation("/");
      }
    });

    return () => {
      webApp.BackButton.hide();
      webApp.BackButton.offClick(() => {
        if (isEditMode && habitId) {
          setLocation(`/habit/${habitId}`);
        } else {
          setLocation("/");
        }
      });
    };
  }, [webApp, setLocation, isEditMode, habitId]);

  const createHabitMutation = useMutation({
    mutationFn: async (data: any) => {
      if (isEditMode && habitId) {
        return apiRequest("PATCH", `/api/habits/${habitId}`, data);
      }
      return apiRequest("POST", "/api/habits", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/habits"] });
      if (isEditMode && habitId) {
        queryClient.invalidateQueries({ queryKey: [`/api/habits/${habitId}`] });
      }
      toast({
        description: isEditMode ? "Odat yangilandi! ✨" : "Yangi odat qo'shildi! 🎉",
      });
      setTimeout(() => {
        if (isEditMode && habitId) {
          setLocation(`/habit/${habitId}`);
        } else {
          setLocation("/");
        }
      }, 1000);
    },
    onError: () => {
      toast({
        description: "Xatolik yuz berdi",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!habitName.trim()) {
      toast({
        description: "Iltimos, odat nomini kiriting",
        variant: "destructive",
      });
      return;
    }

    createHabitMutation.mutate({
      name: habitName,
      description: description.trim() || undefined,
      icon,
      isGoodHabit,
      duration,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-50/30" data-testid="page-add-habit">
      <div className="max-w-2xl mx-auto px-6 py-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            if (isEditMode && habitId) {
              setLocation(`/habit/${habitId}`);
            } else {
              setLocation("/");
            }
          }}
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
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block mb-4"
            >
              <Sparkles className="w-12 h-12 text-blue-500" />
            </motion.div>
            <h2 className="text-3xl font-bold text-foreground mb-2" data-testid="text-page-title">
              {isEditMode ? "Odatni Tahrirlash" : "Yangi Odat Qo'shish"}
            </h2>
            <p className="text-muted-foreground">
              {isEditMode ? "O'zgarishlarni saqlang" : "Hayotingizni o'zgartiring, bitta odat bilan"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Icon Selector */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-3"
            >
              <Label className="text-base font-semibold">Icon tanlang</Label>
              <div className="flex flex-wrap gap-2">
                {ICON_OPTIONS.map((emoji) => (
                  <motion.button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      setIcon(emoji);
                      webApp.HapticFeedback.impactOccurred("light");
                    }}
                    className={`text-3xl p-3 rounded-xl transition-all ${
                      icon === emoji
                        ? "bg-blue-500 shadow-lg scale-110"
                        : "bg-card hover:bg-accent hover:scale-105"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Habit Name */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <Label htmlFor="habit-name" className="text-base font-semibold">
                Odat nomi *
              </Label>
              <Input
                id="habit-name"
                type="text"
                placeholder="Masalan: Ertalab yugurish"
                value={habitName}
                onChange={(e) => setHabitName(e.target.value)}
                className="text-base h-12 border-2"
                data-testid="input-habit-name"
              />
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              <Label htmlFor="description" className="text-base font-semibold">
                Izoh <span className="text-muted-foreground font-normal">(ixtiyoriy)</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Ushbu odat nima uchun muhim? Maqsadingiz nima?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-base min-h-[100px] resize-none border-2"
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground text-right">
                {description.length}/200
              </p>
            </motion.div>

            {/* Habit Type */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-between p-5 bg-card rounded-xl border-2 border-border shadow-sm"
            >
              <div className="space-y-1">
                <Label htmlFor="habit-type" className="text-base font-semibold">
                  Odat turi
                </Label>
                <p className="text-sm text-muted-foreground">
                  {isGoodHabit ? "Yaxshi odat ✅" : "Yomon odat ❌"}
                </p>
              </div>
              <Switch
                id="habit-type"
                checked={isGoodHabit}
                onCheckedChange={setIsGoodHabit}
                data-testid="switch-habit-type"
              />
            </motion.div>

            {/* Duration */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <Label className="text-base font-semibold">Muddat</Label>
              <DurationChips selected={duration} onSelect={setDuration} />
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                type="submit"
                size="lg"
                className="w-full text-lg h-14 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                disabled={createHabitMutation.isPending}
                data-testid="button-start"
              >
                {createHabitMutation.isPending
                  ? "Yuklanmoqda..."
                  : isEditMode
                  ? "Saqlash ✨"
                  : "Boshlash 🚀"}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
