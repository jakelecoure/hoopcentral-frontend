import type { League, LeagueOption } from '../../types';
import styles from './LeagueSelector.module.css';

interface Props {
  leagues: LeagueOption[];
  selected: League;
  onChange: (league: League) => void;
}

export function LeagueSelector({ leagues, selected, onChange }: Props) {
  return (
    <div className={styles.tabs} role="tablist" aria-label="League selector">
      {leagues.map(({ id, label }) => (
        <button
          key={id}
          role="tab"
          aria-selected={selected === id}
          className={`${styles.tab} ${selected === id ? styles.active : ''}`}
          onClick={() => onChange(id)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
