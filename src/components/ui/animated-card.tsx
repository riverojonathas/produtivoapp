'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { animations } from '@/config/theme'

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number
  children: React.ReactNode
}

interface AnimatedListItemProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode
}

export function AnimatedCard({ 
  delay = 0, 
  className, 
  children,
  ...props 
}: AnimatedCardProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={animations.slideUp}
      transition={{
        ...animations.spring,
        delay
      }}
    >
      <Card className={cn("", className)} {...props}>
        {children}
      </Card>
    </motion.div>
  )
}

export function AnimatedList({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedListItem({ children, className, ...props }: AnimatedListItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: animations.spring
        }
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
} 