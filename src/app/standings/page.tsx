'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLeague } from '@/lib/hooks/useLeague'
import { useFetch } from '@/lib/hooks/useFetch'
import { fetchStandings } from '@/lib/api/standings'
import { SkeletonTable } from '@/components/common/SkeletonCard'
import { ErrorState } from '@/components/common/ErrorState'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { getTeamColor } from '@/lib/utils/constants'
import { fmtWinPct } from '@/lib/utils/formatters'
import { cn } from '@/lib/utils/cn'
import type { Standing } from '@/types'

export default function StandingsPage() {
  const { league } = useLeague()

  const { data, loading, error, refetch } = useFetch<Standing[]>(
    () => fetchStandings(league),
    [league],
  )

  const east = data?.filter((s) => s.conference?.toLowerCase().includes('east')) ?? []
  const west = data?.filter((s) => s.conference?.toLowerCase().includes('west')) ?? []
  const all  = data ?? []

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-6 lg:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black">Standings</h1>
        <p className="text-sm text-muted-foreground mt-1">{league.toUpperCase()} — Current Season</p>
      </div>

      {/* Playoff legend */}
      <div className="mb-4 flex flex-wrap gap-4">
        <LegendItem color="bg-hoop-orange" label="Clinched Playoff" />
        <LegendItem color="bg-blue-500" label="Play-In (7-10)" />
        <LegendItem color="bg-hoop-dark-border" label="Eliminated" />
      </div>

      {loading ? (
        <SkeletonTable rows={15} cols={7} />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : (
        <Tabs defaultValue={east.length > 0 ? 'east' : 'all'}>
          <TabsList className="mb-4">
            {east.length > 0 && <TabsTrigger value="east">Eastern</TabsTrigger>}
            {west.length > 0 && <TabsTrigger value="west">Western</TabsTrigger>}
            <TabsTrigger value="all">League</TabsTrigger>
          </TabsList>
          {east.length > 0 && (
            <TabsContent value="east">
              <StandingsTable rows={east} />
            </TabsContent>
          )}
          {west.length > 0 && (
            <TabsContent value="west">
              <StandingsTable rows={west} />
            </TabsContent>
          )}
          <TabsContent value="all">
            <StandingsTable rows={all} showConference />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn('h-2 w-2 rounded-full', color)} />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

function StandingsTable({ rows, showConference }: { rows: Standing[]; showConference?: boolean }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-hoop-dark-border bg-hoop-dark-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-hoop-dark-border">
            <th className="sticky left-0 bg-hoop-dark-card px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground w-6">#</th>
            <th className="sticky left-6 bg-hoop-dark-card px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[180px]">Team</th>
            {showConference && (
              <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Conf</th>
            )}
            {['W', 'L', 'PCT', 'GB', 'L10', 'Strk', 'Home', 'Away'].map((h) => (
              <th key={h} className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((s, i) => {
            const isPlayoff = i < 6
            const isPlayin  = i >= 6 && i < 10
            const color     = getTeamColor(s.team)
            return (
              <motion.tr
                key={s.team_id}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
                className="border-b border-hoop-dark-border/30 last:border-0 hover:bg-hoop-dark-hover transition-colors"
              >
                {/* Rank */}
                <td className="sticky left-0 bg-hoop-dark-card px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className={cn(
                      'h-4 w-1 rounded-full shrink-0',
                      isPlayoff ? 'bg-hoop-orange' : isPlayin ? 'bg-blue-500' : 'bg-hoop-dark-border',
                    )} />
                    <span className="font-bold text-foreground">{s.rank}</span>
                  </div>
                </td>
                {/* Team */}
                <td className="sticky bg-hoop-dark-card px-4 py-3">
                  <Link href={`/teams/${s.team_id}`} className="flex items-center gap-2 group">
                    <div
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-semibold text-foreground group-hover:text-hoop-orange transition-colors whitespace-nowrap">
                      {s.team}
                    </span>
                  </Link>
                </td>
                {showConference && (
                  <td className="px-3 py-3 text-center">
                    <Badge variant="secondary" className="text-[10px]">
                      {s.conference?.slice(0, 4) ?? '—'}
                    </Badge>
                  </td>
                )}
                <td className="px-3 py-3 text-center font-semibold tabular-nums">{s.wins}</td>
                <td className="px-3 py-3 text-center text-muted-foreground tabular-nums">{s.losses}</td>
                <td className="px-3 py-3 text-center tabular-nums">{fmtWinPct(s.win_pct)}</td>
                <td className="px-3 py-3 text-center text-muted-foreground tabular-nums">
                  {s.games_behind === 0 ? '—' : s.games_behind ?? '—'}
                </td>
                <td className="px-3 py-3 text-center text-muted-foreground tabular-nums">{s.last_ten ?? '—'}</td>
                <td className={cn(
                  'px-3 py-3 text-center text-xs font-semibold tabular-nums',
                  s.streak?.startsWith('W') ? 'text-hoop-win' : s.streak?.startsWith('L') ? 'text-hoop-loss' : 'text-muted-foreground',
                )}>
                  {s.streak ?? '—'}
                </td>
                <td className="px-3 py-3 text-center text-muted-foreground text-xs tabular-nums">{s.home_record ?? '—'}</td>
                <td className="px-3 py-3 text-center text-muted-foreground text-xs tabular-nums">{s.away_record ?? '—'}</td>
              </motion.tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
