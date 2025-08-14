import React from "react";

export interface LobbyPlayerCardProps {
  id: number;
  displayName: string;
  username: string;
  isReady: boolean;
  color: string;
  isCurrent: boolean;
  onToggleReady?: () => void;
}

const LobbyPlayerCard: React.FC<LobbyPlayerCardProps> = ({
  displayName,
  username,
  isReady,
  color,
  isCurrent,
  onToggleReady
}) => {
  return (
    <li
      className={`relative group border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between gap-4 bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 transition`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold bg-${color}-500/30 ring-1 ring-${color}-400/40 text-${color}-200 capitalize`}
        >
          {displayName.charAt(0)}
        </div>
        <div className="flex flex-col leading-tight min-w-0">
          <span className="font-medium truncate drop-shadow-sm">
            {displayName}
          </span>
          <span className="text-xs text-white/60 truncate">@{username}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {isReady ? (
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
            onClick={onToggleReady}
            className={`relative overflow-hidden rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition border border-white/15 ${
              isReady
                ? "bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30"
                : "bg-pink-600/40 hover:bg-pink-600/55"
            }`}
          >
            {isReady ? "Unready" : "Ready"}
          </button>
        )}
      </div>
    </li>
  );
};

export default LobbyPlayerCard;
