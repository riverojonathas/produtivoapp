'use client'

import styles from './styles.module.css'

export const Logo = () => {
  return (
    <div className={styles.brandIcon}>
      <span className={styles.brandIconText}>P</span>
      <div className={styles.brandIconDot} />
    </div>
  )
}

export const LogoHorizontal = () => {
  return (
    <div className={styles.brand}>
      <div className={styles.brandMain}>
        <h1 className={styles.brandName}>
          Produtivo
          <span className={styles.brandDot}>.</span>
        </h1>
      </div>
      <span className={styles.brandTagline}>Product Management</span>
    </div>
  )
} 