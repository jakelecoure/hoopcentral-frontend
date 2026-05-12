'use client'

import { use } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useLeague } from '@/lib/hooks/useLeague'
import { useFetch } from '@/lib/hooks/useFetch'
import { fetchPlayer } from '@/lib/api/players'
import { PlayerHeader } from '@/components/player/PlayerHeader'
import { GameLog } from '@/components/player/GameLog'
import { StatTrendChart, ShootingChart } from '@/components/player/StatTrendChart'
import { StatsTable } from '@/components/stats/StatsTable'
import { DataTable, type Column } from '@/components/common/DataTable'
import { StatRow } from '@/components/common/StatCard'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SkeletonPlayerHeader, SkeletonTable } from '@/components/common/SkeletonCard'
import { ErrorState } from '@/components/common/ErrorState'
import { fmtPct, fmtStat } from '@/lib/utils/formatters'
import type { PlayerDetail } from '@/types'
import { Separator } from '@/components/ui/separator'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function PlayerDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const { league } = useLeague()

  const { data: player, loading, error, refetch } = useFetch<PlayerDetail>(
    () => fetchPlayer(id, league),
    [id, league],
  )

  if (loading) {
    return (
      <div className="mx-auto max-w-screen-xl px-4 py-6 lg:px-6 space-y-6">
        <SkeletonPlayerHeader />
        <SkeletonTable />
      </div>
    )
  }

  if (error || !player) {
    return (
      <div className="mx-auto max-w-screen-xl px-4 py-6 lg:px-6">
        <ErrorState message={error ?? 'Player not found'} onRetry={refetch} />
      </div>
    )
  }

  const stats   = player.stats ?? {} as import('@/types').PlayerStats
  const gameLog = player.game_log ?? []

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-6 lg:px-6 space-y-6">
      {/* Back */}
      <Link
        href="/players"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-hoop-orange transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All Players
      </Link>

      {/* Header */}
      <PlayerHeader player={player} />

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="gamelog">Game Log</TabsTrigger>
          <TabsTrigger value="splits">Splits</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview">
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            {/* Left */}
            <div className="space-y-6">
              {/* Season stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Season Averages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-x-8 sm:grid-cols-3">
                    {[
                      { label: 'Points',   value: fmtStat(stats.pts) },
                      { label: 'Rebounds', value: fmtStat(stats.reb) },
                      { label: 'Assists',  value: fmtStat(stats.ast) },
                      { label: 'Steals',   value: fmtStat(stats.stl) },
                      { label: 'Blocks',   value: fmtStat(stats.blk) },
                      { label: 'Turnovers',value: fmtStat(stats.to) },
                      { label: 'Minutes',  value: stats.min ?? '—' },
                      { label: 'GP',       value: stats.gp?.toString() ?? '—' },
                    ].map(({ label, value }) => (
                      <StatRow key={label} label={label} value={value} />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Full stats table with per-mode toggle */}
              <StatsTable
                rows={[{ player, stats }]}
                defaultMode="per_game"
                defaultSort="pts"
              />

              {/* Trend chart */}
              {gameLog.length > 0 && (
                <StatTrendChart data={gameLog} stat="pts" label="Points" />
              )}
            </div>

            {/* Right */}
            <div className="space-y-4">
              {/* Shooting */}
              <ShootingChart
                fgPct={stats.fg_pct}
                fg3Pct={stats.fg3_pct}
                ftPct={stats.ft_pct}
                tsPct={stats.ts_pct}
                efgPct={stats.efg_pct}
              />

              {/* Bio info */}
              <Card>
                <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
                <CardContent className="space-y-0">
                  {[
                    { label: 'Team',       value: player.team },
                    { label: 'Position',   value: player.position ?? '—' },
                    { label: 'Height',     value: player.height   ?? '—' },
                    { label: 'Weight',     value: player.weight   ?? '—' },
                    { label: 'College',    value: player.college  ?? '—' },
                    { label: 'Birthdate',  value: player.birthdate ?? '—' },
                    { label: 'Experience', value: player.experience != null ? `${player.experience} years` : '—' },
                  ].map(({ label, value }) => (
                    <StatRow key={label} label={label} value={value} />
                  ))}
                </CardContent>
              </Card>

              {/* Awards */}
              {player.awards && player.awards.length > 0 && (
                <Card>
                  <CardHeader><CardTitle>Awards</CardTitle></CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {player.awards.map((a, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <span className="text-hoop-orange">🏆</span>
                          {a}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Game Log */}
        <TabsContent value="gamelog">
          {gameLog.length > 0 ? (
            <div className="space-y-4">
              <StatTrendChart data={gameLog} stat="pts" label="Points" />
              <GameLog entries={gameLog} />
            </div>
          ) : (
            <div className="rounded-xl border border-hoop-dark-border bg-hoop-dark-card p-12 text-center">
              <p className="text-muted-foreground">No game log available.</p>
            </div>
          )}
        </TabsContent>

        {/* Splits */}
        <TabsContent value="splits">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader><CardTitle>Home vs Away</CardTitle></CardHeader>
              <CardContent>
                {['home', 'away'].map((ha) => {
                  const gamesHA = gameLog.filter((g) => g.home_away === ha)
                  const avgPts  = gamesHA.length ? gamesHA.reduce((s, g) => s + g.pts, 0) / gamesHA.length : 0
                  const avgReb  = gamesHA.length ? gamesHA.reduce((s, g) => s + g.reb, 0) / gamesHA.length : 0
                  return (
                    <div key={ha} className="mb-4 last:mb-0">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        {ha === 'home' ? 'Home' : 'Away'}
                      </p>
                      <StatRow label="PTS" value={avgPts.toFixed(1)} />
                      <StatRow label="REB" value={avgReb.toFixed(1)} />
                      <StatRow label="Games" value={gamesHA.length.toString()} />
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>W/L Splits</CardTitle></CardHeader>
              <CardContent>
                {['W', 'L'].map((res) => {
                  const g   = gameLog.filter((gl) => gl.result === res)
                  const avg = g.length ? g.reduce((s, gl) => s + gl.pts, 0) / g.length : 0
                  return (
                    <div key={res} className="mb-4 last:mb-0">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        {res === 'W' ? 'Wins' : 'Losses'}
                      </p>
                      <StatRow label="Avg PTS" value={avg.toFixed(1)} />
                      <StatRow label="Games"   value={g.length.toString()} />
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Advanced */}
        <TabsContent value="advanced">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Advanced Stats</CardTitle></CardHeader>
              <CardContent>
                {[
                  { label: 'True Shooting %',     value: fmtPct(stats.ts_pct) },
                  { label: 'Eff. FG %',           value: fmtPct(stats.efg_pct) },
                  { label: 'Player Efficiency',   value: stats.per?.toFixed(1) ?? '—' },
                  { label: 'Usage Rate',          value: fmtPct(stats.usg_pct) },
                  { label: 'Box +/-',             value: stats.bpm?.toFixed(1) ?? '—' },
                  { label: 'VORP',                value: stats.vorp?.toFixed(1) ?? '—' },
                ].map(({ label, value }) => (
                  <StatRow key={label} label={label} value={value} />
                ))}
              </CardContent>
            </Card>

            {player.contract && (
              <Card>
                <CardHeader><CardTitle>Contract</CardTitle></CardHeader>
                <CardContent>
                  <StatRow label="Value"   value={player.contract.value} />
                  <StatRow label="AAV"     value={player.contract.aav} />
                  <StatRow label="Years"   value={player.contract.years.toString()} />
                  <StatRow label="Expires" value={player.contract.expires} />
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
