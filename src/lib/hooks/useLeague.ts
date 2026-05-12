'use client'

import { useContext } from 'react'
import { LeagueContext } from '@/context/LeagueContext'

export function useLeague() {
  const ctx = useContext(LeagueContext)
  if (!ctx) throw new Error('useLeague must be used inside <LeagueProvider>')
  return ctx
}
