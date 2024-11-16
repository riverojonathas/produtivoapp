'use client';

import { FC } from 'react';
import Link from 'next/link';
import styles from './logo.module.css';

interface LogoProps {
  collapsed?: boolean;
}

export const Logo: FC<LogoProps> = ({ collapsed = false }) => {
  if (collapsed) {
    return (
      <Link href="/" className={styles.brandIcon}>
        <span className={styles.brandIconText}>P</span>
        <div className={styles.brandIconDot} />
      </Link>
    );
  }

  return (
    <Link href="/" className={styles.brand}>
      <div className={styles.brandMain}>
        <h1 className={styles.brandName}>
          Produtivo
          <span className={styles.brandDot}>.</span>
        </h1>
      </div>
      <span className={styles.brandTagline}>Product Management</span>
    </Link>
  );
}; 