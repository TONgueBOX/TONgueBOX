"use client";
import React from "react";
import Image from "next/image";
import { useCoins } from "@/src/contexts/coinsContext";

const CoinsBadge: React.FC = () => {
  const { coins, loading, refresh } = useCoins();
  return (
    <button
      type="button"
      onClick={() => refresh()}
      title="Refresh coins"
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-600/60 via-fuchsia-600/60 to-blue-600/60 border border-white/15 shadow-[0_0_8px_rgba(255,120,220,0.45)] ring-1 ring-white/10 backdrop-blur-md text-sm font-semibold min-w-[88px] justify-center hover:brightness-110 active:scale-[0.97] transition text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
    >
      <div className="w-5 h-5 relative">
        <Image
          src="/tongue.svg"
          alt="Coins"
          fill
          sizes="20px"
          className="object-contain drop-shadow-[0_0_4px_rgba(255,120,220,0.6)]"
        />
      </div>
      {loading ? (
        <span className="opacity-80 animate-pulse">...</span>
      ) : (
        <span>{coins ?? 0}</span>
      )}
    </button>
  );
};

export default CoinsBadge;
