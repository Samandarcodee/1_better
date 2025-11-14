import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TelegramProvider } from "@/lib/telegram";
import Home from "@/pages/Home";
import HabitDetail from "@/pages/HabitDetail";
import AddHabit from "@/pages/AddHabit";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/habit/:id" component={HabitDetail} />
      <Route path="/add" component={AddHabit} />
      <Route path="/edit/:id" component={AddHabit} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TelegramProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </TelegramProvider>
    </QueryClientProvider>
  );
}

export default App;
