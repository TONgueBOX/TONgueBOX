"use client";

import { useState } from "react";
import { useTelegramWebApp } from "@/src/hooks/useTelegramWebApp";
import { useRouter } from "next/navigation";

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
        <button
          onClick={() => router.push("/")}
          className="text-xs tracking-wide px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 transition border border-white/10"
        >
          ← Back
        </button>
        <h1 className="text-lg font-semibold tracking-wide drop-shadow-[0_0_6px_rgba(255,255,255,0.35)]">
          Lobby
        </h1>
        <span className="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-600/30 to-blue-600/30 border border-white/10">
          {players.length} players
        </span>
      </header>

      <main className="relative z-10 max-w-xl mx-auto px-5 py-8 flex flex-col gap-6">
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
            {players.map((p) => {
              const isCurrent = p.id === currentUserId;
              return (
                <li
                  key={p.id}
                  className={`relative group border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between gap-4 bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 transition`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold bg-${p.color}-500/30 ring-1 ring-${p.color}-400/40 text-${p.color}-200 capitalize`}
                    >
                      {p.displayName.charAt(0)}
                    </div>
                    <div className="flex flex-col leading-tight min-w-0">
                      <span className="font-medium truncate drop-shadow-sm">
                        {p.displayName}
                      </span>
                      <span className="text-xs text-white/60 truncate">
                        @{p.username}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {p.isReady ? (
                      <span className="flex items-center gap-1 text-emerald-300 text-xs font-medium">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_2px_rgba(16,185,129,0.7)] animate-pulse" />{" "}
                        Ready
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase tracking-wide text-white/40">
                        Waiting
                      </span>
                    )}
                    {isCurrent && (
                      <button
                        onClick={toggleReady}
                        className={`relative overflow-hidden rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition border border-white/15 ${
                          p.isReady
                            ? "bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30"
                            : "bg-pink-600/40 hover:bg-pink-600/55"
                        }`}
                      >
                        {" "}
                        {p.isReady ? "Unready" : "Ready"}
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
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
