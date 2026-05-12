import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../../components/PageLayout/PageLayout';
import { StatusView } from '../../components/StatusView/StatusView';
import { fetchTeams } from '../../api/teams';
import { fetchStandings } from '../../api/standings';
import { useLeagueCtx } from '../../context/LeagueContext';
import { useFetch } from '../../hooks/useFetch';
import type { Team, Standing } from '../../types';
import styles from './Teams.module.css';

export function Teams() {
  const { league } = useLeagueCtx();
  const [search, setSearch] = useState('');
  const { data: teams, loading, error } = useFetch<Team[]>(() => fetchTeams(league), [league]);
  const standings = useFetch<Standing[]>(() => fetchStandings(league), [league]);

  const recordMap = useMemo(() => {
    const map = new Map<string | number, Standing>();
    (standings.data ?? []).forEach((s) => map.set(s.team_id, s));
    return map;
  }, [standings.data]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (teams ?? []).filter((t) => !q || t.name.toLowerCase().includes(q) || (t.city ?? '').toLowerCase().includes(q));
  }, [teams, search]);

  const grouped = useMemo(() => {
    if (!filtered.some((t) => t.conference)) return [['All Teams', filtered] as [string, Team[]]];
    const map = new Map<string, Team[]>();
    filtered.forEach((t) => {
      const key = String(t.conference ?? 'Other');
      const ex = map.get(key);
      if (ex) ex.push(t);
      else map.set(key, [t]);
    });
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <PageLayout
      title="Teams"
      subtitle={teams ? `${filtered.length} teams` : undefined}
      action={
        <input
          type="search"
          className={styles.search}
          placeholder="Search teams…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      }
    >
      {loading || error ? (
        <StatusView loading={loading} error={error} />
      ) : (
        <div className={styles.root}>
          {grouped.map(([conf, confTeams]) => (
            <div key={conf}>
              {grouped.length > 1 && <h2 className={styles.confLabel}>{conf}</h2>}
              <div className={styles.grid}>
                {confTeams.map((team) => {
                  const rec = recordMap.get(team.id);
                  return (
                    <Link key={team.id} to={`/teams/${team.id}`} className={styles.card}>
                      <div className={styles.cardTop}>
                        <span className={styles.abbr}>{team.abbreviation ?? team.name.slice(0, 3).toUpperCase()}</span>
                        {rec && (
                          <span className={styles.record}>{rec.wins}–{rec.losses}</span>
                        )}
                      </div>
                      <p className={styles.teamName}>{team.name}</p>
                      {team.city && <p className={styles.city}>{team.city}</p>}
                      {team.division && <p className={styles.division}>{team.division}</p>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
