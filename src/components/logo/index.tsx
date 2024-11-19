'use client'

import styles from './logo.module.css'
import { cn } from "@/lib/utils"
import { usePreferences } from "@/hooks/use-preferences"

interface LogoProps {
  className?: string
  collapsed?: boolean
  inverted?: boolean
}

export const Logo: React.FC<LogoProps> = ({ className, collapsed, inverted }) => {
  const { theme } = usePreferences()
  const isDark = theme === 'dark' || inverted

  return (
    <div className={cn(
      styles.brandIcon,
      collapsed && styles.collapsed,
      isDark ? "text-white" : "text-[#0f172a]",
      className
    )}>
      <span className={styles.brandIconText}>P</span>
      <div className={styles.brandIconDot} />
    </div>
  )
}

export const LogoHorizontal: React.FC<LogoProps> = ({ className, inverted }) => {
  const { theme } = usePreferences()
  const isDark = theme === 'dark' || inverted

  return (
    <div className={cn(styles.brand, className)}>
      <div className={styles.brandMain}>
        <h1 className={cn(
          styles.brandName,
          isDark ? "text-white" : "text-[#0f172a]"
        )}>
          Produtivo
          <span className="text-blue-400">
            .
          </span>
        </h1>
      </div>
      <span className={cn(
        styles.brandTagline,
        isDark ? "text-gray-400" : "text-gray-600"
      )}>
        Product Management
      </span>
    </div>
  )
} 