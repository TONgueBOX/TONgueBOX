"use client";
import { useEffect, useRef } from "react";

export interface JoinLobbyModalProps {
  code: string;
  onChangeCode: (v: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export default function JoinLobbyModal({
  code,
  onChangeCode,
  onClose,
  onSubmit
}: JoinLobbyModalProps) {
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    hiddenInputRef.current?.focus();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm bg-white/10 border border-white/15 rounded-2xl p-6 shadow-2xl flex flex-col gap-5">
        <h3 className="text-center text-lg font-semibold tracking-wide">
          Join Lobby
        </h3>
        <p className="text-xs text-white/60 text-center">
          Enter 6-digit lobby code
        </p>
        <div className="flex justify-center">
          <div className="flex items-center gap-3">
            <div
              className="flex gap-2 cursor-text select-none"
              role="group"
              aria-label="Lobby code digits"
              onClick={() => hiddenInputRef.current?.focus()}
            >
              {Array.from({ length: 6 }).map((_, i) => {
                const char = code[i] || "";
                return (
                  <div
                    key={i}
                    className={`h-12 w-10 rounded-xl bg-white/5 border ${
                      char
                        ? "border-pink-400/60 bg-pink-500/10"
                        : "border-white/15"
                    } flex items-center justify-center text-xl font-semibold tracking-wider drop-shadow-sm`}
                    aria-label={`Digit ${i + 1}`}
                  >
                    {char || "•"}
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => onChangeCode(code.slice(0, -1))}
              disabled={code.length === 0}
              className={`h-12 w-12 rounded-xl border border-white/15 flex items-center justify-center text-lg font-medium transition bg-white/5 hover:bg-white/10 ${
                code.length === 0 ? "opacity-30 cursor-not-allowed" : ""
              }`}
              aria-label="Удалить последнюю цифру"
              title="Backspace"
            >
              ←
            </button>
          </div>
        </div>
        <input
          ref={hiddenInputRef}
          autoFocus
          inputMode="numeric"
          pattern="[0-9]*"
          aria-label="Enter 6 digit lobby code"
          value={code}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, "").slice(0, 6);
            onChangeCode(digits);
            if (digits.length === 6) {
              // slight delay so last digit renders before submit if user pasted
              setTimeout(() => hiddenInputRef.current?.blur(), 50);
            }
          }}
          onPaste={(e) => {
            const pasted = e.clipboardData.getData("text");
            const digits = pasted.replace(/\D/g, "").slice(0, 6);
            if (digits) {
              e.preventDefault();
              onChangeCode(digits);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && code.length === 6) {
              e.preventDefault();
              onSubmit();
              return;
            }
            if (e.key === "Escape") {
              e.preventDefault();
              onClose();
              return;
            }
            if (e.key === "Backspace" && code.length > 0) {
              // Let native backspace work, but ensure value updates synchronously
              // Synchronous update handled by onChange; extra safety if browser fails
              setTimeout(() => {
                // If value didn't shrink (e.g., weird IME), force shrink
                if (hiddenInputRef.current) {
                  const raw = hiddenInputRef.current.value;
                  if (raw.length === code.length) {
                    onChangeCode(code.slice(0, -1));
                  }
                }
              }, 0);
            }
            // Block non-digit characters except control keys
            if (
              e.key.length === 1 &&
              !/[0-9]/.test(e.key) &&
              !e.metaKey &&
              !e.ctrlKey &&
              !e.altKey
            ) {
              e.preventDefault();
            }
          }}
          className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
        />
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-sm font-medium tracking-wide transition"
          >
            Cancel
          </button>
          <button
            disabled={code.length !== 6}
            onClick={onSubmit}
            className={`flex-1 px-4 py-3 rounded-full text-sm font-semibold tracking-wide border border-white/20 bg-gradient-to-r from-pink-600 via-fuchsia-600 to-blue-600 ${
              code.length === 6
                ? "opacity-100 hover:brightness-110"
                : "opacity-40 cursor-not-allowed"
            }`}
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
}
