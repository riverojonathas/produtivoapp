'use client'

import styles from './logo.module.css'
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  collapsed?: boolean
}

export const Logo: React.FC<LogoProps> = ({ className, collapsed }) => {
  return (
    <div className={cn(
      styles.brandIcon,
      collapsed && styles.collapsed,
      "text-blue-400",
      className
    )}>
      <span className={styles.brandIconText}>P</span>
      <div className={styles.brandIconDot} />
    </div>
  )
}

export const LogoHorizontal: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className={cn(styles.brand, className)}>
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