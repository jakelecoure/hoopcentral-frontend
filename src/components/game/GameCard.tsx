'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { Badge } from '@/components/ui/badge'
import { getTeamColor } from '@/lib/utils/constants'
import { TeamLogo } from '@/components/media/TeamLogo'
import { fmtShortDate, fmtGameTime } from '@/lib/utils/formatters'
import type { Game } from '@/types'

interface GameCardProps {
  game: Game
  index?: number
}

export function GameCard({ game, index = 0 }: GameCardProps) {
  const isLive  = game.status === 'live'
  const isFinal = game.status === 'final'
  const hasScore = game.home_score != null && game.away_score != null

  const homeWin = isFinal && hasScore && game.home_score! > game.away_score!
  const awayWin = isFinal && hasScore && game.away_score! > game.home_score!

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
    >
      <Link href={`/games/${game.id}`}>
        <div className={cn(
          'group relative rounded-xl border bg-hoop-dark-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20',
          isLive
            ? 'border-hoop-live/30 hover:border-hoop-live/50'
            : 'border-hoop-dark-border hover:border-hoop-dark-border/80',
        )}>
          {/* Status row */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isLive ? (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-hoop-live animate-live-pulse" />
                  <Badge variant="live" className="text-[10px] py-0 px-1.5">LIVE</Badge>
                  {game.period && (
                    <span className="text-[10px] font-semibold text-hoop-live">
                      Q{game.period}{game.clock ? ` ${game.clock}` : ''}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  {isFinal ? 'Final' : fmtGameTime(game.date)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-muted-foreground">{fmtShortDate(game.date)}</span>
          </div>

          {/* Teams & scores */}
          <div className="space-y-2">
            <TeamRow
              name={game.away_team}
              teamId={game.away_team_id}
              score={game.away_score}
              isWinner={awayWin}
              isLive={isLive}
            />
            <TeamRow
              name={game.home_team}
              teamId={game.home_team_id}
              score={game.home_score}
              isWinner={homeWin}
              isLive={isLive}
              homeAway="home"
            />
          </div>

          {/* Arena */}
          {game.arena && (
            <p className="mt-3 text-[10px] text-muted-foreground truncate">{game.arena}</p>
          )}

          {/* Orange accent on hover */}
          <div className="absolute inset-y-0 left-0 w-0.5 rounded-l-xl bg-hoop-orange opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </Link>
    </motion.div>
  )
}

function TeamRow({
  name,
  teamId,
  score,
  isWinner,
  isLive,
  homeAway,
}: {
  name: string
  teamId?: string | number
  score?: number
  isWinner: boolean
  isLive: boolean
  homeAway?: 'home' | 'away'
}) {
  const color = getTeamColor(name)

  return (
    <div className="flex items-center gap-3">
      <TeamLogo teamName={name} teamId={teamId} size={20} />

      <span className={cn(
        'flex-1 text-sm font-medium truncate',
        isWinner ? 'text-foreground font-semibold' : 'text-muted-foreground',
      )}>
        {name}
        {homeAway === 'home' && (
          <span className="ml-1.5 text-[10px] text-muted-foreground/60">HOME</span>
        )}
      </span>

      {score != null && (
        <span className={cn(
          'text-lg font-bold tabular-nums leading-none',
          isWinner ? 'text-foreground' : isLive ? 'text-hoop-orange' : 'text-muted-foreground',
        )}>
          {score}
        </span>
      )}
    </div>
  )
}
