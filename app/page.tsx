"use client";
import { useTelegramWebApp } from "@/hooks/useTelegramWebApp";
import { useRouter } from "next/navigation";
import { useState } from "react";

import TelegramWebAppScript from "@/src/components/TelegramWebAppScript";
import JoinLobbyModal from "@/src/components/joinLobbyModal";
import AppHeader from "@/src/components/layout/header";
import HomeMenu from "@/src/components/layout/homeMenu";
import { fetchCoins } from "@/src/actions/coins";

// (moved mock players to /game route)

export default function Home() {
  const { user } = useTelegramWebApp();
  const router = useRouter();
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const displayName = user?.first_name
    ? `${user.first_name}`
    : user?.first_name || "Guest";

  // handleMyStats imported from actions

  return (
    <>
      <TelegramWebAppScript />
      {/* Background layer with neon gradient */}
      <div className="relative min-h-screen w-full text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#080317] via-[#1d0b33] to-[#001a44]" />
        {/* Soft animated neon gradient overlay */}
        <div className="pointer-events-none absolute inset-0 [background:radial-gradient(circle_at_20%_30%,rgba(255,0,128,0.35),transparent_60%),radial-gradient(circle_at_80%_70%,rgba(0,128,255,0.35),transparent_65%)] animate-pulseSlow" />
        {/* Extra glow circles */}
        <div className="pointer-events-none absolute -left-40 -top-40 h-80 w-80 rounded-full bg-pink-600/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 -bottom-40 h-96 w-96 rounded-full bg-blue-600/30 blur-3xl" />

        <AppHeader displayName={displayName} />

        {/* Main content */}
        <main className="relative z-10 flex flex-col items-center justify-center gap-10 px-4 py-10">
          <div className="w-full max-w-4xl flex flex-col items-center gap-10">
            <HomeMenu
              onFindMatch={() => router.push("/game")}
              onCreateLobby={() => router.push("/lobby")}
              onJoinLobby={() => setShowJoinModal(true)}
              onStats={fetchCoins}
            />
          </div>
        </main>
        {showJoinModal && (
          <JoinLobbyModal
            code={joinCode}
            onChangeCode={(v: string) => {
              const digits = v.replace(/\D/g, "").slice(0, 6);
              setJoinCode(digits);
            }}
            onClose={() => {
              setShowJoinModal(false);
              setJoinCode("");
            }}
            onSubmit={() => {
              if (joinCode.length === 6) {
                router.push(`/lobby?code=${joinCode}`);
              }
            }}
          />
        )}
      </div>
    </>
  );
}

// MenuButton moved to components/menuButton

// JoinLobbyModal extracted into components/JoinLobbyModal
