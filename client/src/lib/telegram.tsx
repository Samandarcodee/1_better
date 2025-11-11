import { createContext, useContext, useEffect, ReactNode } from "react";
import WebApp from "@twa-dev/sdk";

interface TelegramContextType {
  webApp: typeof WebApp;
  user: typeof WebApp.initDataUnsafe.user | undefined;
}

const TelegramContext = createContext<TelegramContextType | null>(null);

export function TelegramProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
    WebApp.enableClosingConfirmation();
    
    WebApp.setHeaderColor("#2563EB");
    WebApp.setBackgroundColor("#F8FAFC");

    const root = document.documentElement;
    if (WebApp.colorScheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, []);

  const value: TelegramContextType = {
    webApp: WebApp,
    user: WebApp.initDataUnsafe.user,
  };

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  );
}

export function useTelegram() {
  const context = useContext(TelegramContext);
  if (!context) {
    return {
      webApp: WebApp,
      user: undefined,
    };
  }
  return context;
}
