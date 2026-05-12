import { Link, useParams } from 'react-router-dom';
import { DataTable } from '../../components/DataTable/DataTable';
import { StatusView } from '../../components/StatusView/StatusView';
import { fetchGame } from '../../api/games';
import { useLeagueCtx } from '../../context/LeagueContext';
import { useFetch } from '../../hooks/useFetch';
import type { GamePlayerStats } from '../../types';
import type { Column } from '../../components/DataTable/DataTable';
import styles from './GameDetail.module.css';

const BOX_COLS: Column<GamePlayerStats>[] = [
  { key: 'player_name', header: 'Player', render: (p) => (
    <Link to={`/players/${p.player_id}`} className={styles.playerLink}>
      {p.player_name}
    </Link>
  )},
  { key: 'min', header: 'MIN', align: 'center' },
  { key: 'pts', header: 'PTS', align: 'center', sortable: true, sortValue: (p) => p.pts },
  { key: 'reb', header: 'REB', align: 'center', sortable: true, sortValue: (p) => p.reb },
  { key: 'ast', header: 'AST', align: 'center', sortable: true, sortValue: (p) => p.ast },
  { key: 'stl', header: 'STL', align: 'center', sortable: true, sortValue: (p) => p.stl },
  { key: 'blk', header: 'BLK', align: 'center', sortable: true, sortValue: (p) => p.blk },
  { key: 'to',  header: 'TO',  align: 'center', sortable: true, sortValue: (p) => p.to  },
  { key: 'fg',  header: 'FG',  align: 'center' },
  { key: 'fg3', header: '3P',  align: 'center' },
  { key: 'ft',  header: 'FT',  align: 'center' },
  {
    key: 'plus_minus',
    header: '+/-',
    align: 'center',
    sortable: true,
    render: (p) => {
      if (p.plus_minus === undefined) return '—';
      const v = p.plus_minus;
      return <span style={{ color: v > 0 ? 'var(--win)' : v < 0 ? 'var(--loss)' : 'var(--text-2)' }}>{v > 0 ? `+${v}` : v}</span>;
    },
  },
];

function sumStat(players: GamePlayerStats[], key: keyof GamePlayerStats): number {
  return players.reduce((acc, p) => acc + (typeof p[key] === 'number' ? (p[key] as number) : 0), 0);
}

function BoxScore({ team, players }: { team: string; players: GamePlayerStats[] }) {
  return (
    <section className={styles.boxSection}>
      <h2 className={styles.boxTeam}>{team}</h2>
      <DataTable
        columns={BOX_COLS}
        rows={players}
        getKey={(p) => p.player_id}
        defaultSort={{ key: 'pts', dir: 'desc' }}
        footerRow={BOX_COLS.map((col) => (
          <td key={col.key} className={styles.totalTd} style={{ textAlign: col.align ?? 'left' }}>
            {col.key === 'player_name' ? 'Totals' :
             col.key === 'min' ? '—' :
             col.key === 'plus_minus' || col.key === 'fg' || col.key === 'fg3' || col.key === 'ft' ? '—' :
             String(sumStat(players, col.key as keyof GamePlayerStats))}
          </td>
        ))}
      />
    </section>
  );
}

export function GameDetail() {
  const { id } = useParams<{ id: string }>();
  const { league } = useLeagueCtx();
  const { data: game, loading, error } = useFetch(
    () => fetchGame(id!, league),
    [id, league],
  );

  if (loading || error) return <StatusView loading={loading} error={error} />;
  if (!game) return null;

  const hasScore = game.home_score !== undefined && game.away_score !== undefined;
  const quarters = game.quarter_scores;

  return (
    <div className={styles.root}>
      {/* Matchup header */}
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.matchup}>
            <div className={styles.teamBlock}>
              {game.away_team_id ? (
                <Link to={`/teams/${game.away_team_id}`} className={styles.teamName}>
                  {game.away_team}
                </Link>
              ) : (
                <span className={styles.teamName}>{game.away_team}</span>
              )}
              <span className={styles.homeAwayLabel}>Away</span>
            </div>

            <div className={styles.scoreBlock}>
              {hasScore ? (
                <>
                  <span className={`${styles.scoreNum} ${(game.away_score ?? 0) > (game.home_score ?? 0) ? styles.winner : ''}`}>
                    {game.away_score}
                  </span>
                  <span className={styles.scoreDash}>–</span>
                  <span className={`${styles.scoreNum} ${(game.home_score ?? 0) > (game.away_score ?? 0) ? styles.winner : ''}`}>
                    {game.home_score}
                  </span>
                </>
              ) : (
                <span className={styles.vsLabel}>vs</span>
              )}
              <div className={`${styles.statusBadge} ${styles[game.status]}`}>
                {game.status === 'live' ? 'LIVE' : game.status === 'final' ? 'Final' : game.date}
              </div>
            </div>

            <div className={`${styles.teamBlock} ${styles.teamBlockRight}`}>
              {game.home_team_id ? (
                <Link to={`/teams/${game.home_team_id}`} className={styles.teamName}>
                  {game.home_team}
                </Link>
              ) : (
                <span className={styles.teamName}>{game.home_team}</span>
              )}
              <span className={styles.homeAwayLabel}>Home</span>
            </div>
          </div>

          {/* Quarter breakdown */}
          {quarters && (
            <div className={styles.quarters}>
              <div className={styles.qRow + ' ' + styles.qHeader}>
                <span>Team</span>
                {quarters.home.map((_, i) => (
                  <span key={i}>Q{i + 1}</span>
                ))}
                <span>T</span>
              </div>
              <div className={styles.qRow}>
                <span>{game.away_team}</span>
                {quarters.away.map((s, i) => <span key={i}>{s}</span>)}
                <span className={styles.qTotal}>{game.away_score}</span>
              </div>
              <div className={styles.qRow}>
                <span>{game.home_team}</span>
                {quarters.home.map((s, i) => <span key={i}>{s}</span>)}
                <span className={styles.qTotal}>{game.home_score}</span>
              </div>
            </div>
          )}

          {game.arena && <p className={styles.arena}>{game.arena}</p>}
        </div>
      </div>

      {/* Box scores */}
      <div className={styles.body}>
        {game.away_players?.length > 0 && (
          <BoxScore team={game.away_team} players={game.away_players} />
        )}
        {game.home_players?.length > 0 && (
          <BoxScore team={game.home_team} players={game.home_players} />
        )}
        {(!game.away_players?.length && !game.home_players?.length) && (
          <p className={styles.noBox}>Box score not available.</p>
        )}
      </div>
    </div>
  );
}
