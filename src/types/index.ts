export type League = 'nba' | 'wnba';

export interface LeagueOption {
  id: League;
  label: string;
}

export const LEAGUE_OPTIONS: LeagueOption[] = [
  { id: 'nba', label: 'NBA' },
  { id: 'wnba', label: 'WNBA' },
];

// ── List-level types (returned by collection endpoints) ──────────────────────

export interface Player {
  id: string | number;
  name: string;
  team: string;
  team_id: string | number;
  position?: string;
  jersey_number?: string | number;
  height?: string;
  weight?: string;
  birthdate?: string;
  nationality?: string;
  draft_year?: number;
  draft_pick?: string;
  [key: string]: unknown;
}

export interface Game {
  id: string | number;
  home_team: string;
  away_team: string;
  home_team_id?: string | number;
  away_team_id?: string | number;
  home_score?: number;
  away_score?: number;
  date: string;
  status: 'scheduled' | 'live' | 'final';
  arena?: string;
  [key: string]: unknown;
}

export interface Team {
  id: string | number;
  name: string;
  abbreviation?: string;
  city?: string;
  conference?: string;
  division?: string;
  [key: string]: unknown;
}

export interface Standing {
  rank: number;
  team: string;
  team_id: string | number;
  wins: number;
  losses: number;
  win_pct: number;
  games_behind?: number | string;
  conference?: string;
  division?: string;
  home_record?: string;
  away_record?: string;
  streak?: string;
  last_ten?: string;
  [key: string]: unknown;
}

// ── Detail-level types (returned by /:id endpoints) ─────────────────────────

export interface PlayerStats {
  gp: number;
  min: string;
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  to: number;
  fg_pct?: number;
  fg3_pct?: number;
  ft_pct?: number;
}

export interface GameLogEntry {
  game_id: string | number;
  date: string;
  opponent: string;
  home_away: 'home' | 'away';
  result: 'W' | 'L';
  score: string;
  min: string;
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  to: number;
  fg?: string;
  fg3?: string;
  ft?: string;
  plus_minus?: number;
}

export interface PlayerDetail extends Player {
  stats: PlayerStats;
  game_log?: GameLogEntry[];
}

export interface GamePlayerStats {
  player_id: string | number;
  player_name: string;
  starter?: boolean;
  min: string;
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  to: number;
  fg?: string;
  fg3?: string;
  ft?: string;
  plus_minus?: number;
}

export interface GameDetail extends Game {
  home_players: GamePlayerStats[];
  away_players: GamePlayerStats[];
  quarter_scores?: {
    home: number[];
    away: number[];
  };
}

export interface TeamDetail extends Team {
  wins: number;
  losses: number;
  win_pct?: number;
  roster: Player[];
  recent_games?: Game[];
  stats?: {
    ppg?: number;
    opp_ppg?: number;
    pace?: number;
    [key: string]: number | undefined;
  };
}
