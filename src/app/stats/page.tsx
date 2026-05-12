'use client'

import { useState } from 'react'
import { BarChart2, Search } from 'lucide-react'
import { useLeague } from '@/lib/hooks/useLeague'
import { useFetch } from '@/lib/hooks/useFetch'
import { fetchPlayers } from '@/lib/api/players'
import { StatLeaderboard } from '@/components/stats/StatLeaderboard'
import { StatsTable } from '@/components/stats/StatsTable'
import { SkeletonTable } from '@/components/common/SkeletonCard'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import type { Player, PlayerStats } from '@/types'

const LEADERBOARD_TABS = [
  { value: 'scoring',   statKey: 'pts',  statLabel: 'PTS', title: 'Scoring Leaders',     fmt: (v: number) => v.toFixed(1) },
  { value: 'rebounds',  statKey: 'reb',  statLabel: 'REB', title: 'Rebounding Leaders',  fmt: (v: number) => v.toFixed(1) },
  { value: 'assists',   statKey: 'ast',  statLabel: 'AST', title: 'Assist Leaders',      fmt: (v: number) => v.toFixed(1) },
  { value: 'steals',    statKey: 'stl',  statLabel: 'STL', title: 'Steal Leaders',       fmt: (v: number) => v.toFixed(1) },
  { value: 'blocks',    statKey: 'blk',  statLabel: 'BLK', title: 'Block Leaders',       fmt: (v: number) => v.toFixed(1) },
  { value: 'fg_pct',   statKey: 'fg_pct', statLabel: 'FG%', title: 'Field Goal % Leaders', fmt: (v: number) => (v * 100).toFixed(1) + '%' },
  { value: 'three_pct',statKey: 'fg3_pct', statLabel: '3P%', title: '3-Point % Leaders', fmt: (v: number) => (v * 100).toFixed(1) + '%' },
]

function toPlayerStatsRow(player: Player): { player: Player; stats: PlayerStats } | null {
  const s = (player as Record<string, unknown>)
  const pts = Number(s.pts)
  if (isNaN(pts)) return null
  return {
    player,
    stats: {
      gp:      Number(s.gp)  || 0,
      min:     String(s.min ?? ''),
      pts:     pts,
      reb:     Number(s.reb) || 0,
      ast:     Number(s.ast) || 0,
      stl:     Number(s.stl) || 0,
      blk:     Number(s.blk) || 0,
      to:      Number(s.to)  || 0,
      fg_pct:  s.fg_pct  != null ? Number(s.fg_pct)  : undefined,
      fg3_pct: s.fg3_pct != null ? Number(s.fg3_pct) : undefined,
      ft_pct:  s.ft_pct  != null ? Number(s.ft_pct)  : undefined,
      ts_pct:  s.ts_pct  != null ? Number(s.ts_pct)  : undefined,
      efg_pct: s.efg_pct != null ? Number(s.efg_pct) : undefined,
      per:     s.per     != null ? Number(s.per)      : undefined,
      usg_pct: s.usg_pct != null ? Number(s.usg_pct) : undefined,
      bpm:     s.bpm     != null ? Number(s.bpm)      : undefined,
      vorp:    s.vorp    != null ? Number(s.vorp)      : undefined,
      fg_made:  s.fg_made  != null ? Number(s.fg_made)  : undefined,
      fg_att:   s.fg_att   != null ? Number(s.fg_att)   : undefined,
      fg3_made: s.fg3_made != null ? Number(s.fg3_made) : undefined,
      fg3_att:  s.fg3_att  != null ? Number(s.fg3_att)  : undefined,
      ft_made:  s.ft_made  != null ? Number(s.ft_made)  : undefined,
      ft_att:   s.ft_att   != null ? Number(s.ft_att)   : undefined,
      oreb:     s.oreb    != null ? Number(s.oreb)    : undefined,
      dreb:     s.dreb    != null ? Number(s.dreb)    : undefined,
    },
  }
}

export default function StatsPage() {
  const { league } = useLeague()
  const { data: players, loading } = useFetch<Player[]>(() => fetchPlayers(league), [league])
  const [search, setSearch] = useState('')
  const [activeView, setActiveView] = useState<'leaderboard' | 'table'>('leaderboard')

  const filtered = (players ?? []).filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.team.toLowerCase().includes(search.toLowerCase()),
  )

  const tableRows = filtered.map(toPlayerStatsRow).filter((r): r is NonNullable<typeof r> => r !== null)

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-6 lg:px-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-hoop-orange/10">
            <BarChart2 className="h-5 w-5 text-hoop-orange" />
          </div>
          <div>
            <h1 className="text-2xl font-black">Stats Hub</h1>
            <p className="text-sm text-muted-foreground">{league.toUpperCase()} League Leaders</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex rounded-lg border border-hoop-dark-border overflow-hidden">
            {(['leaderboard', 'table'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setActiveView(v)}
                className={`px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                  activeView === v
                    ? 'bg-hoop-orange text-white'
                    : 'text-muted-foreground hover:text-foreground bg-hoop-dark-card'
                }`}
              >
                {v === 'leaderboard' ? 'Leaders' : 'Full Table'}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search players..."
              className="pl-8 h-8 text-sm w-48 bg-hoop-dark-card border-hoop-dark-border"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <SkeletonTable rows={12} cols={6} />
      ) : activeView === 'leaderboard' ? (
        <Tabs defaultValue="scoring">
          <TabsList className="flex-wrap mb-4">
            {LEADERBOARD_TABS.map((t) => (
              <TabsTrigger key={t.value} value={t.value}>{t.statLabel}</TabsTrigger>
            ))}
          </TabsList>
          {LEADERBOARD_TABS.map((t) => (
            <TabsContent key={t.value} value={t.value}>
              <div className="rounded-xl border border-hoop-dark-border bg-hoop-dark-card p-4">
                <StatLeaderboard
                  players={filtered}
                  statKey={t.statKey}
                  statLabel={t.statLabel}
                  title={t.title}
                  fmt={t.fmt}
                  limit={20}
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        tableRows.length > 0 ? (
          <StatsTable rows={tableRows} defaultMode="per_game" defaultSort="pts" />
        ) : (
          <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
            No stat data available. Stats are returned per-player from the API.
          </div>
        )
      )}
    </div>
  )
}
