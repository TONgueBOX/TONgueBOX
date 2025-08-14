import React from "react";
import CoinsBadge from "@/src/components/layout/coinsBadge";

interface AppHeaderProps {
  title?: string;
  displayName: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title = "TONgue",
  displayName
}) => {
  return (
    <header className="relative z-10 w-full flex items-center justify-between px-6 py-4 backdrop-blur-sm bg-white/5 border-b border-white/10 shadow-lg">
      <h1 className="brand-title text-xl font-normal drop-shadow-[0_0_8px_rgba(255,120,220,0.45)]">
        {title}
      </h1>
      <div className="flex items-center gap-3">
        <CoinsBadge />
        <span className="text-sm font-medium px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-600/55 via-fuchsia-600/55 to-blue-600/55 border border-white/15 shadow-[0_0_10px_rgba(255,120,220,0.35)] ring-1 ring-white/10 backdrop-blur-md text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
          {displayName}
        </span>
      </div>
    </header>
  );
};

export default AppHeader;
