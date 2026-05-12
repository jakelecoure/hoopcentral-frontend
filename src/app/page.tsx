'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Zap } from 'lucide-react'
import { useLeague } from '@/lib/hooks/useLeague'
import { useFetch } from '@/lib/hooks/useFetch'
import { fetchGames } from '@/lib/api/games'
import { fetchStandings } from '@/lib/api/standings'
import { fetchPlayers } from '@/lib/api/players'
import { HeroSection } from '@/components/home/HeroSection'
import { StandingsPreview } from '@/components/home/StandingsPreview'
import { TopPerformers } from '@/components/home/TopPerformers'
import { GameCard } from '@/components/game/GameCard'
import { SkeletonGameCard, SkeletonTable } from '@/components/common/SkeletonCard'
import { ErrorState } from '@/components/common/ErrorState'
import { Separator } from '@/components/ui/separator'
import type { Game, Standing, Player } from '@/types'

function SectionHeader({ title, href }: { title: string; href?: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-hoop-orange transition-colors"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </div>
  )
}

export default function HomePage() {
  const { league } = useLeague()

  const games     = useFetch<Game[]>(() => fetchGames(league), [league])
  const standings = useFetch<Standing[]>(() => fetchStandings(league), [league])
  const players   = useFetch<Player[]>(() => fetchPlayers(league), [league])

  const allGames  = games.data ?? []
  const liveGames = allGames.filter((g) => g.status === 'live')
  const upcoming  = allGames.filter((g) => g.status === 'scheduled').slice(0, 6)
  const recent    = allGames.filter((g) => g.status === 'final').slice(0, 6)

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-6 lg:px-6 space-y-8">
      {/* Hero */}
      <HeroSection league={league} liveCount={liveGames.length} />

      {/* Live games banner */}
      {liveGames.length > 0 && (
        <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="h-2 w-2 rounded-full bg-hoop-live animate-live-pulse" />
            <h2 className="text-base font-semibold text-hoop-live">Games In Progress</h2>
            <span className="rounded-full bg-hoop-live/10 px-2 py-0.5 text-xs font-bold text-hoop-live">
              {liveGames.length} LIVE
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {liveGames.map((g, i) => <GameCard key={g.id} game={g} index={i} />)}
          </div>
        </motion.section>
      )}

      {/* Main 2-col layout */}
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* Left column */}
        <div className="space-y-8">
          {/* Upcoming */}
          <section>
            <SectionHeader title="Upcoming Games" href="/games" />
            {games.loading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {[...Array(4)].map((_, i) => <SkeletonGameCard key={i} />)}
              </div>
            ) : games.error ? (
              <ErrorState message={games.error} onRetry={games.refetch} />
            ) : upcoming.length === 0 ? (
              <div className="rounded-xl border border-hoop-dark-border bg-hoop-dark-card p-8 text-center">
                <p className="text-sm text-muted-foreground">No upcoming games scheduled.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {upcoming.map((g, i) => <GameCard key={g.id} game={g} index={i} />)}
              </div>
            )}
          </section>

          <Separator />

          {/* Recent results */}
          <section>
            <SectionHeader title="Recent Results" href="/games" />
            {games.loading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {[...Array(4)].map((_, i) => <SkeletonGameCard key={i} />)}
              </div>
            ) : recent.length === 0 ? (
              <p className="text-sm text-muted-foreground">No completed games.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {recent.map((g, i) => <GameCard key={g.id} game={g} index={i} />)}
              </div>
            )}
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Standings */}
          <section>
            {standings.loading ? (
              <SkeletonTable rows={8} cols={4} />
            ) : standings.error ? (
              <ErrorState message="Failed to load standings" />
            ) : (
              <StandingsPreview standings={standings.data ?? []} />
            )}
          </section>

          {/* Top scorers */}
          <section>
            {players.loading ? (
              <SkeletonTable rows={8} cols={2} />
            ) : (
              <TopPerformers
                players={players.data ?? []}
                statKey="pts"
                statLabel="PTS"
                title="Scoring Leaders"
              />
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
