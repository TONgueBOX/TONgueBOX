"use client";
import React from "react";
import Image from "next/image";
import MenuButton from "@/components/menuButton";

interface HomeMenuProps {
  onFindMatch: () => void;
  onCreateLobby: () => void;
  onJoinLobby: () => void;
  onStats: () => void;
}

const HomeMenu: React.FC<HomeMenuProps> = ({
  onFindMatch,
  onCreateLobby,
  onJoinLobby,
  onStats
}) => {
  return (
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
      <p
        className="neon-tagline max-w-xs text-center text-[22px] md:text-[24px] leading-snug"
        aria-label="A mathematically grounded, probability-driven crypto app built on weighted random selection mechanics."
      >
        A mathematically grounded, probability-driven crypto app built on
        weighted random selection mechanics.
      </p>
      <div className="flex flex-col gap-4 w-full items-stretch max-w-sm">
        <MenuButton label="FIND MATCH" onClick={onFindMatch} />
        <MenuButton label="CREATE LOBBY" onClick={onCreateLobby} />
        <MenuButton label="JOIN LOBBY" onClick={onJoinLobby} />
        <MenuButton label="MY STATS" onClick={onStats} />
      </div>
    </div>
  );
};

export default HomeMenu;
