import { Link, useParams } from 'react-router-dom';
import { StatCard } from '../../components/StatCard/StatCard';
import { GameCard } from '../../components/GameCard/GameCard';
import { StatusView } from '../../components/StatusView/StatusView';
import { fetchTeam } from '../../api/teams';
import { useLeagueCtx } from '../../context/LeagueContext';
import { useFetch } from '../../hooks/useFetch';
import styles from './TeamDetail.module.css';

export function TeamDetail() {
  const { id } = useParams<{ id: string }>();
  const { league } = useLeagueCtx();
  const { data: team, loading, error } = useFetch(
    () => fetchTeam(id!, league),
    [id, league],
  );

  if (loading || error) return <StatusView loading={loading} error={error} />;
  if (!team) return null;

  const record = `${team.wins}–${team.losses}`;
  const winPct = team.win_pct !== undefined ? (team.win_pct * 100).toFixed(1) + '%' : '—';
  const grouped = groupByPos(team.roster ?? []);

  return (
    <div className={styles.root}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.identity}>
            <div className={styles.abbr}>{team.abbreviation ?? team.name.slice(0, 3).toUpperCase()}</div>
            <div>
              <h1 className={styles.name}>{team.name}</h1>
              <p className={styles.meta}>
                {[team.city, team.conference, team.division].filter(Boolean).join(' · ')}
              </p>
            </div>
          </div>

          <div className={styles.headerStats}>
            <StatCard label="Record" value={record} accent />
            <StatCard label="Win %" value={winPct} />
            {team.stats?.ppg     !== undefined && <StatCard label="PPG"      value={team.stats.ppg.toFixed(1)} />}
            {team.stats?.opp_ppg !== undefined && <StatCard label="OPP PPG"  value={team.stats.opp_ppg.toFixed(1)} />}
            {team.stats?.pace    !== undefined && <StatCard label="Pace"     value={team.stats.pace.toFixed(1)} />}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className={styles.body}>
        <div className={styles.bodyGrid}>
          {/* Roster */}
          <section className={styles.rosterSection}>
            <h2 className="section-title">Roster</h2>
            <div className={styles.rosterCard}>
              {grouped.map(([pos, players]) => (
                <div key={pos} className={styles.posGroup}>
                  <div className={styles.posLabel}>{pos}</div>
                  {players.map((p) => (
                    <Link key={p.id} to={`/players/${p.id}`} className={styles.playerRow}>
                      <span className={styles.playerNum}>
                        {p.jersey_number !== undefined ? `#${p.jersey_number}` : '—'}
                      </span>
                      <span className={styles.playerName}>{p.name}</span>
                      {p.height && <span className={styles.playerHt}>{p.height}</span>}
                    </Link>
                  ))}
                </div>
              ))}
              {(!team.roster || team.roster.length === 0) && (
                <p className={styles.empty}>Roster not available.</p>
              )}
            </div>
          </section>

          {/* Recent games */}
          {team.recent_games && team.recent_games.length > 0 && (
            <section className={styles.gamesSection}>
              <h2 className="section-title">Recent Games</h2>
              <div className={styles.gameList}>
                {team.recent_games.slice(0, 8).map((g) => (
                  <GameCard key={g.id} game={g} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function groupByPos(roster: ReturnType<typeof Object.assign>[]): [string, typeof roster[0][]][] {
  const ORDER = ['G', 'F', 'C', 'G/F', 'F/C', 'F/G', 'PG', 'SG', 'SF', 'PF'];
  const map = new Map<string, typeof roster>();
  roster.forEach((p) => {
    const pos = String(p.position ?? 'Other');
    const ex = map.get(pos);
    if (ex) ex.push(p);
    else map.set(pos, [p]);
  });
  return Array.from(map.entries()).sort(([a], [b]) => {
    const ia = ORDER.indexOf(a);
    const ib = ORDER.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
}
