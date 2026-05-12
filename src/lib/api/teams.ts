import { apiFetch } from './client'
import type { Team, TeamDetail } from '@/types'

function toArray<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[]
  if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>
    for (const key of ['data', 'teams', 'results', 'items']) {
      if (Array.isArray(obj[key])) return obj[key] as T[]
    }
  }
  return []
}

export async function fetchTeams(league: string): Promise<Team[]> {
  const raw = await apiFetch<unknown>(`/teams?league=${encodeURIComponent(league)}`)
  return toArray<Team>(raw)
}

export async function fetchTeam(id: string | number, league: string): Promise<TeamDetail> {
  const raw = await apiFetch<unknown>(`/teams/${id}?league=${encodeURIComponent(league)}`)
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    const obj = raw as Record<string, unknown>
    if (obj.data && typeof obj.data === 'object') return obj.data as TeamDetail
    return raw as TeamDetail
  }
  throw new Error('Unexpected team response shape')
}
