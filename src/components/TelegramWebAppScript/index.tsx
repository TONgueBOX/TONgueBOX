"use client";

import Script from "next/script";

export default function TelegramWebAppScript() {
  return (
    <Script
      src="https://telegram.org/js/telegram-web-app.js"
      strategy="afterInteractive"
      onLoad={() => {
        console.log("✅ Telegram WebApp script loaded successfully");
        console.log("window.Telegram after script load:", window.Telegram);
        if (window.Telegram?.WebApp) {
          console.log("✅ Telegram WebApp API available");
        } else {
          console.log("❌ Telegram WebApp API not available after script load");
        }
      }}
      onError={(e) => {
        console.error("❌ Failed to load Telegram WebApp script:", e);
      }}
    />
  );
}
