import { Link, useParams } from 'react-router-dom';
import { StatCard } from '../../components/StatCard/StatCard';
import { DataTable } from '../../components/DataTable/DataTable';
import { StatusView } from '../../components/StatusView/StatusView';
import { fetchPlayer } from '../../api/players';
import { useLeagueCtx } from '../../context/LeagueContext';
import { useFetch } from '../../hooks/useFetch';
import type { GameLogEntry } from '../../types';
import type { Column } from '../../components/DataTable/DataTable';
import styles from './PlayerDetail.module.css';

const GAME_LOG_COLS: Column<GameLogEntry>[] = [
  { key: 'date', header: 'Date' },
  {
    key: 'opponent',
    header: 'OPP',
    render: (g) => (
      <span className={styles.opponent}>
        {g.home_away === 'home' ? 'vs' : '@'} {g.opponent}
      </span>
    ),
  },
  {
    key: 'result',
    header: 'W/L',
    align: 'center',
    render: (g) => (
      <span style={{ color: g.result === 'W' ? 'var(--win)' : 'var(--loss)', fontWeight: 700 }}>
        {g.result}
      </span>
    ),
  },
  { key: 'score', header: 'Score', align: 'center' },
  { key: 'min', header: 'MIN', align: 'center' },
  { key: 'pts', header: 'PTS', align: 'center', sortable: true, sortValue: (g) => g.pts },
  { key: 'reb', header: 'REB', align: 'center', sortable: true, sortValue: (g) => g.reb },
  { key: 'ast', header: 'AST', align: 'center', sortable: true, sortValue: (g) => g.ast },
  { key: 'stl', header: 'STL', align: 'center', sortable: true, sortValue: (g) => g.stl },
  { key: 'blk', header: 'BLK', align: 'center', sortable: true, sortValue: (g) => g.blk },
  { key: 'to',  header: 'TO',  align: 'center', sortable: true, sortValue: (g) => g.to  },
  { key: 'fg',  header: 'FG',  align: 'center' },
  { key: 'fg3', header: '3P',  align: 'center' },
  { key: 'ft',  header: 'FT',  align: 'center' },
  {
    key: 'plus_minus',
    header: '+/-',
    align: 'center',
    render: (g) => {
      if (g.plus_minus === undefined) return '—';
      const v = g.plus_minus;
      return <span style={{ color: v > 0 ? 'var(--win)' : v < 0 ? 'var(--loss)' : 'var(--text-2)' }}>{v > 0 ? `+${v}` : v}</span>;
    },
  },
];

function fmt(n: number | undefined, decimals = 1) {
  return n !== undefined ? n.toFixed(decimals) : '—';
}

function fmtPct(n: number | undefined) {
  return n !== undefined ? (n * 100).toFixed(1) + '%' : '—';
}

export function PlayerDetail() {
  const { id } = useParams<{ id: string }>();
  const { league } = useLeagueCtx();
  const { data: player, loading, error } = useFetch(
    () => fetchPlayer(id!, league),
    [id, league],
  );

  if (loading || error) return <StatusView loading={loading} error={error} />;
  if (!player) return null;

  const s = player.stats;

  return (
    <div className={styles.root}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.identity}>
            {player.jersey_number !== undefined && (
              <span className={styles.jerseyNum}>#{player.jersey_number}</span>
            )}
            <div>
              <h1 className={styles.name}>{player.name}</h1>
              <div className={styles.meta}>
                {player.team_id ? (
                  <Link to={`/teams/${player.team_id}`} className={styles.teamLink}>
                    {player.team}
                  </Link>
                ) : (
                  <span>{player.team}</span>
                )}
                {player.position && <><span className={styles.dot}>·</span><span>{player.position}</span></>}
              </div>
            </div>
          </div>

          {/* Bio strip */}
          <div className={styles.bio}>
            {player.height     && <BioItem label="HT"   value={player.height} />}
            {player.weight     && <BioItem label="WT"   value={player.weight} />}
            {player.birthdate  && <BioItem label="DOB"  value={player.birthdate} />}
            {player.nationality && <BioItem label="NAT" value={player.nationality} />}
            {player.draft_year && (
              <BioItem
                label="DRAFT"
                value={player.draft_pick ? `${player.draft_year} · ${player.draft_pick}` : String(player.draft_year)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className={styles.body}>
        {/* Season average cards */}
        {s && (
          <section className={styles.section}>
            <h2 className="section-title">Season Averages · {s.gp} GP</h2>
            <div className={styles.statCards}>
              <StatCard label="PTS" value={fmt(s.pts)} accent />
              <StatCard label="REB" value={fmt(s.reb)} />
              <StatCard label="AST" value={fmt(s.ast)} />
              <StatCard label="STL" value={fmt(s.stl)} />
              <StatCard label="BLK" value={fmt(s.blk)} />
              <StatCard label="TO"  value={fmt(s.to)} />
              <StatCard label="MIN" value={s.min ?? '—'} />
              {s.fg_pct  !== undefined && <StatCard label="FG%"  value={fmtPct(s.fg_pct)} />}
              {s.fg3_pct !== undefined && <StatCard label="3P%"  value={fmtPct(s.fg3_pct)} />}
              {s.ft_pct  !== undefined && <StatCard label="FT%"  value={fmtPct(s.ft_pct)} />}
            </div>
          </section>
        )}

        {/* Game log */}
        {player.game_log && player.game_log.length > 0 && (
          <section className={styles.section}>
            <h2 className="section-title">Game Log</h2>
            <DataTable
              columns={GAME_LOG_COLS}
              rows={player.game_log}
              getKey={(g) => g.game_id}
              defaultSort={{ key: 'pts', dir: 'desc' }}
            />
          </section>
        )}
      </div>
    </div>
  );
}

function BioItem({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.bioItem}>
      <span className={styles.bioLabel}>{label}</span>
      <span className={styles.bioValue}>{value}</span>
    </div>
  );
}
