'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { fmtWinPct } from '@/lib/utils/formatters'
import { TeamLogo } from '@/components/media/TeamLogo'
import type { Standing } from '@/types'

interface StandingsPreviewProps {
  standings: Standing[]
  conference?: string
}

export function StandingsPreview({ standings, conference }: StandingsPreviewProps) {
  const filtered = conference
    ? standings.filter((s) => s.conference?.toLowerCase() === conference.toLowerCase())
    : standings
  const top8 = filtered.slice(0, 8)

  return (
    <div className="rounded-xl border border-hoop-dark-border bg-hoop-dark-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-hoop-dark-border px-4 py-3">
        <h3 className="text-sm font-semibold">
          {conference ? `${conference} Conference` : 'Standings'}
        </h3>
        <Link
          href="/standings"
          className="flex items-center gap-1 text-xs text-hoop-orange hover:text-hoop-orange-400 transition-colors"
        >
          Full standings <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-2 border-b border-hoop-dark-border/50 px-4 py-2">
        <span className="text-[10px] font-semibold uppercase text-muted-foreground w-5">#</span>
        <span className="text-[10px] font-semibold uppercase text-muted-foreground">Team</span>
        <span className="text-[10px] font-semibold uppercase text-muted-foreground w-8 text-right">W</span>
        <span className="text-[10px] font-semibold uppercase text-muted-foreground w-8 text-right">L</span>
        <span className="text-[10px] font-semibold uppercase text-muted-foreground w-12 text-right">PCT</span>
        <span className="text-[10px] font-semibold uppercase text-muted-foreground w-8 text-right">GB</span>
      </div>

      {/* Rows */}
      <div>
        {top8.map((s, i) => {
          const isPlayoff = i < 6
          const isPlayin  = i >= 6 && i < 8
          return (
            <motion.div
              key={s.team_id}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link
                href={`/teams/${s.team_id}`}
                className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-2 items-center px-4 py-2.5 hover:bg-hoop-dark-hover transition-colors border-b border-hoop-dark-border/30 last:border-0 group"
              >
                <span className={cn(
                  'w-5 text-xs font-bold text-center',
                  isPlayoff ? 'text-hoop-orange' : isPlayin ? 'text-muted-foreground' : 'text-muted-foreground/50',
                )}>
                  {s.rank}
                </span>
                <div className="flex items-center gap-2 min-w-0">
                  <TeamLogo
                    teamName={s.team}
                    teamId={s.team_id}
                    size={18}
                  />
                  <span className="text-sm font-medium text-foreground truncate group-hover:text-hoop-orange transition-colors">
                    {s.team}
                  </span>
                </div>
                <span className="w-8 text-right text-sm font-semibold tabular-nums">{s.wins}</span>
                <span className="w-8 text-right text-sm text-muted-foreground tabular-nums">{s.losses}</span>
                <span className="w-12 text-right text-xs text-muted-foreground tabular-nums">
                  {fmtWinPct(s.win_pct)}
                </span>
                <span className="w-8 text-right text-xs text-muted-foreground tabular-nums">
                  {s.games_behind === 0 ? '—' : s.games_behind ?? '—'}
                </span>
              </Link>
            </motion.div>
          )
        })}
      </div>

      {/* Playoff legend */}
      <div className="flex items-center gap-4 border-t border-hoop-dark-border/50 px-4 py-2">
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-hoop-orange" />
          <span className="text-[10px] text-muted-foreground">Playoff</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">Play-In</span>
        </div>
      </div>
    </div>
  )
}
