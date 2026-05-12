import { Link } from 'react-router-dom';
import type { Game } from '../../types';
import styles from './GameCard.module.css';

interface Props {
  game: Game;
}

const STATUS_MAP: Record<Game['status'], string> = {
  scheduled: 'Scheduled',
  live: 'Live',
  final: 'Final',
};

export function GameCard({ game }: Props) {
  const hasScore = game.home_score !== undefined && game.away_score !== undefined;

  return (
    <Link to={`/games/${game.id}`} className={styles.card}>
      {game.status === 'live' && <span className={styles.livePip} aria-label="Live" />}

      <div className={styles.team}>
        <span className={styles.teamName}>{game.away_team}</span>
        {hasScore && (
          <span className={`${styles.score} ${(game.away_score ?? 0) > (game.home_score ?? 0) ? styles.leader : ''}`}>
            {game.away_score}
          </span>
        )}
      </div>
      <div className={styles.team}>
        <span className={styles.teamName}>{game.home_team}</span>
        {hasScore && (
          <span className={`${styles.score} ${(game.home_score ?? 0) > (game.away_score ?? 0) ? styles.leader : ''}`}>
            {game.home_score}
          </span>
        )}
      </div>

      <div className={styles.meta}>
        <span className={`${styles.status} ${styles[game.status]}`}>
          {STATUS_MAP[game.status]}
        </span>
        {game.status !== 'live' && <span className={styles.date}>{game.date}</span>}
      </div>
    </Link>
  );
}
