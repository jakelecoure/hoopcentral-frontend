'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Filter } from 'lucide-react'
import { useLeague } from '@/lib/hooks/useLeague'
import { useFetch } from '@/lib/hooks/useFetch'
import { fetchGames } from '@/lib/api/games'
import { GameCard } from '@/components/game/GameCard'
import { SkeletonGameCard } from '@/components/common/SkeletonCard'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'
import type { Game } from '@/types'
import type { Metadata } from 'next'

const STATUS_FILTERS = ['all', 'live', 'scheduled', 'final'] as const
type StatusFilter = typeof STATUS_FILTERS[number]

export default function GamesPage() {
  const { league } = useLeague()
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const { data, loading, error, refetch } = useFetch<Game[]>(
    () => fetchGames(league),
    [league],
  )

  const games = useMemo(() => {
    if (!data) return []
    if (statusFilter === 'all') return data
    return data.filter((g) => g.status === statusFilter)
  }, [data, statusFilter])

  const counts = useMemo(() => ({
    live:      data?.filter((g) => g.status === 'live').length ?? 0,
    scheduled: data?.filter((g) => g.status === 'scheduled').length ?? 0,
    final:     data?.filter((g) => g.status === 'final').length ?? 0,
  }), [data])

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-6 lg:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-foreground">Games</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {league.toUpperCase()} · All games this season
        </p>
      </div>

      {/* Status filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={cn(
              'rounded-full border px-4 py-1.5 text-xs font-medium transition-colors',
              statusFilter === f
                ? 'border-hoop-orange bg-hoop-orange/10 text-hoop-orange'
                : 'border-hoop-dark-border bg-hoop-dark-card text-muted-foreground hover:border-hoop-dark-border/80 hover:text-foreground',
            )}
          >
            {f === 'all' ? 'All Games' : f.charAt(0).toUpperCase() + f.slice(1)}
            {f !== 'all' && (
              <span className="ml-1.5 tabular-nums">
                ({counts[f as keyof typeof counts] ?? 0})
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(9)].map((_, i) => <SkeletonGameCard key={i} />)}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : games.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No games found"
          description={`No ${statusFilter === 'all' ? '' : statusFilter} games available.`}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {games.map((g, i) => <GameCard key={g.id} game={g} index={i} />)}
        </motion.div>
      )}
    </div>
  )
}
