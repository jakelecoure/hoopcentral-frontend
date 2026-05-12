import { apiFetch } from './client'
import type { Game, GameDetail } from '@/types'

function toArray<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[]
  if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>
    for (const key of ['data', 'games', 'results', 'items']) {
      if (Array.isArray(obj[key])) return obj[key] as T[]
    }
  }
  return []
}

function toDetail<T>(raw: unknown): T {
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    const obj = raw as Record<string, unknown>
    if (obj.data && typeof obj.data === 'object' && !Array.isArray(obj.data)) {
      return obj.data as T
    }
    return raw as T
  }
  throw new Error('Unexpected response shape')
}

export async function fetchGames(league: string): Promise<Game[]> {
  const raw = await apiFetch<unknown>(`/games?league=${encodeURIComponent(league)}`)
  return toArray<Game>(raw)
}

export async function fetchGame(id: string | number, league: string): Promise<GameDetail> {
  const raw = await apiFetch<unknown>(`/games/${id}?league=${encodeURIComponent(league)}`, { bypassCache: true })
  return toDetail<GameDetail>(raw)
}

export async function fetchLiveGames(league: string): Promise<Game[]> {
  const raw = await apiFetch<unknown>(`/games?league=${encodeURIComponent(league)}&status=live`, { bypassCache: true })
  return toArray<Game>(raw)
}

export async function fetchGamesByDate(date: string, league: string): Promise<Game[]> {
  const raw = await apiFetch<unknown>(`/games?league=${encodeURIComponent(league)}&date=${encodeURIComponent(date)}`)
  return toArray<Game>(raw)
}
