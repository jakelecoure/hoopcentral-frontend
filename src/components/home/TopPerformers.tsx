'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp } from 'lucide-react'
import { PlayerHeadshot } from '@/components/media/PlayerHeadshot'
import { getTeamColor } from '@/lib/utils/constants'
import type { Player } from '@/types'

interface TopPerformersProps {
  players: Player[]
  statKey?: string
  statLabel?: string
  title?: string
}

// Coerce stat value — handles number, string, or undefined
function getStat(player: Player, key: string): number | null {
  const raw = (player as Record<string, unknown>)[key]
  if (raw == null) return null
  const n = Number(raw)
  return isNaN(n) ? null : n
}

export function TopPerformers({
  players,
  statKey = 'pts',
  statLabel = 'PTS',
  title = 'Scoring Leaders',
}: TopPerformersProps) {
  const withStats = players
    .map((p) => ({ player: p, val: getStat(p, statKey) }))
    .filter((x): x is { player: Player; val: number } => x.val !== null && x.val > 0)
    .sort((a, b) => b.val - a.val)
    .slice(0, 8)

  const maxVal = withStats[0]?.val ?? 1

  return (
    <div className="rounded-xl border border-hoop-dark-border bg-hoop-dark-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-hoop-dark-border px-4 py-3">
        <h3 className="text-sm font-semibold">{title}</h3>
        <Link
          href="/players"
          className="flex items-center gap-1 text-xs text-hoop-orange hover:text-hoop-orange-400 transition-colors"
        >
          All players <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {withStats.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-10 px-4 text-center">
          <TrendingUp className="h-8 w-8 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">
            Stats not included in the player list endpoint.
          </p>
          <Link href="/players" className="text-xs text-hoop-orange hover:underline">
            Browse all players →
          </Link>
        </div>
      ) : (
        <div>
          {withStats.map(({ player, val }, i) => {
            const color = getTeamColor(player.team)
            const pct   = (val / maxVal) * 100
            return (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  href={`/players/${player.id}`}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-hoop-dark-hover transition-colors border-b border-hoop-dark-border/30 last:border-0 group"
                >
                  <span className="w-5 text-center text-sm font-bold text-muted-foreground shrink-0">
                    {i + 1}
                  </span>
                  <PlayerHeadshot
                    nbaId={(player as Record<string, unknown>).nba_id as string | number | undefined}
                    photoUrl={player.photo_url}
                    name={player.name}
                    team={player.team}
                    size={32}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate group-hover:text-hoop-orange transition-colors">
                      {player.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">{player.team}</p>
                    <div className="mt-1 h-1 rounded-full bg-hoop-dark-border overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                  <span className="text-lg font-black tabular-nums text-hoop-orange shrink-0">
                    {val % 1 === 0 ? val : val.toFixed(1)}
                  </span>
                </Link>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
