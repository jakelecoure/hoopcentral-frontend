'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { SearchResult } from '@/types'
import { fuzzyMatch } from '@/lib/api/search'
import type { Player, Team } from '@/types'

interface UseSearchOptions {
  players: Player[]
  teams: Team[]
  debounceMs?: number
}

export function useSearch({ players, teams, debounceMs = 200 }: UseSearchOptions) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const search = useCallback(
    (q: string) => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        setResults(fuzzyMatch(q, players, teams))
      }, debounceMs)
    },
    [players, teams, debounceMs],
  )

  useEffect(() => {
    search(query)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [query, search])

  return { query, setQuery, results }
}
