import { apiFetch } from './client'
import type { Player, PlayerDetail } from '@/types'

function toArray<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[]
  if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>
    // Common REST envelope shapes: { data: [] }, { players: [] }, { results: [] }, { items: [] }
    for (const key of ['data', 'players', 'results', 'items']) {
      if (Array.isArray(obj[key])) return obj[key] as T[]
    }
  }
  return []
}

export async function fetchPlayers(league: string): Promise<Player[]> {
  const raw = await apiFetch<unknown>(`/players?league=${encodeURIComponent(league)}`)
  return toArray<Player>(raw)
}

export async function fetchPlayer(id: string | number, league: string): Promise<PlayerDetail> {
  const raw = await apiFetch<unknown>(`/players/${id}?league=${encodeURIComponent(league)}`, { bypassCache: true })
  // Detail endpoint may return the object directly or wrapped
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    const obj = raw as Record<string, unknown>
    // If wrapped in { data: { ... } }
    if (obj.data && typeof obj.data === 'object' && !Array.isArray(obj.data)) {
      return obj.data as PlayerDetail
    }
    return raw as PlayerDetail
  }
  throw new Error('Unexpected player response shape')
}

export async function searchPlayers(q: string, league: string): Promise<Player[]> {
  const raw = await apiFetch<unknown>(
    `/players?league=${encodeURIComponent(league)}&search=${encodeURIComponent(q)}`,
    { bypassCache: true },
  )
  return toArray<Player>(raw)
}
