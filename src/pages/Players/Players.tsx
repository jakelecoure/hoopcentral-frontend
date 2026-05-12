import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../../components/PageLayout/PageLayout';
import { DataTable } from '../../components/DataTable/DataTable';
import { StatusView } from '../../components/StatusView/StatusView';
import { fetchPlayers } from '../../api/players';
import { fetchTeams } from '../../api/teams';
import { useLeagueCtx } from '../../context/LeagueContext';
import { useFetch } from '../../hooks/useFetch';
import type { Player, Team } from '../../types';
import type { Column } from '../../components/DataTable/DataTable';
import styles from './Players.module.css';

const PAGE_SIZE_OPTIONS = [25, 50, 100] as const;

const COLUMNS: Column<Player>[] = [
  {
    key: 'jersey_number',
    header: '#',
    align: 'center',
    width: '3rem',
    render: (p) => <span className={styles.jersey}>{p.jersey_number ?? '—'}</span>,
  },
  {
    key: 'name',
    header: 'Player',
    render: (p) => (
      <Link to={`/players/${p.id}`} className={styles.playerLink}>
        {p.name}
      </Link>
    ),
  },
  {
    key: 'team',
    header: 'Team',
    render: (p) => (
      <Link to={`/teams/${p.team_id}`} className={styles.teamLink}>
        {p.team}
      </Link>
    ),
  },
  { key: 'position', header: 'POS', align: 'center', width: '4rem' },
  { key: 'height',   header: 'HT',  align: 'center', width: '4.5rem' },
  { key: 'nationality', header: 'NAT', align: 'center', width: '4rem' },
];

export function Players() {
  const { league } = useLeagueCtx();
  const [search, setSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState('');
  const [posFilter, setPosFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZE_OPTIONS)[number]>(25);

  const { data, loading, error } = useFetch<Player[]>(() => fetchPlayers(league), [league]);
  const teams = useFetch<Team[]>(() => fetchTeams(league), [league]);

  // Reset page when filters change
  const filtered = useMemo(() => {
    setPage(1);
    const q = search.trim().toLowerCase();
    return (data ?? []).filter((p) => {
      if (q && !p.name.toLowerCase().includes(q)) return false;
      if (teamFilter && p.team !== teamFilter) return false;
      if (posFilter && p.position !== posFilter) return false;
      return true;
    });
  }, [data, search, teamFilter, posFilter]);

  const positions = useMemo(() => {
    const set = new Set<string>();
    (data ?? []).forEach((p) => { if (p.position) set.add(p.position); });
    return Array.from(set).sort();
  }, [data]);

  const pageCount = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <PageLayout
      title="Players"
      subtitle={data ? `${filtered.length} players` : undefined}
      action={
        <div className={styles.controls}>
          <input
            type="search"
            className={styles.search}
            placeholder="Search by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search players"
          />
          <select
            className={styles.select}
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            aria-label="Filter by team"
          >
            <option value="">All Teams</option>
            {(teams.data ?? []).map((t) => (
              <option key={t.id} value={t.name}>{t.name}</option>
            ))}
          </select>
          {positions.length > 0 && (
            <select
              className={styles.select}
              value={posFilter}
              onChange={(e) => setPosFilter(e.target.value)}
              aria-label="Filter by position"
            >
              <option value="">All Positions</option>
              {positions.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          )}
        </div>
      }
    >
      {loading || error ? (
        <StatusView loading={loading} error={error} />
      ) : (
        <>
          <DataTable
            columns={COLUMNS}
            rows={paginated}
            getKey={(p) => p.id}
            emptyMessage={search || teamFilter || posFilter ? 'No players match your filters.' : 'No players found.'}
          />

          {pageCount > 1 && (
            <div className={styles.pagination}>
              <div className={styles.paginationInfo}>
                Showing {((page - 1) * pageSize) + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}
              </div>
              <div className={styles.paginationControls}>
                <button
                  className={styles.pageBtn}
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  ←
                </button>
                {Array.from({ length: Math.min(pageCount, 7) }, (_, i) => {
                  const p = pageCount <= 7 ? i + 1 : page <= 4 ? i + 1 : page >= pageCount - 3 ? pageCount - 6 + i : page - 3 + i;
                  return (
                    <button
                      key={p}
                      className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ''}`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  className={styles.pageBtn}
                  disabled={page === pageCount}
                  onClick={() => setPage((p) => p + 1)}
                >
                  →
                </button>
              </div>
              <select
                className={styles.select}
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value) as typeof pageSize); setPage(1); }}
                aria-label="Rows per page"
              >
                {PAGE_SIZE_OPTIONS.map((s) => <option key={s} value={s}>{s} per page</option>)}
              </select>
            </div>
          )}
        </>
      )}
    </PageLayout>
  );
}
