import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import DurationChips from "@/components/DurationChips";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { InsertHabit } from "@shared/schema";

export default function AddHabit() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [habitName, setHabitName] = useState("");
  const [isGoodHabit, setIsGoodHabit] = useState(true);
  const [duration, setDuration] = useState(21);

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

    createHabitMutation.mutate({
      name: habitName,
      isGoodHabit,
      duration,
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

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <Label htmlFor="habit-name" className="text-base">
                Odat nomi
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

            <div className="flex items-center justify-between p-6 bg-card rounded-lg">
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

            <div className="space-y-4">
              <Label className="text-base">Muddat</Label>
              <DurationChips selected={duration} onSelect={setDuration} />
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
