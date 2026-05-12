'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLeague } from '@/lib/hooks/useLeague'
import { useFetch } from '@/lib/hooks/useFetch'
import { fetchGames } from '@/lib/api/games'
import { GameCard } from '@/components/game/GameCard'
import { SkeletonGameCard } from '@/components/common/SkeletonCard'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/button'
import { fmtDate } from '@/lib/utils/formatters'
import type { Game } from '@/types'

function groupByDate(games: Game[]): Record<string, Game[]> {
  return games.reduce<Record<string, Game[]>>((acc, g) => {
    const d = g.date?.split('T')[0] ?? 'Unknown'
    return { ...acc, [d]: [...(acc[d] ?? []), g] }
  }, {})
}

export default function SchedulePage() {
  const { league } = useLeague()
  const [weekOffset, setWeekOffset] = useState(0)

  const { data, loading, error, refetch } = useFetch<Game[]>(
    () => fetchGames(league),
    [league],
  )

  const grouped = useMemo(() => {
    if (!data) return {}
    const sorted = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    return groupByDate(sorted)
  }, [data])

  const dates = Object.keys(grouped).sort()

  // Show 7 days at a time
  const start = weekOffset * 7
  const visibleDates = dates.slice(start, start + 7)

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-6 lg:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Schedule</h1>
          <p className="text-sm text-muted-foreground mt-1">{league.toUpperCase()} Season</p>
        </div>
        {/* Week navigation */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setWeekOffset((w) => Math.max(0, w - 1))}
            disabled={weekOffset === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Week {weekOffset + 1}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setWeekOffset((w) => w + 1)}
            disabled={start + 7 >= dates.length}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <div className="mb-3 h-5 w-32 rounded-md bg-hoop-dark-border animate-pulse" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, j) => <SkeletonGameCard key={j} />)}
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : dates.length === 0 ? (
        <EmptyState icon={Calendar} title="No games scheduled" />
      ) : (
        <div className="space-y-8">
          {visibleDates.map((date) => (
            <motion.section
              key={date}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-4 flex items-center gap-3">
                <h2 className="text-sm font-semibold text-foreground">{fmtDate(date)}</h2>
                <div className="h-px flex-1 bg-hoop-dark-border" />
                <span className="text-xs text-muted-foreground">{grouped[date].length} games</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {grouped[date].map((g, i) => <GameCard key={g.id} game={g} index={i} />)}
              </div>
            </motion.section>
          ))}
        </div>
      )}
    </div>
  )
}
