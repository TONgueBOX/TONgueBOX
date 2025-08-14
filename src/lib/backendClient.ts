// Server-side backend HTTP client helper
// Usage: import { serverFetch } from '@/src/lib/backendClient';
// Call from server code (API routes, server components, server actions).

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5256"; // default matches new backend port

export class ApiError extends Error {
  status: number;
  data: unknown;
  url?: string;
  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export async function serverFetch(
  path: string,
  options: RequestInit = {},
  { timeoutMs = 10_000 } = {}
) {
  const url = path.startsWith("http")
    ? path
    : `${BACKEND_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const headers = {
      accept: "application/json",
      ...(options.headers || {})
    } as Record<string, string>;

    const res = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal
    });

    const contentType = res.headers.get("content-type") || "";

    let data: unknown = null;
    if (contentType.includes("application/json")) {
      data = await res.json().catch(() => null);
    } else {
      data = await res.text().catch(() => null);
    }

    if (!res.ok) {
      const apiErr = new ApiError(
        res.status,
        `Backend request failed: ${res.status} ${res.statusText}`,
        data
      );
      apiErr.url = url;
      throw apiErr;
    }

    return { status: res.status, headers: res.headers, data, url };
  } catch (err: unknown) {
    const e = err as
      | { name?: string; message?: string; code?: string }
      | undefined;
    if (e?.name === "AbortError") {
      const t = new ApiError(504, "Backend request timeout");
      t.url = url;
      throw t;
    }
    if (err instanceof ApiError) {
      if (!(err as ApiError).url) (err as ApiError).url = url;
      throw err;
    }
    const code =
      typeof (err as Record<string, unknown>)?.code === "string"
        ? ((err as Record<string, unknown>).code as string)
        : undefined;
    const msg = code
      ? `${e?.message || "Unknown error"} (${code})`
      : e?.message || "Unknown error";
    const generic = new ApiError(500, msg);
    generic.url = url;
    throw generic;
  } finally {
    clearTimeout(id);
  }
}

export default serverFetch;
