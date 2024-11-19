'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Logo, LogoHorizontal } from '@/components/logo'
import { useEffect, useState } from 'react'

interface SplashScreenProps {
  onComplete?: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false)
      onComplete?.()
    }, 2500) // Duração total da animação

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-background-primary)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <div className="relative flex flex-col items-center">
            {/* Logo P com animação */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1],
                delay: 0.2
              }}
            >
              <Logo className="w-16 h-16" />
            </motion.div>

            {/* Ponto azul */}
            <motion.div
              className="absolute -right-2 -bottom-2 w-3 h-3 rounded-full bg-blue-500"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.3,
                delay: 0.5,
                ease: [0.175, 0.885, 0.32, 1.275]
              }}
            />

            {/* Texto "Produtivo" com fade in */}
            <motion.div
              className="mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.7,
                ease: 'easeOut'
              }}
            >
              <LogoHorizontal className="h-6" />
            </motion.div>

            {/* Loading indicator */}
            <motion.div
              className="mt-8 h-0.5 w-16 bg-[var(--color-border)] overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <motion.div
                className="h-full bg-blue-500"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                  repeat: Infinity,
                  duration: 1,
                  ease: 'easeInOut'
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 