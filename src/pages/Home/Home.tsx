import { Link } from 'react-router-dom';
import { GameCard } from '../../components/GameCard/GameCard';
import { StatCard } from '../../components/StatCard/StatCard';
import { StatusView } from '../../components/StatusView/StatusView';
import { fetchGames } from '../../api/games';
import { fetchStandings } from '../../api/standings';
import { fetchPlayers } from '../../api/players';
import { useLeagueCtx } from '../../context/LeagueContext';
import { useFetch } from '../../hooks/useFetch';
import type { Game, Standing, Player } from '../../types';
import styles from './Home.module.css';

function SectionHeader({ title, to }: { title: string; to?: string }) {
  return (
    <div className={styles.sectionHead}>
      <h2 className="section-title">{title}</h2>
      {to && (
        <Link to={to} className={styles.viewAll}>
          View all →
        </Link>
      )}
    </div>
  );
}

function StandingsPreview({ rows }: { rows: Standing[] }) {
  return (
    <div className={styles.standingsCard}>
      <div className={styles.standRow + ' ' + styles.standHeader}>
        <span />
        <span>W</span>
        <span>L</span>
        <span>PCT</span>
        <span>GB</span>
      </div>
      {rows.slice(0, 8).map((s) => (
        <Link key={s.team_id} to={`/teams/${s.team_id}`} className={styles.standRow}>
          <span className={styles.standTeam}>
            <span className={styles.standRank}>{s.rank}</span>
            {s.team}
          </span>
          <span>{s.wins}</span>
          <span>{s.losses}</span>
          <span>{s.win_pct.toFixed(3)}</span>
          <span>{s.games_behind === 0 ? '—' : String(s.games_behind ?? '—')}</span>
        </Link>
      ))}
    </div>
  );
}

function StatLeaders({ players }: { players: Player[] }) {
  const withStats = players.filter((p) => typeof (p as Record<string, unknown>).pts === 'number');

  if (withStats.length === 0) {
    return <p className={styles.empty}>Stat leaders unavailable — check player profiles.</p>;
  }

  const top = [...withStats]
    .sort((a, b) => Number((b as Record<string, unknown>).pts) - Number((a as Record<string, unknown>).pts))
    .slice(0, 5);

  return (
    <div className={styles.leaderList}>
      {top.map((p, i) => (
        <Link key={p.id} to={`/players/${p.id}`} className={styles.leaderRow}>
          <span className={styles.leaderRank}>{i + 1}</span>
          <span className={styles.leaderName}>{p.name}</span>
          <span className={styles.leaderTeam}>{p.team}</span>
          <span className={styles.leaderStat}>
            {String((p as Record<string, unknown>).pts ?? '—')} PTS
          </span>
        </Link>
      ))}
    </div>
  );
}

export function Home() {
  const { league } = useLeagueCtx();

  const games = useFetch<Game[]>(() => fetchGames(league), [league]);
  const standings = useFetch<Standing[]>(() => fetchStandings(league), [league]);
  const players = useFetch<Player[]>(() => fetchPlayers(league), [league]);

  const allGames = games.data ?? [];
  const upcoming = allGames.filter((g) => g.status === 'scheduled').slice(0, 6);
  const recent = allGames.filter((g) => g.status === 'final').slice(0, 6);
  const liveGames = allGames.filter((g) => g.status === 'live');

  const totalGames = allGames.length;
  const standingsData = standings.data ?? [];
  const leagueRecord = standingsData.length > 0
    ? `${standingsData.length} teams`
    : '—';

  return (
    <div className={styles.root}>
      {/* Hero bar */}
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <div>
            <h1 className={styles.heroTitle}>
              {league.toUpperCase()} Central
            </h1>
            <p className={styles.heroSub}>
              {league === 'nba' ? 'National Basketball Association' : 'Women\'s National Basketball Association'}
            </p>
          </div>
          <div className={styles.heroStats}>
            <StatCard label="Games" value={totalGames || '—'} sub="this season" />
            <StatCard label="Teams" value={leagueRecord} />
            {liveGames.length > 0 && (
              <StatCard label="Live Now" value={liveGames.length} accent />
            )}
          </div>
        </div>
      </div>

      <div className={styles.body}>
        {/* Live games strip */}
        {liveGames.length > 0 && (
          <section className={styles.section}>
            <SectionHeader title="Live Now" to="/games" />
            <div className={styles.gameGrid}>
              {liveGames.map((g) => <GameCard key={g.id} game={g} />)}
            </div>
          </section>
        )}

        {/* Main 2-col layout */}
        <div className={styles.mainGrid}>
          <div className={styles.left}>
            {/* Upcoming */}
            <section className={styles.section}>
              <SectionHeader title="Upcoming Games" to="/games" />
              {games.loading ? (
                <StatusView loading />
              ) : upcoming.length === 0 ? (
                <p className={styles.empty}>No upcoming games.</p>
              ) : (
                <div className={styles.gameGrid}>
                  {upcoming.map((g) => <GameCard key={g.id} game={g} />)}
                </div>
              )}
            </section>

            {/* Recent results */}
            <section className={styles.section}>
              <SectionHeader title="Recent Results" to="/games" />
              {games.loading ? (
                <StatusView loading />
              ) : recent.length === 0 ? (
                <p className={styles.empty}>No completed games.</p>
              ) : (
                <div className={styles.gameGrid}>
                  {recent.map((g) => <GameCard key={g.id} game={g} />)}
                </div>
              )}
            </section>
          </div>

          <div className={styles.right}>
            {/* Standings */}
            <section className={styles.section}>
              <SectionHeader title="Standings" to="/standings" />
              {standings.loading ? (
                <StatusView loading />
              ) : standingsData.length === 0 ? (
                <p className={styles.empty}>No standings data.</p>
              ) : (
                <StandingsPreview rows={standingsData} />
              )}
            </section>

            {/* Stat leaders */}
            <section className={styles.section}>
              <SectionHeader title="Scoring Leaders" to="/players" />
              {players.loading ? (
                <StatusView loading />
              ) : (
                <StatLeaders players={players.data ?? []} />
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
