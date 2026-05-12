'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { useLeague } from '@/lib/hooks/useLeague'
import { useFetch } from '@/lib/hooks/useFetch'
import { fetchPlayers } from '@/lib/api/players'
import { fetchTeams } from '@/lib/api/teams'
import { fuzzyMatch } from '@/lib/api/search'
import { Input } from '@/components/ui/input'
import { GameCard } from '@/components/game/GameCard'
import { EmptyState } from '@/components/common/EmptyState'
import Link from 'next/link'
import { User, Users, Zap } from 'lucide-react'
import type { Player, Team, SearchResult } from '@/types'
import { Suspense } from 'react'

function SearchContent() {
  const searchParams = useSearchParams()
  const { league } = useLeague()
  const [query, setQuery] = useState(searchParams?.get('q') ?? '')
  const [results, setResults] = useState<SearchResult[]>([])

  const { data: players } = useFetch<Player[]>(() => fetchPlayers(league), [league])
  const { data: teams }   = useFetch<Team[]>(() => fetchTeams(league), [league])

  useEffect(() => {
    if (players && teams && query.trim().length >= 2) {
      setResults(fuzzyMatch(query, players, teams))
    } else {
      setResults([])
    }
  }, [query, players, teams])

  const byType = {
    player: results.filter((r) => r.type === 'player'),
    team:   results.filter((r) => r.type === 'team'),
    game:   results.filter((r) => r.type === 'game'),
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 lg:px-6">
      <h1 className="text-2xl font-black mb-6">Search</h1>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search players, teams..."
          className="pl-10 h-12 text-base"
        />
      </div>

      {query.length < 2 ? (
        <EmptyState icon={Search} title="Start typing to search" description="Search across all players, teams, and games." />
      ) : results.length === 0 ? (
        <EmptyState icon={Search} title={`No results for "${query}"`} />
      ) : (
        <div className="space-y-8">
          {byType.player.length > 0 && (
            <ResultSection title="Players" icon={User} results={byType.player} />
          )}
          {byType.team.length > 0 && (
            <ResultSection title="Teams" icon={Users} results={byType.team} />
          )}
        </div>
      )}
    </div>
  )
}

function ResultSection({
  title,
  icon: Icon,
  results,
}: {
  title: string
  icon: React.ComponentType<{ className?: string }>
  results: SearchResult[]
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-4 w-4 text-hoop-orange" />
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{title}</h2>
      </div>
      <div className="rounded-xl border border-hoop-dark-border bg-hoop-dark-card divide-y divide-hoop-dark-border/50">
        {results.map((r) => (
          <Link
            key={`${r.type}-${r.id}`}
            href={r.href}
            className="flex items-center gap-3 px-4 py-3 hover:bg-hoop-dark-hover transition-colors"
          >
            <div>
              <p className="text-sm font-medium text-foreground">{r.label}</p>
              {r.sublabel && <p className="text-xs text-muted-foreground">{r.sublabel}</p>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  )
}
