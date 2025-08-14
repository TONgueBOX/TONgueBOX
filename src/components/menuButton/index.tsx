"use client";
import React from "react";

interface MenuButtonProps {
  label: string;
  onClick: () => void;
}

export default function MenuButton({ label, onClick }: MenuButtonProps) {
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
