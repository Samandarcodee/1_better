import { QueryClient, QueryFunction } from "@tanstack/react-query";
import WebApp from "@twa-dev/sdk";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Telegram headers'ni olish
function getTelegramHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  
  // Telegram initData'ni header'ga qo'shamiz
  if (WebApp.initData) {
    headers["x-telegram-init-data"] = WebApp.initData;
  }
  
  // Development mode'da test userId
  if (import.meta.env.DEV && !WebApp.initData) {
    headers["x-test-user-id"] = "123456789";
  }
  
  return headers;
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const telegramHeaders = getTelegramHeaders();
  const contentTypeHeader = data ? { "Content-Type": "application/json" } : {};
  
  const res = await fetch(url, {
    method,
    headers: {
      ...contentTypeHeader,
      ...telegramHeaders,
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const telegramHeaders = getTelegramHeaders();
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
      headers: telegramHeaders,
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
