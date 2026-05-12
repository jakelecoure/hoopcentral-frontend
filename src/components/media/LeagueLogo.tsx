'use client'

import { cn } from '@/lib/utils/cn'
import type { League } from '@/types'

interface LeagueLogoProps {
  league: League
  size?: number
  className?: string
  showLabel?: boolean
}

const LEAGUE_CONFIG: Record<League, { label: string; color: string; bg: string }> = {
  nba:  { label: 'NBA',  color: '#f97316', bg: '#f9731620' },
  wnba: { label: 'WNBA', color: '#ec4899', bg: '#ec489920' },
}

export function LeagueLogo({ league, size = 32, className, showLabel = false }: LeagueLogoProps) {
  const cfg = LEAGUE_CONFIG[league]
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className="rounded-lg flex items-center justify-center font-black shrink-0"
        style={{
          width: size,
          height: size,
          backgroundColor: cfg.bg,
          color: cfg.color,
          fontSize: size * 0.3,
        }}
      >
        {cfg.label}
      </div>
      {showLabel && (
        <span className="text-sm font-semibold" style={{ color: cfg.color }}>
          {cfg.label}
        </span>
      )}
    </div>
  )
}
