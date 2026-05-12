import { apiFetch } from './client'
import type { SearchResult, Player, Team, Game } from '@/types'

interface SearchResponse {
  players?: Player[]
  teams?: Team[]
  games?: Game[]
}

export async function globalSearch(q: string, league: string): Promise<SearchResult[]> {
  if (q.trim().length < 2) return []

  try {
    const res = await apiFetch<SearchResponse>(
      `/search?q=${encodeURIComponent(q)}&league=${encodeURIComponent(league)}`,
      { bypassCache: true },
    )

    const results: SearchResult[] = []

    res.players?.slice(0, 5).forEach((p) => {
      results.push({
        type: 'player',
        id: p.id,
        label: p.name,
        sublabel: `${p.team} · ${p.position ?? 'Player'}`,
        href: `/players/${p.id}`,
      })
    })

    res.teams?.slice(0, 3).forEach((t) => {
      results.push({
        type: 'team',
        id: t.id,
        label: t.name,
        sublabel: t.conference ?? 'Team',
        href: `/teams/${t.id}`,
      })
    })

    res.games?.slice(0, 3).forEach((g) => {
      results.push({
        type: 'game',
        id: g.id,
        label: `${g.away_team} @ ${g.home_team}`,
        sublabel: g.date,
        href: `/games/${g.id}`,
      })
    })

    return results
  } catch {
    // Fall back to client-side name matching if the search endpoint doesn't exist
    return []
  }
}

// Client-side fuzzy search over pre-fetched data
export function fuzzyMatch(query: string, players: Player[], teams: Team[]): SearchResult[] {
  const q = query.toLowerCase().trim()
  if (q.length < 2) return []

  const results: SearchResult[] = []

  players
    .filter((p) => p.name.toLowerCase().includes(q) || p.team.toLowerCase().includes(q))
    .slice(0, 5)
    .forEach((p) => {
      results.push({
        type: 'player',
        id: p.id,
        label: p.name,
        sublabel: `${p.team} · ${p.position ?? ''}`,
        href: `/players/${p.id}`,
      })
    })

  teams
    .filter((t) => t.name.toLowerCase().includes(q) || t.city?.toLowerCase().includes(q))
    .slice(0, 3)
    .forEach((t) => {
      results.push({
        type: 'team',
        id: t.id,
        label: t.name,
        sublabel: t.conference ?? 'Team',
        href: `/teams/${t.id}`,
      })
    })

  return results
}
