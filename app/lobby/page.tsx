"use client";

import { useState } from "react";
import BackButton from "@/src/components/backButton";
import { useTelegramWebApp } from "@/hooks/useTelegramWebApp";
import { useRouter, useSearchParams } from "next/navigation";
import LobbyPlayerCard from "@/src/components/lobby/LobbyPlayerCard";

interface LobbyPlayer {
  id: number;
  username: string;
  displayName: string;
  isReady: boolean;
  color: string;
}

// Mock lobby players (will be replaced by backend / realtime later)
const initialPlayers: LobbyPlayer[] = [
  {
    id: 1,
    username: "captain",
    displayName: "Captain",
    isReady: true,
    color: "pink"
  },
  {
    id: 2,
    username: "sailor",
    displayName: "Sailor",
    isReady: false,
    color: "blue"
  },
  {
    id: 3,
    username: "gunner",
    displayName: "Gunner",
    isReady: false,
    color: "violet"
  }
];

export default function LobbyPage() {
  const { user } = useTelegramWebApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const lobbyCode = (searchParams.get("code") || "834219").padEnd(6, "0"); // mock fallback
  const [players, setPlayers] = useState<LobbyPlayer[]>(() => {
    // If current user not in mock list, add them
    if (user) {
      const exists = initialPlayers.some((p) => p.id === user.id);
      if (!exists) {
        return [
          ...initialPlayers,
          {
            id: user.id,
            username: user.username || `user${user.id}`,
            displayName: user.first_name || user.username || "Player",
            isReady: false,
            color: "emerald"
          }
        ];
      }
    }
    return initialPlayers;
  });

  const currentUserId = user?.id;

  const toggleReady = () => {
    if (!currentUserId) return;
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === currentUserId ? { ...p, isReady: !p.isReady } : p
      )
    );
  };

  const allReady = players.length > 1 && players.every((p) => p.isReady);

  return (
    <div className="relative min-h-screen w-full text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#080317] via-[#1d0b33] to-[#001a44]" />
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(circle_at_20%_30%,rgba(255,0,128,0.35),transparent_60%),radial-gradient(circle_at_80%_70%,rgba(0,128,255,0.35),transparent_65%)] animate-pulseSlow" />

      <header className="relative z-10 w-full flex items-center justify-between px-6 py-4 backdrop-blur-sm bg-white/5 border-b border-white/10 shadow-lg">
        <BackButton to="/" />
        <h1 className="text-lg font-semibold tracking-wide drop-shadow-[0_0_6px_rgba(255,255,255,0.35)]">
          Lobby
        </h1>
        <span className="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-600/30 to-blue-600/30 border border-white/10 whitespace-nowrap">
          {players.length} players
        </span>
      </header>

      <main className="relative z-10 max-w-xl mx-auto px-5 py-8 flex flex-col gap-6">
        <section className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 shadow-xl p-4 flex flex-col gap-3 items-center">
          <p className="text-[11px] uppercase tracking-widest text-white/50">
            Lobby Code
          </p>
          <div className="flex items-center gap-3">
            <div className="flex gap-1 tracking-widest font-mono text-base">
              {lobbyCode.split("").map((d, i) => (
                <span
                  key={i}
                  className="relative px-2 py-1 rounded-lg text-white font-semibold select-none backdrop-blur-sm"
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(70,40,150,0.78), rgba(45,25,110,0.78))",
                    border: "1px solid rgba(170,140,255,0.28)",
                    boxShadow:
                      "0 0 3px rgba(130,90,255,0.35), 0 0 10px rgba(90,50,180,0.25), 0 1px 2px rgba(0,0,0,0.55) inset",
                    WebkitTextStroke: "0.25px rgba(0,0,0,0.45)"
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "0.5rem",
                      background:
                        "radial-gradient(circle at 30% 30%, rgba(160,110,255,0.35), transparent 60%)"
                    }}
                  />
                  <span className="relative">{d}</span>
                </span>
              ))}
            </div>
            <button
              onClick={() =>
                navigator.clipboard?.writeText(lobbyCode).catch(() => {})
              }
              className="text-[10px] uppercase tracking-wide px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 border border-white/15 transition"
            >
              Copy
            </button>
          </div>
          <p className="text-[10px] text-white/40">
            Share this code with friends to join
          </p>
        </section>
        <section className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 shadow-xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-wide">Players</h2>
            {allReady && (
              <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 animate-pulse">
                All Ready
              </span>
            )}
          </div>
          <ul className="flex flex-col gap-3">
            {players.map((p) => (
              <LobbyPlayerCard
                key={p.id}
                id={p.id}
                displayName={p.displayName}
                username={p.username}
                isReady={p.isReady}
                color={p.color}
                isCurrent={p.id === currentUserId}
                onToggleReady={p.id === currentUserId ? toggleReady : undefined}
              />
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <button
            disabled={!allReady}
            onClick={() => router.push("/game")}
            className={`rounded-full px-10 py-4 text-sm font-semibold tracking-wide border transition bg-gradient-to-r from-pink-600 via-fuchsia-600 to-blue-600 ${
              allReady
                ? "opacity-100 border-white/20 hover:brightness-110"
                : "opacity-40 border-white/10 cursor-not-allowed"
            }`}
          >
            Start Game
          </button>
          <p className="text-[11px] text-white/50 text-center">
            All players must be Ready to start
          </p>
        </section>
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
