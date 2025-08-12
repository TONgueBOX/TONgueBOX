"use client";

import WeightedSpinner from "@/src/components/WeightedSpinner";
import { Player } from "@/src/types";
import { useTelegramWebApp } from "@/src/hooks/useTelegramWebApp";
import { useRouter } from "next/navigation";

// Temporary mock data; replace with backend fetch later
const mockPlayers: Player[] = [
  { id: 1, name: "Player 1", color: "blue", weight: 40 },
  { id: 2, name: "Player 2", color: "red", weight: 15 },
  { id: 3, name: "Player 3", color: "green", weight: 1 },
  { id: 4, name: "Player 4", color: "yellow", weight: 10 },
  { id: 5, name: "Player 5", color: "purple", weight: 30 }
];

export default function GamePage() {
  const { user } = useTelegramWebApp();
  const displayName = user?.username
    ? `@${user.username}`
    : user?.first_name || "Guest";
  const router = useRouter();

  return (
    <div className="relative min-h-screen w-full text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#080317] via-[#1d0b33] to-[#001a44]" />
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(circle_at_20%_30%,rgba(255,0,128,0.35),transparent_60%),radial-gradient(circle_at_80%_70%,rgba(0,128,255,0.35),transparent_65%)] animate-pulseSlow" />
      <div className="pointer-events-none absolute -left-40 -top-40 h-80 w-80 rounded-full bg-pink-600/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 -bottom-40 h-96 w-96 rounded-full bg-blue-600/30 blur-3xl" />

      <header className="relative z-10 w-full flex items-center justify-between px-6 py-4 backdrop-blur-sm bg-white/5 border-b border-white/10 shadow-lg">
        <button
          onClick={() => router.push("/")}
          className="text-xs tracking-wide px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 transition border border-white/10"
        >
          ← Back
        </button>
        <h1 className="text-lg font-semibold tracking-wide drop-shadow-[0_0_6px_rgba(255,255,255,0.35)]">
          TONgue
        </h1>
        <span className="text-sm font-medium px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-600/30 to-blue-600/30 border border-white/10 shadow-inner backdrop-blur-sm">
          {displayName}
        </span>
      </header>

      <main className="relative z-10 flex flex-col items-center justify-center gap-10 px-4 py-10">
        <div className="w-full flex justify-center">
          <WeightedSpinner players={mockPlayers} />
        </div>
      </main>

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
      `}</style>
    </div>
  );
}
