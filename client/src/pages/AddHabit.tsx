import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import DurationChips from "@/components/DurationChips";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { InsertHabit } from "@shared/schema";
import { useTelegram } from "@/lib/telegram";

export default function AddHabit() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [habitName, setHabitName] = useState("");
  const [description, setDescription] = useState("");
  const [isGoodHabit, setIsGoodHabit] = useState(true);
  const [duration, setDuration] = useState(21);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime1, setReminderTime1] = useState("09:00");
  const [reminderTime2, setReminderTime2] = useState("14:00");
  const [reminderTime3, setReminderTime3] = useState("20:00");
  const { webApp } = useTelegram();

  useEffect(() => {
    webApp.BackButton.show();
    webApp.BackButton.onClick(() => {
      setLocation("/");
    });

    return () => {
      webApp.BackButton.hide();
      webApp.BackButton.offClick(() => {
        setLocation("/");
      });
    };
  }, [webApp, setLocation]);

  const createHabitMutation = useMutation({
    mutationFn: async (data: InsertHabit) => {
      return apiRequest("POST", "/api/habits", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/habits"] });
      toast({
        description: "Yangi odat qo'shildi! 🎉",
      });
      setTimeout(() => {
        setLocation("/");
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

    const reminderTimes = reminderEnabled 
      ? [reminderTime1, reminderTime2, reminderTime3].filter(t => t).join(',')
      : undefined;

    createHabitMutation.mutate({
      name: habitName,
      description: description.trim() || undefined,
      isGoodHabit,
      duration,
      reminderEnabled,
      reminderTime: reminderTimes,
    });
  };

  return (
    <div className="min-h-screen bg-background" data-testid="page-add-habit">
      <div className="max-w-2xl mx-auto px-6 py-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation("/")}
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
          <h2 className="text-2xl font-semibold text-center mb-8 text-foreground" data-testid="text-page-title">
            Yangi Odat Qo'shish
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Habit Name */}
            <div className="space-y-3">
              <Label htmlFor="habit-name" className="text-base">
                Odat nomi *
              </Label>
              <Input
                id="habit-name"
                type="text"
                placeholder="Masalan: Ertalab yugurish"
                value={habitName}
                onChange={(e) => setHabitName(e.target.value)}
                className="text-base h-12"
                data-testid="input-habit-name"
              />
            </div>

            {/* Description */}
            <div className="space-y-3">
              <Label htmlFor="description" className="text-base">
                Izoh <span className="text-muted-foreground text-sm">(ixtiyoriy)</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Ushbu odat nima uchun muhim? Maqsadingiz nima?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-base min-h-[80px] resize-none"
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground text-right">
                {description.length}/200
              </p>
            </div>

            {/* Habit Type */}
            <div className="flex items-center justify-between p-5 bg-card rounded-lg border">
              <div className="space-y-1">
                <Label htmlFor="habit-type" className="text-base">
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
            </div>

            {/* Duration */}
            <div className="space-y-4">
              <Label className="text-base">Muddat</Label>
              <DurationChips selected={duration} onSelect={setDuration} />
            </div>

            {/* Reminder Settings */}
            <div className="space-y-4 p-5 bg-card rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="reminder-enabled" className="text-base">
                    Eslatma ⏰
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Kuniga 3 marta eslatish
                  </p>
                </div>
                <Switch
                  id="reminder-enabled"
                  checked={reminderEnabled}
                  onCheckedChange={setReminderEnabled}
                />
              </div>

              {reminderEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 pt-4 border-t"
                >
                  <Label className="text-sm font-medium">Eslatma vaqtlari:</Label>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label htmlFor="time1" className="text-xs text-muted-foreground">Ertalab</Label>
                      <Input
                        id="time1"
                        type="time"
                        value={reminderTime1}
                        onChange={(e) => setReminderTime1(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="time2" className="text-xs text-muted-foreground">Kunduzi</Label>
                      <Input
                        id="time2"
                        type="time"
                        value={reminderTime2}
                        onChange={(e) => setReminderTime2(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="time3" className="text-xs text-muted-foreground">Kechqurun</Label>
                      <Input
                        id="time3"
                        type="time"
                        value={reminderTime3}
                        onChange={(e) => setReminderTime3(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    💡 Har bir vaqtda motivatsion xabar bilan eslatma keladi
                  </p>
                </motion.div>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full text-lg h-14"
              disabled={createHabitMutation.isPending}
              data-testid="button-start"
            >
              {createHabitMutation.isPending ? "Yuklanmoqda..." : "Boshlash"}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
