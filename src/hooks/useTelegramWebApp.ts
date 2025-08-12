import { useEffect, useState } from "react";

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

  useEffect(() => {
    // Добавляем небольшую задержку, чтобы скрипт Telegram успел загрузиться
    const timer = setTimeout(() => {
      console.log("🔍 Checking Telegram WebApp availability...");
      console.log("window.Telegram:", window.Telegram);
      console.log("window.Telegram?.WebApp:", window.Telegram?.WebApp);

      // Проверяем, что мы в среде Telegram WebApp
      if (typeof window !== "undefined" && window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;

        console.log("🚀 Telegram WebApp found! Initializing...");

        // Инициализируем WebApp
        tg.ready();

        // Расширяем окно на весь экран
        tg.expand();

        setWebApp(tg);

        console.log("📊 Full Telegram WebApp object:", tg);
        console.log("📊 initData:", tg.initData);
        console.log("📊 initDataUnsafe:", tg.initDataUnsafe);

        // Получаем данные пользователя
        if (tg.initDataUnsafe?.user) {
          console.log("✅ Real user data found:", tg.initDataUnsafe.user);
          setUser(tg.initDataUnsafe.user);
        } else {
          console.log("❌ No user data in initDataUnsafe, using mock data");
          // Если нет данных пользователя в Telegram, все равно используем mock
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
        // Для разработки вне Telegram - создаем mock данные
        setUser({
          id: 123456789,
          first_name: "Test",
          last_name: "User",
          username: "testuser",
          language_code: "en",
          is_premium: false
        });
        setIsLoading(false);

        console.log("Running outside Telegram WebApp - using mock data");
      }
    }, 100); // Небольшая задержка для загрузки скрипта

    return () => clearTimeout(timer);
  }, []);

  return {
    webApp,
    user,
    isLoading,
    isInTelegram: !!webApp
  };
};
