import { apiFetch } from './client'
import type { Standing } from '@/types'

function toArray<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[]
  if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>
    for (const key of ['data', 'standings', 'results', 'items']) {
      if (Array.isArray(obj[key])) return obj[key] as T[]
    }
  }
  return []
}

export async function fetchStandings(league: string): Promise<Standing[]> {
  const raw = await apiFetch<unknown>(`/standings?league=${encodeURIComponent(league)}`)
  return toArray<Standing>(raw)
}
