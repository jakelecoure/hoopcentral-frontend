import { apiFetch } from './client';
import type { Team, TeamDetail } from '../types';

export function fetchTeams(league: string): Promise<Team[]> {
  return apiFetch<Team[]>(`/teams?league=${encodeURIComponent(league)}`);
}

export function fetchTeam(id: string | number, league: string): Promise<TeamDetail> {
  return apiFetch<TeamDetail>(`/teams/${id}?league=${encodeURIComponent(league)}`);
}
