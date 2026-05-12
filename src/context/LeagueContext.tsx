'use client'

import { createContext, useState, useCallback, type ReactNode } from 'react'
import type { League } from '@/types'
import { DEFAULT_LEAGUE } from '@/lib/utils/constants'

interface LeagueContextValue {
  league: League
  setLeague: (l: League) => void
}

export const LeagueContext = createContext<LeagueContextValue | null>(null)

export function LeagueProvider({ children }: { children: ReactNode }) {
  const [league, setLeagueState] = useState<League>(DEFAULT_LEAGUE as League)

  const setLeague = useCallback((l: League) => {
    setLeagueState(l)
  }, [])

  return (
    <LeagueContext.Provider value={{ league, setLeague }}>
      {children}
    </LeagueContext.Provider>
  )
}
