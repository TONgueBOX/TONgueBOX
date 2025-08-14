import { useEffect, useState } from "react";
import { useGlobalLoader } from "@/hooks/useGlobalLoader";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: TelegramUser;
    chat_type?: string;
    chat_instance?: string;
    start_param?: string;
    auth_date?: number;
    hash?: string;
  };
  version: string;
  platform: string;
  colorScheme: "light" | "dark";
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  isClosingConfirmationEnabled: boolean;
  headerColor: string;
  backgroundColor: string;
  BackButton: {
    isVisible: boolean;
    show(): void;
    hide(): void;
  };
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isProgressVisible: boolean;
    isActive: boolean;
    show(): void;
    hide(): void;
    enable(): void;
    disable(): void;
    showProgress(leaveActive?: boolean): void;
    hideProgress(): void;
    setText(text: string): void;
    onClick(callback: () => void): void;
    offClick(callback: () => void): void;
  };
  ready(): void;
  expand(): void;
  close(): void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export const useTelegramWebApp = () => {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Global loader (provider expected in app layout)
  const loader = useGlobalLoader();

  useEffect(() => {
    // Add a short delay so the Telegram script has time to load
    const timer = setTimeout(() => {
      loader?.show("Connecting Telegram...");
      console.log("🔍 Checking Telegram WebApp availability...");
      console.log("window.Telegram:", window.Telegram);
      console.log("window.Telegram?.WebApp:", window.Telegram?.WebApp);

      // Check that we're inside the Telegram WebApp environment
      if (typeof window !== "undefined" && window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;

        console.log("🚀 Telegram WebApp found! Initializing...");

        // Initialize the WebApp
        tg.ready();

        // Expand viewport to full height
        tg.expand();

        setWebApp(tg);

        console.log("📊 Full Telegram WebApp object:", tg);
        console.log("📊 initData:", tg.initData);
        console.log("📊 initDataUnsafe:", tg.initDataUnsafe);

        // Retrieve user data
        if (tg.initDataUnsafe?.user) {
          console.log("✅ Real user data found:", tg.initDataUnsafe.user);
          setUser(tg.initDataUnsafe.user);
        } else {
          console.log("❌ No user data in initDataUnsafe, using mock data");
          // If Telegram user data is absent, fall back to mock user
          setUser({
            id: 123456789,
            first_name: "Telegram",
            last_name: "User",
            username: "telegramuser",
            language_code: "en",
            is_premium: false
          });
        }
        setIsLoading(false);
        loader.hide();

        console.log("Telegram WebApp initialized:", {
          user: tg.initDataUnsafe?.user,
          initData: tg.initData,
          initDataUnsafe: tg.initDataUnsafe,
          platform: tg.platform,
          version: tg.version,
          isInTelegram: true
        });
      } else {
        console.log("❌ Telegram WebApp not found, using mock data");
        // Outside Telegram (local dev) - provide mock user data
        setUser({
          id: 123456789,
          first_name: "Test",
          last_name: "User",
          username: "testuser",
          language_code: "en",
          is_premium: false
        });
        setIsLoading(false);
        loader.hide();

        console.log("Running outside Telegram WebApp - using mock data");
      }
    }, 100); // Small delay to allow script loading

    return () => {
      clearTimeout(timer);
      loader.hide();
    };
  }, [loader]);

  return {
    webApp,
    user,
    isLoading,
    isInTelegram: !!webApp
  };
};
