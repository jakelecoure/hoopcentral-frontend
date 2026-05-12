import { useMemo, useState } from 'react';
import { PageLayout } from '../../components/PageLayout/PageLayout';
import { GameCard } from '../../components/GameCard/GameCard';
import { StatusView } from '../../components/StatusView/StatusView';
import { fetchGames } from '../../api/games';
import { useLeagueCtx } from '../../context/LeagueContext';
import { useFetch } from '../../hooks/useFetch';
import type { Game } from '../../types';
import styles from './Games.module.css';

type Filter = 'all' | 'scheduled' | 'live' | 'final';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'live', label: 'Live' },
  { id: 'scheduled', label: 'Upcoming' },
  { id: 'final', label: 'Completed' },
];

export function Games() {
  const { league } = useLeagueCtx();
  const [filter, setFilter] = useState<Filter>('all');
  const { data, loading, error } = useFetch<Game[]>(() => fetchGames(league), [league]);

  const filtered = useMemo(() => {
    if (!data) return [];
    if (filter === 'all') return data;
    return data.filter((g) => g.status === filter);
  }, [data, filter]);

  return (
    <PageLayout
      title="Games"
      subtitle={data ? `${filtered.length} of ${data.length} games` : undefined}
      action={
        <div className={styles.filters}>
          {FILTERS.map((f) => (
            <button
              key={f.id}
              className={`${styles.filterBtn} ${filter === f.id ? styles.active : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
              {data && (
                <span className={styles.count}>
                  {f.id === 'all' ? data.length : data.filter((g) => g.status === f.id).length}
                </span>
              )}
            </button>
          ))}
        </div>
      }
    >
      {loading || error ? (
        <StatusView loading={loading} error={error} />
      ) : filtered.length === 0 ? (
        <p className={styles.empty}>No games match this filter.</p>
      ) : (
        <div className={styles.grid}>
          {filtered.map((g) => (
            <GameCard key={g.id} game={g} />
          ))}
        </div>
      )}
    </PageLayout>
  );
}
