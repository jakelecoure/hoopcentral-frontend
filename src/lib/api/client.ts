import { API_CACHE_TTL } from '@/lib/utils/constants'

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'}/api/v1`

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// In-memory cache keyed by full URL
const cache = new Map<string, { data: unknown; ts: number }>()

export async function apiFetch<T>(
  path: string,
  options?: { bypassCache?: boolean; revalidate?: number },
): Promise<T> {
  const ttl = options?.revalidate != null ? options.revalidate * 1000 : API_CACHE_TTL

  if (!options?.bypassCache) {
    const hit = cache.get(path)
    if (hit && Date.now() - hit.ts < ttl) return hit.data as T
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
  })

  if (!res.ok) {
    throw new ApiError(res.status, `${res.status} ${res.statusText}`)
  }

  const data = (await res.json()) as T
  cache.set(path, { data, ts: Date.now() })

  if (process.env.NODE_ENV === 'development') {
    console.debug(`[API] ${path}`, data)
  }

  return data
}

export function clearCache(path?: string) {
  if (path) {
    cache.delete(path)
  } else {
    cache.clear()
  }
}
