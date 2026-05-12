'use client'

import { motion } from 'framer-motion'
import { MapPin, Ruler, Scale, Calendar, Award } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { PlayerHeadshot } from '@/components/media/PlayerHeadshot'
import type React from 'react'
import { getTeamColor } from '@/lib/utils/constants'
import { fmtDate } from '@/lib/utils/formatters'
import type { PlayerDetail } from '@/types'

interface PlayerHeaderProps {
  player: PlayerDetail
}

export function PlayerHeader({ player }: PlayerHeaderProps) {
  const teamColor = getTeamColor(player.team)

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-2xl border border-hoop-dark-border bg-hoop-dark-card"
    >
      {/* Color accent strip */}
      <div
        className="absolute inset-x-0 top-0 h-1 rounded-t-2xl"
        style={{ backgroundColor: teamColor }}
      />

      {/* Background gradient */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          background: `radial-gradient(ellipse at top left, ${teamColor}, transparent 70%)`,
        }}
      />

      <div className="relative flex flex-col gap-6 p-6 sm:flex-row sm:items-start">
        {/* Headshot */}
        <div className="ring-4 ring-hoop-dark-border rounded-full">
          <PlayerHeadshot
            nbaId={(player as Record<string, unknown>).nba_id as string | number | undefined}
            photoUrl={player.photo_url}
            name={player.name}
            team={player.team}
            size={112}
            priority
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            {player.jersey_number && (
              <span className="text-sm font-bold text-muted-foreground">#{player.jersey_number}</span>
            )}
            {player.position && (
              <Badge variant="secondary" className="text-xs">{player.position}</Badge>
            )}
          </div>

          <h1 className="text-2xl font-black text-foreground sm:text-3xl leading-tight mb-1">
            {player.name}
          </h1>

          <p className="mb-4 text-sm font-medium" style={{ color: teamColor }}>
            {player.team}
          </p>

          {/* Meta grid */}
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {player.height && (
              <MetaItem icon={Ruler} label={player.height} />
            )}
            {player.weight && (
              <MetaItem icon={Scale} label={player.weight} />
            )}
            {player.birthdate && (
              <MetaItem icon={Calendar} label={fmtDate(player.birthdate)} />
            )}
            {player.nationality && (
              <MetaItem icon={MapPin} label={player.nationality} />
            )}
            {player.experience != null && (
              <MetaItem icon={Award} label={`${player.experience}yr experience`} />
            )}
          </div>

          {/* Draft info */}
          {player.draft_year && (
            <p className="mt-3 text-xs text-muted-foreground">
              Draft {player.draft_year}
              {player.draft_pick && ` · ${player.draft_pick}`}
              {player.college && ` · ${player.college}`}
            </p>
          )}
        </div>

        {/* Quick stats */}
        {player.stats && (
          <div className="flex gap-4 sm:flex-col sm:items-end sm:gap-3">
            <QuickStat label="PPG" value={player.stats.pts?.toFixed(1)} />
            <QuickStat label="RPG" value={player.stats.reb?.toFixed(1)} />
            <QuickStat label="APG" value={player.stats.ast?.toFixed(1)} />
          </div>
        )}
      </div>
    </motion.div>
  )
}

function MetaItem({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Icon className="h-3.5 w-3.5" />
      <span>{label}</span>
    </div>
  )
}

function QuickStat({ label, value }: { label: string; value: string | undefined }) {
  return (
    <div className="flex flex-col items-center sm:items-end gap-0.5 min-w-[48px]">
      <span className="text-xl font-black tabular-nums text-hoop-orange leading-none">
        {value ?? '—'}
      </span>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
    </div>
  )
}
