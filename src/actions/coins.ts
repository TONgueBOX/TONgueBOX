/**
 * Action: fetch user's current coins via backend proxy and show alert.
 */
export const fetchCoins = async (): Promise<void> => {
  try {
    const res = await fetch("/api/proxy/User/GetCurrentCoins");
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const msg =
        (data && (data.error || JSON.stringify(data))) ||
        `Status ${res.status}`;
      alert(`Error fetching coins: ${msg}`);
      return;
    }
    alert(`Current coins: ${JSON.stringify(data)}`);
  } catch (err: unknown) {
    const e = err as { message?: string } | undefined;
    alert(`Request failed: ${e?.message || String(err)}`);
  }
};

// Return numeric coins (or null on error) for UI components
export const getCoins = async (): Promise<number | null> => {
  try {
    const res = await fetch("/api/proxy/User/GetCurrentCoins", {
      cache: "no-store"
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) return null;
    // Try common shapes: { coins: 123 }, { amount: 123 }, number directly
    if (data == null) return null;
    if (typeof data === "number") return data;
    const val = data.coins ?? data.amount ?? data.value ?? null;
    return typeof val === "number" ? val : null;
  } catch {
    return null;
  }
};
