"use client";

import Image from "next/image";
import { useTelegramWebApp } from "../../hooks/useTelegramWebApp";

export default function TelegramUserInfo() {
  const { user, webApp, isLoading, isInTelegram } = useTelegramWebApp();

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="text-gray-600">Loading Telegram data...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            ❌ No Telegram User Data
          </h2>
          <p className="text-gray-600">
            This app should be opened from Telegram Mini App
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🤖 Telegram User Info
          </h1>
          <p className="text-sm text-gray-500">
            {isInTelegram
              ? "Running in Telegram WebApp"
              : "Mock data for development"}
          </p>
        </div>

        {/* User Avatar and Basic Info */}
        <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold overflow-hidden shadow-lg">
            {user.photo_url ? (
              <Image
                src={user.photo_url}
                alt={`${user.first_name} avatar`}
                className="w-full h-full object-cover"
                width={64}
                height={64}
                onError={(e) => {
                  // Если картинка не загрузилась, показываем букву
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  if (target.nextSibling) {
                    (target.nextSibling as HTMLElement).style.display = "flex";
                  }
                }}
              />
            ) : null}
            <div
              className={`w-full h-full flex items-center justify-center ${
                user.photo_url ? "hidden" : ""
              }`}
              style={{ display: user.photo_url ? "none" : "flex" }}
            >
              {user.first_name?.charAt(0)?.toUpperCase() || "?"}
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800">
              {user.first_name} {user.last_name || ""}
            </h2>
            {user.username && <p className="text-blue-600">@{user.username}</p>}
            <p className="text-sm text-gray-500">ID: {user.id}</p>
          </div>
          {user.is_premium && (
            <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              ⭐ Premium
            </div>
          )}
        </div>

        {/* User Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">User Details</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">First Name:</span>{" "}
                {user.first_name}
              </div>
              {user.last_name && (
                <div>
                  <span className="font-medium">Last Name:</span>{" "}
                  {user.last_name}
                </div>
              )}
              {user.username && (
                <div>
                  <span className="font-medium">Username:</span> @
                  {user.username}
                </div>
              )}
              {user.language_code && (
                <div>
                  <span className="font-medium">Language:</span>{" "}
                  {user.language_code}
                </div>
              )}
              <div>
                <span className="font-medium">Premium:</span>{" "}
                {user.is_premium ? "Yes" : "No"}
              </div>
            </div>
          </div>

          {webApp && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">WebApp Info</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Platform:</span>{" "}
                  {webApp.platform}
                </div>
                <div>
                  <span className="font-medium">Version:</span> {webApp.version}
                </div>
                <div>
                  <span className="font-medium">Color Scheme:</span>{" "}
                  {webApp.colorScheme}
                </div>
                <div>
                  <span className="font-medium">Viewport Height:</span>{" "}
                  {webApp.viewportHeight}px
                </div>
                <div>
                  <span className="font-medium">Expanded:</span>{" "}
                  {webApp.isExpanded ? "Yes" : "No"}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Raw Data (for debugging) */}
        {webApp && (
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">
              Raw initDataUnsafe Object
            </h3>
            <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-40 text-gray-900">
              {JSON.stringify(webApp.initDataUnsafe, null, 2)}
            </pre>
          </div>
        )}

        {/* Full WebApp Object */}
        {webApp && (
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">
              Full Telegram WebApp Object
            </h3>
            <div className="space-y-2">
              <div className="bg-white p-3 rounded border">
                <h4 className="font-medium text-sm text-gray-800 mb-1">
                  initData (raw authorization string):
                </h4>
                <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-20 text-black">
                  {webApp.initData || "No initData"}
                </pre>
              </div>

              <div className="bg-white p-3 rounded border">
                <h4 className="font-medium text-sm text-gray-800 mb-1">
                  Platform & Version:
                </h4>
                <p className="text-sm text-black">
                  Platform: {webApp.platform}
                </p>
                <p className="text-sm text-black">Version: {webApp.version}</p>
                <p className="text-sm text-black">
                  Color Scheme: {webApp.colorScheme}
                </p>
              </div>

              <div className="bg-white p-3 rounded border">
                <h4 className="font-medium text-sm text-gray-800 mb-1">
                  All Available Properties:
                </h4>
                <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-60 text-black">
                  {JSON.stringify(
                    {
                      initData: webApp.initData ? "present" : "missing",
                      initDataUnsafe: webApp.initDataUnsafe,
                      version: webApp.version,
                      platform: webApp.platform,
                      colorScheme: webApp.colorScheme,
                      themeParams: webApp.themeParams,
                      isExpanded: webApp.isExpanded,
                      viewportHeight: webApp.viewportHeight,
                      viewportStableHeight: webApp.viewportStableHeight,
                      headerColor: webApp.headerColor,
                      backgroundColor: webApp.backgroundColor,
                      // Функции не сериализуются, поэтому показываем их наличие
                      backButtonAvailable:
                        typeof webApp.BackButton === "object",
                      mainButtonAvailable: typeof webApp.MainButton === "object"
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Theme Colors */}
        {webApp?.themeParams && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Theme Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              {Object.entries(webApp.themeParams).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: value }}
                  ></div>
                  <span className="text-xs">
                    {key}: {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
