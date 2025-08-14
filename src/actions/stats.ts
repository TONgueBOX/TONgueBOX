/**
 * Fetch current user's coins through the proxy and show a simple alert.
 * Keep UI side-effects (alert) here for now; can be refactored later.
 */
export const handleMyStats = async (): Promise<void> => {
  try {
    const res = await fetch("/api/proxy/User/GetCurrentCoins");
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const msg =
        (data && (data.error || JSON.stringify(data))) ||
        `Status ${res.status}`;
      alert(`Error fetching stats: ${msg}`);
      return;
    }
    alert(`Current coins: ${JSON.stringify(data)}`);
  } catch (err: unknown) {
    const e = err as { message?: string } | undefined;
    alert(`Request failed: ${e?.message || String(err)}`);
  }
};
