"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import { getCoins } from "@/src/actions/coins";

interface CoinsContextValue {
  coins: number | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

const CoinsContext = createContext<CoinsContextValue | undefined>(undefined);

interface CoinsProviderProps {
  initialCoins: number | null;
  children: React.ReactNode;
}

export const CoinsProvider: React.FC<CoinsProviderProps> = ({
  initialCoins,
  children
}) => {
  const [coins, setCoins] = useState<number | null>(initialCoins);
  const [loading, setLoading] = useState<boolean>(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    const val = await getCoins();
    setCoins(val);
    setLoading(false);
  }, []);

  return (
    <CoinsContext.Provider value={{ coins, loading, refresh }}>
      {children}
    </CoinsContext.Provider>
  );
};

export function useCoins() {
  const ctx = useContext(CoinsContext);
  if (!ctx) throw new Error("useCoins must be used within CoinsProvider");
  return ctx;
}
