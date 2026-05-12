'use client'

import { use, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, MapPin } from 'lucide-react'
import Link from 'next/link'
import { useLeague } from '@/lib/hooks/useLeague'
import { useFetch } from '@/lib/hooks/useFetch'
import { useWebSocket } from '@/lib/hooks/useWebSocket'
import { fetchGame } from '@/lib/api/games'
import { BoxScore } from '@/components/game/BoxScore'
import { QuarterScores } from '@/components/game/QuarterScores'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { SkeletonTable, SkeletonPlayerHeader } from '@/components/common/SkeletonCard'
import { ErrorState } from '@/components/common/ErrorState'
import { getTeamColor } from '@/lib/utils/constants'
import { fmtDate, fmtGameTime } from '@/lib/utils/formatters'
import type { GameDetail, WsMessage } from '@/types'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function GameDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const { league } = useLeague()
  const [liveData, setLiveData] = useState<Partial<GameDetail> | null>(null)

  const { data: game, loading, error, refetch } = useFetch<GameDetail>(
    () => fetchGame(id, league),
    [id, league],
  )

  // Real-time updates
  useWebSocket((msg: WsMessage) => {
    if (msg.type === 'score_update' && String(msg.data.game_id) === id) {
      setLiveData((prev) => ({ ...prev, ...msg.data }))
    }
    if (msg.type === 'game_update' && String(msg.data.id) === id) {
      setLiveData((prev) => ({ ...prev, ...msg.data }))
    }
  })

  const merged = game ? { ...game, ...liveData } : null
  const isLive = merged?.status === 'live'
  const homeColor = merged ? getTeamColor(merged.home_team) : '#f97316'
  const awayColor = merged ? getTeamColor(merged.away_team) : '#64748b'

  if (loading) {
    return (
      <div className="mx-auto max-w-screen-xl px-4 py-6 lg:px-6 space-y-6">
        <SkeletonPlayerHeader />
        <SkeletonTable rows={8} cols={8} />
      </div>
    )
  }

  if (error || !merged) {
    return (
      <div className="mx-auto max-w-screen-xl px-4 py-6 lg:px-6">
        <ErrorState message={error ?? 'Game not found'} onRetry={refetch} />
      </div>
    )
  }

  const hasScore = merged.home_score != null && merged.away_score != null
  const homeWin  = merged.status === 'final' && hasScore && merged.home_score! > merged.away_score!
  const awayWin  = merged.status === 'final' && hasScore && merged.away_score! > merged.home_score!

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-6 lg:px-6 space-y-6">
      {/* Back link */}
      <Link
        href="/games"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-hoop-orange transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All Games
      </Link>

      {/* Game header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-hoop-dark-border bg-hoop-dark-card"
      >
        <div className="absolute inset-0" style={{
          background: `linear-gradient(135deg, ${awayColor}10 0%, transparent 50%, ${homeColor}10 100%)`,
        }} />

        <div className="relative p-6 sm:p-8">
          {/* Status */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isLive ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-hoop-live animate-live-pulse" />
                  <Badge variant="live">LIVE</Badge>
                  {merged.period && (
                    <span className="text-sm font-semibold text-hoop-live">
                      Q{merged.period}{merged.clock ? ` · ${merged.clock}` : ''}
                    </span>
                  )}
                </>
              ) : (
                <Badge variant="secondary">{merged.status === 'final' ? 'Final' : 'Upcoming'}</Badge>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {fmtGameTime(merged.date)}
              </span>
              {merged.arena && (
                <span className="flex items-center gap-1 hidden sm:flex">
                  <MapPin className="h-3.5 w-3.5" />
                  {merged.arena}
                </span>
              )}
            </div>
          </div>

          {/* Score display */}
          <div className="flex items-center justify-center gap-4 sm:gap-8">
            {/* Away team */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-black"
                style={{ backgroundColor: awayColor + '20', border: `2px solid ${awayColor}40`, color: awayColor }}
              >
                {merged.away_team.split(' ').pop()?.slice(0, 3).toUpperCase()}
              </div>
              <Link href={merged.away_team_id ? `/teams/${merged.away_team_id}` : '#'}>
                <p className={`text-center text-sm font-semibold sm:text-base hover:text-hoop-orange transition-colors ${awayWin ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {merged.away_team}
                </p>
              </Link>
              <span className="text-xs text-muted-foreground">AWAY</span>
            </div>

            {/* Score */}
            {hasScore ? (
              <div className="flex items-center gap-3 sm:gap-5 shrink-0">
                <span className={`text-5xl font-black tabular-nums sm:text-6xl ${awayWin ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {merged.away_score}
                </span>
                <span className="text-2xl font-light text-hoop-dark-border">—</span>
                <span className={`text-5xl font-black tabular-nums sm:text-6xl ${homeWin ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {merged.home_score}
                </span>
              </div>
            ) : (
              <div className="shrink-0 text-2xl font-bold text-muted-foreground">VS</div>
            )}

            {/* Home team */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-black"
                style={{ backgroundColor: homeColor + '20', border: `2px solid ${homeColor}40`, color: homeColor }}
              >
                {merged.home_team.split(' ').pop()?.slice(0, 3).toUpperCase()}
              </div>
              <Link href={merged.home_team_id ? `/teams/${merged.home_team_id}` : '#'}>
                <p className={`text-center text-sm font-semibold sm:text-base hover:text-hoop-orange transition-colors ${homeWin ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {merged.home_team}
                </p>
              </Link>
              <span className="text-xs text-muted-foreground">HOME</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quarter scores */}
      {merged.quarter_scores && (
        <QuarterScores
          homeTeam={merged.home_team}
          awayTeam={merged.away_team}
          quarterScores={merged.quarter_scores}
          homeScore={merged.home_score}
          awayScore={merged.away_score}
        />
      )}

      {/* Box score & stats */}
      {(merged.home_players?.length || merged.away_players?.length) ? (
        <Tabs defaultValue="boxscore">
          <TabsList>
            <TabsTrigger value="boxscore">Box Score</TabsTrigger>
            <TabsTrigger value="teamstats">Team Stats</TabsTrigger>
          </TabsList>
          <TabsContent value="boxscore">
            <BoxScore
              homePlayers={merged.home_players ?? []}
              awayPlayers={merged.away_players ?? []}
              homeTeam={merged.home_team}
              awayTeam={merged.away_team}
            />
          </TabsContent>
          <TabsContent value="teamstats">
            <div className="rounded-xl border border-hoop-dark-border bg-hoop-dark-card p-6">
              <p className="text-sm text-muted-foreground text-center">Team stats coming soon.</p>
            </div>
          </TabsContent>
        </Tabs>
      ) : null}
    </div>
  )
}
