import { NavLink } from 'react-router-dom';
import { useLeagueCtx } from '../../context/LeagueContext';
import type { League } from '../../types';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/games', label: 'Games', end: false },
  { to: '/teams', label: 'Teams', end: false },
  { to: '/players', label: 'Players', end: false },
  { to: '/standings', label: 'Standings', end: false },
];

export function Navbar() {
  const { league, leagues, switchLeague } = useLeagueCtx();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <NavLink to="/" className={styles.brand}>
          HoopCentral
        </NavLink>

        <nav className={styles.nav} aria-label="Main navigation">
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.leaguePicker} role="tablist" aria-label="League">
          {leagues.map(({ id, label }) => (
            <button
              key={id}
              role="tab"
              aria-selected={league === id}
              className={`${styles.leagueBtn} ${league === id ? styles.leagueActive : ''}`}
              onClick={() => switchLeague(id as League)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
