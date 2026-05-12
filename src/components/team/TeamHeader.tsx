'use client'

import { motion } from 'framer-motion'
import { Trophy, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getTeamColor } from '@/lib/utils/constants'
import { TeamLogo } from '@/components/media/TeamLogo'
import { fmtWinPct } from '@/lib/utils/formatters'
import type { TeamDetail } from '@/types'

interface TeamHeaderProps {
  team: TeamDetail
}

export function TeamHeader({ team }: TeamHeaderProps) {
  const color = getTeamColor(team.name)

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-hoop-dark-border bg-hoop-dark-card"
    >
      {/* Top accent */}
      <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: color }} />

      {/* Background gradient */}
      <div
        className="absolute inset-0 opacity-5"
        style={{ background: `radial-gradient(ellipse at top left, ${color}, transparent 70%)` }}
      />

      <div className="relative flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
        {/* Team logo */}
        <TeamLogo
          teamName={team.name}
          teamId={team.id}
          logoUrl={team.logo_url}
          size={80}
          priority
        />

        {/* Info */}
        <div className="flex-1 min-w-0">
          {team.city && (
            <p className="text-sm text-muted-foreground mb-0.5">{team.city}</p>
          )}
          <h1 className="text-2xl font-black text-foreground sm:text-3xl">{team.name}</h1>

          <div className="mt-2 flex flex-wrap gap-2">
            {team.conference && (
              <Badge variant="secondary">{team.conference}</Badge>
            )}
            {team.division && (
              <Badge variant="outline">{team.division}</Badge>
            )}
            {team.head_coach && (
              <Badge variant="outline">HC: {team.head_coach}</Badge>
            )}
          </div>

          {team.arena && (
            <p className="mt-2 text-xs text-muted-foreground">{team.arena}</p>
          )}
        </div>

        {/* Record */}
        <div className="flex gap-6 sm:flex-col sm:items-end sm:gap-3">
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-3xl font-black tabular-nums text-hoop-orange">
              {team.wins}-{team.losses}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Record
            </span>
          </div>
          {team.win_pct != null && (
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-lg font-bold tabular-nums text-foreground">
                {fmtWinPct(team.win_pct)}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                WIN%
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
