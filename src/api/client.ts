const _ORIGIN = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:8000';
const BASE_URL = `${_ORIGIN}/api/v1`;

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// 60-second in-memory cache keyed by full path
const cache = new Map<string, { data: unknown; ts: number }>();
const TTL = 60_000;

export async function apiFetch<T>(path: string, bypassCache = false): Promise<T> {
  if (!bypassCache) {
    const hit = cache.get(path);
    if (hit && Date.now() - hit.ts < TTL) return hit.data as T;
  }
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new ApiError(res.status, `${res.status} ${res.statusText}`);
  const data = (await res.json()) as T;
  cache.set(path, { data, ts: Date.now() });
  return data;
}
