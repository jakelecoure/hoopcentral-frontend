export type League = 'nba' | 'wnba'

export interface LeagueOption {
  id: League
  label: string
  color: string
}

export const LEAGUE_OPTIONS: LeagueOption[] = [
  { id: 'nba', label: 'NBA', color: '#f97316' },
  { id: 'wnba', label: 'WNBA', color: '#ec4899' },
]

// ── List-level types ──────────────────────────────────────────────────────────

export interface Player {
  id: string | number
  name: string
  team: string
  team_id: string | number
  position?: string
  jersey_number?: string | number
  height?: string
  weight?: string
  birthdate?: string
  nationality?: string
  draft_year?: number
  draft_pick?: string
  college?: string
  experience?: number
  photo_url?: string
  [key: string]: unknown
}

export interface Game {
  id: string | number
  home_team: string
  away_team: string
  home_team_id?: string | number
  away_team_id?: string | number
  home_score?: number
  away_score?: number
  date: string
  status: 'scheduled' | 'live' | 'final'
  arena?: string
  period?: number
  clock?: string
  broadcast?: string
  [key: string]: unknown
}

export interface Team {
  id: string | number
  name: string
  abbreviation?: string
  city?: string
  conference?: string
  division?: string
  logo_url?: string
  primary_color?: string
  secondary_color?: string
  arena?: string
  head_coach?: string
  [key: string]: unknown
}

export interface Standing {
  rank: number
  team: string
  team_id: string | number
  wins: number
  losses: number
  win_pct: number
  games_behind?: number | string
  conference?: string
  division?: string
  home_record?: string
  away_record?: string
  streak?: string
  last_ten?: string
  points_pg?: number
  opp_points_pg?: number
  [key: string]: unknown
}

// ── Detail-level types ────────────────────────────────────────────────────────

export interface PlayerStats {
  gp: number
  min: string
  pts: number
  reb: number
  ast: number
  stl: number
  blk: number
  to: number
  fg_pct?: number
  fg3_pct?: number
  ft_pct?: number
  fg_made?: number
  fg_att?: number
  fg3_made?: number
  fg3_att?: number
  ft_made?: number
  ft_att?: number
  oreb?: number
  dreb?: number
  pf?: number
  plus_minus?: number
  ts_pct?: number
  efg_pct?: number
  per?: number
  usg_pct?: number
  bpm?: number
  vorp?: number
}

export interface SeasonStats extends PlayerStats {
  season: string
  team: string
  age?: number
}

export interface GameLogEntry {
  game_id: string | number
  date: string
  opponent: string
  home_away: 'home' | 'away'
  result: 'W' | 'L'
  score: string
  min: string
  pts: number
  reb: number
  ast: number
  stl: number
  blk: number
  to: number
  fg?: string
  fg3?: string
  ft?: string
  plus_minus?: number
}

export interface PlayerDetail extends Player {
  stats: PlayerStats
  season_stats?: SeasonStats[]
  game_log?: GameLogEntry[]
  awards?: string[]
  contract?: {
    years: number
    value: string
    aav: string
    expires: string
  }
}

export interface GamePlayerStats {
  player_id: string | number
  player_name: string
  starter?: boolean
  min: string
  pts: number
  reb: number
  ast: number
  stl: number
  blk: number
  to: number
  fg?: string
  fg3?: string
  ft?: string
  plus_minus?: number
  oreb?: number
  dreb?: number
  pf?: number
}

export interface PlayByPlayEntry {
  period: number
  clock: string
  team?: string
  player?: string
  description: string
  score?: string
  type: 'score' | 'foul' | 'turnover' | 'timeout' | 'substitution' | 'other'
}

export interface GameDetail extends Game {
  home_players: GamePlayerStats[]
  away_players: GamePlayerStats[]
  quarter_scores?: {
    home: number[]
    away: number[]
  }
  play_by_play?: PlayByPlayEntry[]
  home_team_stats?: Record<string, number | string>
  away_team_stats?: Record<string, number | string>
}

export interface TeamDetail extends Team {
  wins: number
  losses: number
  win_pct?: number
  conference_rank?: number
  division_rank?: number
  roster: Player[]
  recent_games?: Game[]
  stats?: {
    ppg?: number
    opp_ppg?: number
    pace?: number
    off_rtg?: number
    def_rtg?: number
    net_rtg?: number
    [key: string]: number | undefined
  }
}

// ── Search ────────────────────────────────────────────────────────────────────

export interface SearchResult {
  type: 'player' | 'team' | 'game'
  id: string | number
  label: string
  sublabel?: string
  href: string
}

// ── WebSocket messages ────────────────────────────────────────────────────────

export type WsMessage =
  | { type: 'game_update'; data: Partial<Game> & { id: string | number } }
  | { type: 'score_update'; data: { game_id: string | number; home_score: number; away_score: number; period?: number; clock?: string } }
  | { type: 'standings_update'; data: Standing[] }
  | { type: 'ping'; data: null }
