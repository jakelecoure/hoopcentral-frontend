import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { LEAGUE_OPTIONS } from '../types';
import type { League } from '../types';

interface LeagueCtx {
  league: League;
  leagues: typeof LEAGUE_OPTIONS;
  switchLeague: (l: League) => void;
}

const Ctx = createContext<LeagueCtx | null>(null);

export function LeagueProvider({ children }: { children: ReactNode }) {
  const [league, setLeague] = useState<League>('nba');
  const switchLeague = useCallback((l: League) => setLeague(l), []);
  return (
    <Ctx.Provider value={{ league, leagues: LEAGUE_OPTIONS, switchLeague }}>
      {children}
    </Ctx.Provider>
  );
}

export function useLeagueCtx(): LeagueCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useLeagueCtx must be inside LeagueProvider');
  return ctx;
}
