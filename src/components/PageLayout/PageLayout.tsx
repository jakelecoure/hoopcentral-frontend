import type { ReactNode } from 'react';
import styles from './PageLayout.module.css';

interface Props {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}

export function PageLayout({ title, subtitle, action, children }: Props) {
  return (
    <div className={styles.layout}>
      {(title || action) && (
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            {title && <h1 className={styles.title}>{title}</h1>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          {action && <div className={styles.action}>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
