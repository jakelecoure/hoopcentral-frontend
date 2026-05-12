'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { PlayerHeadshot } from '@/components/media/PlayerHeadshot'
import { getTeamColor } from '@/lib/utils/constants'
import type { Player } from '@/types'

interface StatLeaderboardProps {
  players: Player[]
  statKey: string
  statLabel: string
  title: string
  limit?: number
  fmt?: (v: number) => string
}

function coerce(player: Player, key: string): number | null {
  const raw = (player as Record<string, unknown>)[key]
  if (raw == null) return null
  const n = Number(raw)
  return isNaN(n) ? null : n
}

export function StatLeaderboard({
  players,
  statKey,
  statLabel,
  title,
  limit = 15,
  fmt = (v) => (v % 1 === 0 ? String(v) : v.toFixed(1)),
}: StatLeaderboardProps) {
  const ranked = players
    .map((p) => ({ player: p, val: coerce(p, statKey) }))
    .filter((x): x is { player: Player; val: number } => x.val !== null && x.val > 0)
    .sort((a, b) => b.val - a.val)
    .slice(0, limit)

  const max = ranked[0]?.val ?? 1

  if (ranked.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
        No {statLabel} data available.
      </div>
    )
  }

  return (
    <div>
      <p className="text-xs text-muted-foreground mb-3 font-semibold uppercase tracking-wider">{title}</p>
      <div className="space-y-1">
        {ranked.map(({ player, val }, i) => {
          const color = getTeamColor(player.team)
          const pct   = (val / max) * 100
          const nbaId = (player as Record<string, unknown>).nba_id as string | number | undefined
          return (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.025 }}
            >
              <Link
                href={`/players/${player.id}`}
                className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-hoop-dark-hover transition-colors group"
              >
                <span className="w-6 text-center text-xs font-bold text-muted-foreground shrink-0">
                  {i + 1}
                </span>
                <PlayerHeadshot
                  nbaId={nbaId}
                  photoUrl={player.photo_url}
                  name={player.name}
                  team={player.team}
                  size={32}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-sm font-medium text-foreground group-hover:text-hoop-orange transition-colors truncate">
                      {player.name}
                    </p>
                    <span className="text-base font-black tabular-nums shrink-0 ml-2" style={{ color }}>
                      {fmt(val)}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mb-1">{player.team}</p>
                  <div className="h-1 rounded-full bg-hoop-dark-border overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
