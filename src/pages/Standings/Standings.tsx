import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../../components/PageLayout/PageLayout';
import { DataTable } from '../../components/DataTable/DataTable';
import { StatusView } from '../../components/StatusView/StatusView';
import { fetchStandings } from '../../api/standings';
import { useLeagueCtx } from '../../context/LeagueContext';
import { useFetch } from '../../hooks/useFetch';
import type { Standing } from '../../types';
import type { Column } from '../../components/DataTable/DataTable';
import styles from './Standings.module.css';

const COLUMNS: Column<Standing>[] = [
  {
    key: 'rank',
    header: '#',
    align: 'center',
    width: '3rem',
    render: (s) => <span className={styles.rank}>{s.rank}</span>,
  },
  {
    key: 'team',
    header: 'Team',
    render: (s) => (
      <Link to={`/teams/${s.team_id}`} className={styles.teamLink}>
        {s.team}
      </Link>
    ),
  },
  { key: 'wins',   header: 'W',   align: 'center', sortable: true, sortValue: (s) => s.wins },
  { key: 'losses', header: 'L',   align: 'center', sortable: true, sortValue: (s) => s.losses },
  {
    key: 'win_pct',
    header: 'PCT',
    align: 'center',
    sortable: true,
    sortValue: (s) => s.win_pct,
    render: (s) => s.win_pct.toFixed(3),
  },
  {
    key: 'games_behind',
    header: 'GB',
    align: 'center',
    render: (s) => (s.games_behind === 0 ? '—' : String(s.games_behind ?? '—')),
  },
  { key: 'home_record', header: 'Home', align: 'center' },
  { key: 'away_record', header: 'Away', align: 'center' },
  { key: 'last_ten',    header: 'L10',  align: 'center' },
  {
    key: 'streak',
    header: 'Streak',
    align: 'center',
    render: (s) => {
      if (!s.streak) return '—';
      const isWin = s.streak.startsWith('W');
      return (
        <span style={{ color: isWin ? 'var(--win)' : 'var(--loss)', fontWeight: 600 }}>
          {s.streak}
        </span>
      );
    },
  },
];

export function Standings() {
  const { league } = useLeagueCtx();
  const [groupBy, setGroupBy] = useState<'all' | 'conference' | 'division'>('all');
  const { data, loading, error } = useFetch<Standing[]>(() => fetchStandings(league), [league]);

  const groups = useMemo<[string, Standing[]][]>(() => {
    if (!data) return [];
    if (groupBy === 'all') return [['', data]];
    const key = groupBy;
    const map = new Map<string, Standing[]>();
    for (const s of data) {
      const gk = String(s[key] ?? 'Other');
      const ex = map.get(gk);
      if (ex) ex.push(s);
      else map.set(gk, [s]);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [data, groupBy]);

  return (
    <PageLayout
      title="Standings"
      subtitle={data ? `${data.length} teams` : undefined}
      action={
        <div className={styles.groupTabs}>
          {(['all', 'conference', 'division'] as const).map((g) => (
            <button
              key={g}
              className={`${styles.groupBtn} ${groupBy === g ? styles.groupActive : ''}`}
              onClick={() => setGroupBy(g)}
            >
              {g === 'all' ? 'League' : g.charAt(0).toUpperCase() + g.slice(1)}
            </button>
          ))}
        </div>
      }
    >
      {loading || error ? (
        <StatusView loading={loading} error={error} />
      ) : (
        <div className={styles.sections}>
          {groups.map(([label, rows]) => (
            <div key={label || 'all'}>
              {label && <h2 className={styles.groupLabel}>{label}</h2>}
              <DataTable
                columns={COLUMNS}
                rows={rows}
                getKey={(s) => s.team_id}
                defaultSort={{ key: 'win_pct', dir: 'desc' }}
                emptyMessage="No standings available."
              />
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
