export const TEAM_COLORS: Record<string, string> = {
  'Atlanta Hawks':          '#e03a3e',
  'Boston Celtics':         '#007a33',
  'Brooklyn Nets':          '#000000',
  'Charlotte Hornets':      '#00788c',
  'Chicago Bulls':          '#ce1141',
  'Cleveland Cavaliers':    '#860038',
  'Dallas Mavericks':       '#00538c',
  'Denver Nuggets':         '#0e2240',
  'Detroit Pistons':        '#c8102e',
  'Golden State Warriors':  '#1d428a',
  'Houston Rockets':        '#ce1141',
  'Indiana Pacers':         '#002d62',
  'LA Clippers':            '#c8102e',
  'Los Angeles Lakers':     '#552583',
  'Memphis Grizzlies':      '#5d76a9',
  'Miami Heat':             '#98002e',
  'Milwaukee Bucks':        '#00471b',
  'Minnesota Timberwolves': '#0c2340',
  'New Orleans Pelicans':   '#0c2340',
  'New York Knicks':        '#006bb6',
  'Oklahoma City Thunder':  '#007ac1',
  'Orlando Magic':          '#0077c0',
  'Philadelphia 76ers':     '#006bb6',
  'Phoenix Suns':           '#1d1160',
  'Portland Trail Blazers': '#e03a3e',
  'Sacramento Kings':       '#5a2d81',
  'San Antonio Spurs':      '#c4ced4',
  'Toronto Raptors':        '#ce1141',
  'Utah Jazz':              '#002b5c',
  'Washington Wizards':     '#002b5c',
}

export const TEAM_ABBR: Record<string, string> = {
  'Atlanta Hawks':          'ATL',
  'Boston Celtics':         'BOS',
  'Brooklyn Nets':          'BKN',
  'Charlotte Hornets':      'CHA',
  'Chicago Bulls':          'CHI',
  'Cleveland Cavaliers':    'CLE',
  'Dallas Mavericks':       'DAL',
  'Denver Nuggets':         'DEN',
  'Detroit Pistons':        'DET',
  'Golden State Warriors':  'GSW',
  'Houston Rockets':        'HOU',
  'Indiana Pacers':         'IND',
  'LA Clippers':            'LAC',
  'Los Angeles Lakers':     'LAL',
  'Memphis Grizzlies':      'MEM',
  'Miami Heat':             'MIA',
  'Milwaukee Bucks':        'MIL',
  'Minnesota Timberwolves': 'MIN',
  'New Orleans Pelicans':   'NOP',
  'New York Knicks':        'NYK',
  'Oklahoma City Thunder':  'OKC',
  'Orlando Magic':          'ORL',
  'Philadelphia 76ers':     'PHI',
  'Phoenix Suns':           'PHX',
  'Portland Trail Blazers': 'POR',
  'Sacramento Kings':       'SAC',
  'San Antonio Spurs':      'SAS',
  'Toronto Raptors':        'TOR',
  'Utah Jazz':              'UTA',
  'Washington Wizards':     'WAS',
}

export function getTeamColor(name: string): string {
  return TEAM_COLORS[name] ?? '#f97316'
}

export function getTeamAbbr(name: string): string {
  if (!name) return '???'
  if (TEAM_ABBR[name]) return TEAM_ABBR[name]
  const words = name.split(' ')
  return words.length >= 2
    ? (words[words.length - 2][0] + words[words.length - 1][0]).toUpperCase()
    : name.slice(0, 3).toUpperCase()
}

export const POSITION_FULL: Record<string, string> = {
  PG: 'Point Guard',
  SG: 'Shooting Guard',
  SF: 'Small Forward',
  PF: 'Power Forward',
  C:  'Center',
  G:  'Guard',
  F:  'Forward',
  FC: 'Forward-Center',
  GF: 'Guard-Forward',
}

export const STAT_LABELS: Record<string, string> = {
  pts:      'PTS',
  reb:      'REB',
  ast:      'AST',
  stl:      'STL',
  blk:      'BLK',
  to:       'TO',
  min:      'MIN',
  gp:       'GP',
  fg_pct:   'FG%',
  fg3_pct:  '3P%',
  ft_pct:   'FT%',
  ts_pct:   'TS%',
  efg_pct:  'eFG%',
  per:      'PER',
  usg_pct:  'USG%',
  bpm:      'BPM',
  vorp:     'VORP',
}

export const DEFAULT_LEAGUE = 'nba'
export const API_CACHE_TTL = 60_000
export const WS_RECONNECT_DELAY = 3_000
export const WS_MAX_RETRIES = 5

// NBA official team IDs used by the CDN
export const NBA_TEAM_IDS: Record<string, number> = {
  'Atlanta Hawks':          1610612737,
  'Boston Celtics':         1610612738,
  'Brooklyn Nets':          1610612751,
  'Charlotte Hornets':      1610612766,
  'Chicago Bulls':          1610612741,
  'Cleveland Cavaliers':    1610612739,
  'Dallas Mavericks':       1610612742,
  'Denver Nuggets':         1610612743,
  'Detroit Pistons':        1610612765,
  'Golden State Warriors':  1610612744,
  'Houston Rockets':        1610612745,
  'Indiana Pacers':         1610612754,
  'LA Clippers':            1610612746,
  'Los Angeles Lakers':     1610612747,
  'Memphis Grizzlies':      1610612763,
  'Miami Heat':             1610612748,
  'Milwaukee Bucks':        1610612749,
  'Minnesota Timberwolves': 1610612750,
  'New Orleans Pelicans':   1610612740,
  'New York Knicks':        1610612752,
  'Oklahoma City Thunder':  1610612760,
  'Orlando Magic':          1610612753,
  'Philadelphia 76ers':     1610612755,
  'Phoenix Suns':           1610612756,
  'Portland Trail Blazers': 1610612757,
  'Sacramento Kings':       1610612758,
  'San Antonio Spurs':      1610612759,
  'Toronto Raptors':        1610612761,
  'Utah Jazz':              1610612762,
  'Washington Wizards':     1610612764,
}

export function getNBATeamId(name: string): number | null {
  return NBA_TEAM_IDS[name] ?? null
}

export function getNBAHeadshotUrl(nbaId: string | number): string {
  return `https://cdn.nba.com/headshots/nba/latest/260x190/${nbaId}.png`
}

export function getNBATeamLogoUrl(teamId: string | number): string {
  return `https://cdn.nba.com/logos/nba/${teamId}/global/L/logo.svg`
}
