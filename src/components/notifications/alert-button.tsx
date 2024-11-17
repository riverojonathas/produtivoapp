'use client'

import { useEffect } from 'react'
import { useNotifications } from '@/hooks/use-notifications'
import { Button } from '@/components/ui/button'
import { Bell } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function AlertButton() {
  const { unreadCount } = useNotifications()

  // Efeito de pulsar quando há novas notificações
  useEffect(() => {
    if (unreadCount > 0) {
      const button = document.getElementById('alert-button')
      button?.classList.add('animate-pulse')
      
      // Remover animação após 5 segundos
      const timeout = setTimeout(() => {
        button?.classList.remove('animate-pulse')
      }, 5000)

      return () => clearTimeout(timeout)
    }
  }, [unreadCount])

  return (
    <Button
      id="alert-button"
      variant="ghost"
      size="icon"
      asChild
      className={cn(
        "relative h-7 w-7 p-0",
        unreadCount > 0 && "text-[var(--color-primary)]"
      )}
      title="Alertas"
    >
      <Link href="/alerts">
        <Bell className="h-3.5 w-3.5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-3 min-w-[12px] rounded-full bg-[var(--color-error)] text-white text-[9px] font-medium flex items-center justify-center px-1">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </Link>
    </Button>
  )
} 