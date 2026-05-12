'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { getTeamColor } from '@/lib/utils/constants'
import type { Player } from '@/types'

interface TeamRosterProps {
  players: Player[]
  teamName: string
}

function getInitials(name: string): string {
  const p = name.split(' ')
  return p.length >= 2 ? p[0][0] + p[p.length - 1][0] : name.slice(0, 2)
}

export function TeamRoster({ players, teamName }: TeamRosterProps) {
  const color = getTeamColor(teamName)
  const grouped = players.reduce<Record<string, Player[]>>((acc, p) => {
    const pos = p.position ?? 'Other'
    return { ...acc, [pos]: [...(acc[pos] ?? []), p] }
  }, {})

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([pos, group]) => (
        <div key={pos}>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {pos}
          </h3>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {group.map((player, i) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link href={`/players/${player.id}`}>
                  <div className="flex items-center gap-3 rounded-xl border border-hoop-dark-border bg-hoop-dark-card p-3 hover:border-hoop-dark-border/80 hover:bg-hoop-dark-hover transition-all group">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarFallback
                        className="text-xs font-bold"
                        style={{ backgroundColor: color + '20', color }}
                      >
                        {getInitials(player.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground truncate group-hover:text-hoop-orange transition-colors">
                        {player.name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {player.jersey_number && (
                          <span className="text-xs text-muted-foreground">#{player.jersey_number}</span>
                        )}
                        {player.position && (
                          <Badge variant="secondary" className="text-[10px] py-0 px-1.5">
                            {player.position}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      {player.height && (
                        <p className="text-xs text-muted-foreground">{player.height}</p>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
