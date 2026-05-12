import styles from './StatusView.module.css';

interface Props {
  loading?: boolean;
  error?: string | null;
}

export function StatusView({ loading, error }: Props) {
  if (loading) {
    return (
      <div className={styles.center}>
        <span className={styles.spinner} aria-label="Loading" />
      </div>
    );
  }
  if (error) {
    return (
      <div className={styles.center}>
        <p className={styles.error}>Failed to load data: {error}</p>
      </div>
    );
  }
  return null;
}
