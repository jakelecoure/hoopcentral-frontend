'use client'

import { type ReactNode } from 'react'
import { LeagueProvider } from '@/context/LeagueContext'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LeagueProvider>
      {children}
    </LeagueProvider>
  )
}
