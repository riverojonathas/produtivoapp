'use client'

import { useState, useEffect } from 'react'

export function useAutoCollapse(threshold: number = 100) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  useEffect(() => {
    // Detectar scroll
    const handleScroll = () => {
      if (window.scrollY > threshold && !hasInteracted) {
        setIsCollapsed(true)
        setHasInteracted(true)
      }
    }

    // Detectar interação do usuário
    const handleInteraction = () => {
      if (!hasInteracted) {
        setTimeout(() => {
          setIsCollapsed(true)
          setHasInteracted(true)
        }, 30000) // 30 segundos após primeira interação
      }
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('mousemove', handleInteraction)
    window.addEventListener('keydown', handleInteraction)
    window.addEventListener('click', handleInteraction)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleInteraction)
      window.removeEventListener('keydown', handleInteraction)
      window.removeEventListener('click', handleInteraction)
    }
  }, [threshold, hasInteracted])

  return { isCollapsed, setIsCollapsed }
} 