import { USER_AGENT } from "../config.js";

const DEFAULT_TIMEOUT_MS = 12_000;

const BROWSER_HEADERS: Record<string, string> = {
  "User-Agent": USER_AGENT,
  Accept: "application/json, text/plain, */*",
  "Accept-Language": "fa-IR,fa;q=0.9,en;q=0.8",
};

/**
 * Unwraps the real reason behind Node/undici's opaque "fetch failed".
 * The thrown TypeError carries the underlying network error in `.cause`
 * (e.g. ENOTFOUND, ECONNREFUSED, ECONNRESET, UND_ERR_CONNECT_TIMEOUT).
 */
function describeFetchError(error: unknown): string {
  if (error instanceof Error) {
    const cause = (error as { cause?: unknown }).cause;
    if (cause && typeof cause === "object") {
      const code = (cause as { code?: string }).code;
      const msg = (cause as { message?: string }).message;
      return code ?? msg ?? error.message;
    }
    return error.message;
  }
  return String(error);
}

async function request(url: string, accept: string): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
  try {
    return await fetch(url, {
      headers: { ...BROWSER_HEADERS, Accept: accept },
      signal: controller.signal,
    });
  } catch (error) {
    throw new Error(`fetch failed for ${url}: ${describeFetchError(error)}`);
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchJson<T>(url: string): Promise<T> {
  const response = await request(url, "application/json, text/plain, */*");

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  return (await response.json()) as T;
}

export async function fetchBuffer(url: string): Promise<Buffer | null> {
  const response = await request(url, "*/*");

  if (!response.ok) return null;
  return Buffer.from(await response.arrayBuffer());
}
