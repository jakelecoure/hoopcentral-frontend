'use client'

import { use } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useLeague } from '@/lib/hooks/useLeague'
import { useFetch } from '@/lib/hooks/useFetch'
import { fetchTeam } from '@/lib/api/teams'
import { TeamHeader } from '@/components/team/TeamHeader'
import { TeamRoster } from '@/components/team/TeamRoster'
import { GameCard } from '@/components/game/GameCard'
import { StatsTable } from '@/components/stats/StatsTable'
import { StatRow } from '@/components/common/StatCard'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SkeletonPlayerHeader, SkeletonTable } from '@/components/common/SkeletonCard'
import { ErrorState } from '@/components/common/ErrorState'
import type { TeamDetail, Player, PlayerStats } from '@/types'

function toStatsRow(player: Player): { player: Player; stats: PlayerStats } | null {
  const s = player as Record<string, unknown>
  const pts = Number(s.pts)
  if (isNaN(pts)) return null
  return {
    player,
    stats: {
      gp:      Number(s.gp)  || 0,
      min:     String(s.min ?? ''),
      pts,
      reb:     Number(s.reb) || 0,
      ast:     Number(s.ast) || 0,
      stl:     Number(s.stl) || 0,
      blk:     Number(s.blk) || 0,
      to:      Number(s.to)  || 0,
      fg_pct:  s.fg_pct  != null ? Number(s.fg_pct)  : undefined,
      fg3_pct: s.fg3_pct != null ? Number(s.fg3_pct) : undefined,
      ft_pct:  s.ft_pct  != null ? Number(s.ft_pct)  : undefined,
    },
  }
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function TeamDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const { league } = useLeague()

  const { data: team, loading, error, refetch } = useFetch<TeamDetail>(
    () => fetchTeam(id, league),
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

  if (error || !team) {
    return (
      <div className="mx-auto max-w-screen-xl px-4 py-6 lg:px-6">
        <ErrorState message={error ?? 'Team not found'} onRetry={refetch} />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-6 lg:px-6 space-y-6">
      <Link
        href="/teams"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-hoop-orange transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All Teams
      </Link>

      <TeamHeader team={team} />

      <Tabs defaultValue="roster">
        <TabsList>
          <TabsTrigger value="roster">Roster</TabsTrigger>
          <TabsTrigger value="games">Recent Games</TabsTrigger>
          <TabsTrigger value="stats">Team Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="roster">
          {team.roster?.length ? (
            <TeamRoster players={team.roster} teamName={team.name} />
          ) : (
            <div className="rounded-xl border border-hoop-dark-border bg-hoop-dark-card p-12 text-center">
              <p className="text-muted-foreground">Roster not available.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="games">
          {team.recent_games?.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {team.recent_games.map((g, i) => <GameCard key={g.id} game={g} index={i} />)}
            </div>
          ) : (
            <div className="rounded-xl border border-hoop-dark-border bg-hoop-dark-card p-12 text-center">
              <p className="text-muted-foreground">No recent games.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="stats">
          <div className="space-y-6">
            {team.stats && (
              <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                  <CardHeader><CardTitle>Offense</CardTitle></CardHeader>
                  <CardContent>
                    <StatRow label="Points/Game"     value={team.stats.ppg?.toFixed(1)} />
                    <StatRow label="Off. Rating"     value={team.stats.off_rtg?.toFixed(1)} />
                    <StatRow label="Pace"            value={team.stats.pace?.toFixed(1)} />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>Defense</CardTitle></CardHeader>
                  <CardContent>
                    <StatRow label="Opp Pts/Game"    value={team.stats.opp_ppg?.toFixed(1)} />
                    <StatRow label="Def. Rating"     value={team.stats.def_rtg?.toFixed(1)} />
                    <StatRow label="Net Rating"      value={team.stats.net_rtg?.toFixed(1)} />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>Overview</CardTitle></CardHeader>
                  <CardContent>
                    <StatRow label="Record"          value={`${team.wins}-${team.losses}`} />
                    <StatRow label="Win %"           value={team.win_pct?.toFixed(3)} />
                    <StatRow label="Conf. Rank"      value={team.conference_rank?.toString()} />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Roster stats table */}
            {(() => {
              const rows = (team.roster ?? []).map(toStatsRow).filter((r): r is NonNullable<typeof r> => r !== null)
              return rows.length > 0 ? (
                <div>
                  <h3 className="text-sm font-semibold mb-3">Roster Stats</h3>
                  <StatsTable rows={rows} defaultMode="per_game" defaultSort="pts" />
                </div>
              ) : (
                <div className="rounded-xl border border-hoop-dark-border bg-hoop-dark-card p-12 text-center">
                  <p className="text-muted-foreground">Player stats not available.</p>
                </div>
              )
            })()}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
