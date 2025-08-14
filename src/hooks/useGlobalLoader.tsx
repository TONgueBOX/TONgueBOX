"use client";
import {
  createContext,
  useCallback,
  useContext,
  useState,
  useMemo
} from "react";

interface LoaderState {
  active: boolean;
  message?: string;
  count: number; // nesting support
}

interface LoaderContextValue {
  active: boolean;
  message?: string;
  show: (msg?: string) => void;
  hide: () => void;
  setMessage: (msg?: string) => void;
}

const LoaderContext = createContext<LoaderContextValue | null>(null);

export function GlobalLoaderProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<LoaderState>({ active: false, count: 0 });

  const show = useCallback((message?: string) => {
    setState((prev) => {
      const nextCount = prev.count + 1;
      return {
        active: true,
        count: nextCount,
        message: message ?? prev.message
      };
    });
  }, []);

  const hide = useCallback(() => {
    setState((prev) => {
      const next = prev.count - 1;
      if (next <= 0) {
        return { active: false, count: 0 };
      }
      return { ...prev, count: next };
    });
  }, []);

  const setMessage = useCallback((message?: string) => {
    setState((prev) => ({ ...prev, message }));
  }, []);

  const value = useMemo(
    () => ({
      active: state.active,
      message: state.message,
      show,
      hide,
      setMessage
    }),
    [state.active, state.message, show, hide, setMessage]
  );

  return (
    <LoaderContext.Provider value={value}>
      {children}
      <NeonLoaderOverlay active={state.active} message={state.message} />
    </LoaderContext.Provider>
  );
}

export function useGlobalLoader() {
  const ctx = useContext(LoaderContext);
  if (!ctx)
    throw new Error("useGlobalLoader must be used within GlobalLoaderProvider");
  return ctx;
}

function NeonLoaderOverlay({
  active,
  message
}: {
  active: boolean;
  message?: string;
}) {
  if (!active) return null;
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-28 h-28">
          {/* Base faint ring */}
          <div className="absolute inset-0 rounded-full border-2 border-white/10" />
          {/* Rotating hollow arc */}
          <div className="absolute inset-0 animate-loader-spin">
            <div className="absolute inset-0 rounded-full loader-arc" />
          </div>
          {/* Ambient glow */}
          <div className="absolute -inset-3 rounded-full blur-3xl bg-gradient-to-r from-pink-600/30 via-fuchsia-600/30 to-blue-600/30 opacity-70 animate-pulseSlow" />
        </div>
        {message && (
          <p className="text-xs font-medium tracking-wide text-white/75 animate-fadeIn">
            {message}
          </p>
        )}
      </div>
      <style jsx global>{`
        @keyframes loader-spin {
          to {
            transform: rotate(360deg);
          }
        }
        .animate-loader-spin {
          --loader-speed: 2.5s; /* Adjust rotation duration */
          animation: loader-spin var(--loader-speed) linear infinite;
        }
        .loader-arc {
          --thickness: 6px; /* ring thickness */
          background: conic-gradient(
            from 0deg,
            transparent 0deg 288deg,
            #ff2fb4 296deg,
            #ff2fb4 304deg,
            #b400ff 318deg,
            #0084ff 340deg,
            transparent 348deg 360deg
          );
          filter: drop-shadow(0 0 5px #ff2fb4) drop-shadow(0 0 9px #6a00ff)
            drop-shadow(0 0 12px #0084ff);
          mix-blend-mode: screen;
          -webkit-mask: radial-gradient(
            farthest-side,
            transparent calc(100% - var(--thickness)),
            #000 calc(100% - var(--thickness)) 100%
          );
          mask: radial-gradient(
            farthest-side,
            transparent calc(100% - var(--thickness)),
            #000 calc(100% - var(--thickness)) 100%
          );
        }
      `}</style>
    </div>
  );
}
