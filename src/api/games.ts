import { apiFetch } from './client';
import type { Game, GameDetail } from '../types';

export function fetchGames(league: string): Promise<Game[]> {
  return apiFetch<Game[]>(`/games?league=${encodeURIComponent(league)}`);
}

export function fetchGame(id: string | number, league: string): Promise<GameDetail> {
  return apiFetch<GameDetail>(`/games/${id}?league=${encodeURIComponent(league)}`);
}
