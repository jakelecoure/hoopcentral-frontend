import { apiFetch } from './client';
import type { Standing } from '../types';

export function fetchStandings(league: string): Promise<Standing[]> {
  return apiFetch<Standing[]>(`/standings?league=${encodeURIComponent(league)}`);
}
