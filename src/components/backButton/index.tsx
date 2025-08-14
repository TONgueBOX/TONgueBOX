"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { ComponentProps } from "react";

interface BackButtonProps extends ComponentProps<"button"> {
  to?: string; // optional static destination
  label?: string;
}

export default function BackButton({
  to,
  label = "Back",
  className = "",
  ...rest
}: BackButtonProps) {
  const router = useRouter();
  return (
    <button
      {...rest}
      onClick={(e) => {
        rest.onClick?.(e);
        if (to) router.push(to);
        else if (history.length > 1) router.back();
        else router.push("/");
      }}
      className={`flex items-center gap-1.5 text-xs tracking-wide px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 transition border border-white/10 ${className}`}
    >
      <ArrowLeft className="w-4 h-4" /> {label}
    </button>
  );
}
