import { apiFetch } from './client';
import type { Player, PlayerDetail } from '../types';

export function fetchPlayers(league: string): Promise<Player[]> {
  return apiFetch<Player[]>(`/players?league=${encodeURIComponent(league)}`);
}

export function fetchPlayer(id: string | number, league: string): Promise<PlayerDetail> {
  return apiFetch<PlayerDetail>(`/players/${id}?league=${encodeURIComponent(league)}`);
}
