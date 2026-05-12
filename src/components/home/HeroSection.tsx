'use client'

import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface HeroSectionProps {
  league: string
  liveCount: number
}

export function HeroSection({ league, liveCount }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-hoop-dark-border bg-hoop-dark-card">
      <div className="absolute inset-0 bg-gradient-to-br from-hoop-orange/8 via-transparent to-transparent" />
      <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-hoop-orange/5 blur-3xl" />

      <div className="relative p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-hoop-orange">
                <Activity className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-hoop-orange">
                {league.toUpperCase()} Central
              </span>
            </div>
            <h1 className="text-3xl font-black text-foreground sm:text-4xl">
              Basketball,{' '}
              <span className="text-hoop-orange">Live.</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              Real-time scores, advanced analytics, and deep stats for every game, team, and player.
            </p>
          </div>

          {liveCount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="shrink-0 flex flex-col items-center gap-1 rounded-xl border border-hoop-live/30 bg-hoop-live/10 px-4 py-3"
            >
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-hoop-live animate-live-pulse" />
                <span className="text-2xl font-black tabular-nums text-hoop-live">{liveCount}</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-hoop-live/70">
                Live Now
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
