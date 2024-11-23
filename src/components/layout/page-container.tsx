'use client'

import { motion } from 'framer-motion'
import { animations } from '@/config/theme'
import { cn } from '@/lib/utils'

interface PageContainerProps {
  children: React.ReactNode
  className?: string
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={animations.slideUp}
      transition={animations.spring}
      className={cn("h-full flex flex-col -m-6", className)}
    >
      {children}
    </motion.div>
  )
}

export function PageHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[var(--color-background-primary)] border-b border-[var(--color-border)]">
      <div className="h-14 px-4 flex items-center justify-between">
        {children}
      </div>
    </div>
  )
}

export function PageContent({ children, className }: PageContainerProps) {
  return (
    <div className={cn("flex-1 p-6 overflow-auto", className)}>
      {children}
    </div>
  )
} 