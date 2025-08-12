"use client";
import { useTelegramWebApp } from "@/hooks/useTelegramWebApp";
import { useRouter } from "next/navigation";
import { useState } from "react";

import TelegramWebAppScript from "@/components/TelegramWebAppScript";
import JoinLobbyModal from "@/components/JoinLobbyModal";
import Image from "next/image";

// (moved mock players to /game route)

export default function Home() {
  const { user } = useTelegramWebApp();
  const router = useRouter();
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const displayName = user?.username
    ? `@${user.username}`
    : user?.first_name || "Guest";

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

        {/* Header */}
        <header className="relative z-10 w-full flex items-center justify-between px-6 py-4 backdrop-blur-sm bg-white/5 border-b border-white/10 shadow-lg">
          <h1 className="text-lg font-semibold tracking-wide drop-shadow-[0_0_6px_rgba(255,255,255,0.35)]">
            TONgue
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-600/30 to-blue-600/30 border border-white/10 shadow-inner backdrop-blur-sm">
              {displayName}
            </span>
          </div>
        </header>

        {/* Main content */}
        <main className="relative z-10 flex flex-col items-center justify-center gap-10 px-4 py-10">
          <div className="w-full max-w-4xl flex flex-col items-center gap-10">
            <div className="flex flex-col items-center gap-8 mt-4">
              <div className="relative w-28 h-28 select-none">
                <div className="absolute inset-0 rounded-full blur-2xl bg-gradient-to-br from-pink-500/60 to-blue-600/60 animate-pulseSlow" />
                <Image
                  src="/tongue.svg"
                  alt="Tongue icon"
                  fill
                  priority
                  className="object-contain relative z-10 drop-shadow-[0_0_12px_rgba(255,120,220,0.65)] opacity-95"
                />
              </div>
              <div className="flex flex-col gap-4 w-full items-stretch max-w-sm">
                <MenuButton
                  label="FIND MATCH"
                  onClick={() => router.push("/game")}
                />
                <MenuButton
                  label="CREATE LOBBY"
                  onClick={() => router.push("/lobby")}
                />
                <MenuButton
                  label="JOIN LOBBY"
                  onClick={() => setShowJoinModal(true)}
                />
                <MenuButton
                  label="MY STATS"
                  onClick={() => alert("Stats coming soon")}
                />
              </div>
            </div>
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

      {/* Local styles for animation */}
      <style jsx global>{`
        @keyframes pulseSlow {
          0%,
          100% {
            opacity: 0.9;
          }
          50% {
            opacity: 1;
          }
        }
        .animate-pulseSlow {
          animation: pulseSlow 8s ease-in-out infinite;
        }
        @keyframes gradientMove {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradientMove 6s ease-in-out infinite;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 600ms ease forwards;
        }
        .menu-btn {
          position: relative;
        }
        .menu-btn:before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          padding: 1px;
          background: linear-gradient(90deg, #ff2fb4, #6a00ff, #0084ff);
          -webkit-mask: linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0.85;
        }
      `}</style>
    </>
  );
}

interface MenuButtonProps {
  label: string;
  onClick: () => void;
}
function MenuButton({ label, onClick }: MenuButtonProps) {
  return (
    <button
      onClick={onClick}
      className="menu-btn group relative w-full px-10 py-4 text-base font-semibold rounded-full overflow-hidden transition focus:outline-none focus:ring-2 focus:ring-pink-500/60"
    >
      <span className="absolute inset-0 bg-gradient-to-r from-pink-600 via-fuchsia-600 to-blue-600 opacity-80 group-hover:opacity-100 transition animate-gradient-x" />
      <span className="absolute inset-0 opacity-0 group-hover:opacity-40 transition bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent_60%)]" />
      <span className="relative tracking-wide drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]">
        {label}
      </span>
    </button>
  );
}

// JoinLobbyModal extracted into components/JoinLobbyModal
