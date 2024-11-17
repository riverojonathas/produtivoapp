'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Bell,
  Users,
  Settings,
  BarChart2,
  LogOut
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const adminRoutes = [
  {
    path: '/admin/alerts',
    label: 'Central de Alertas',
    icon: Bell
  },
  {
    path: '/admin/users',
    label: 'Usuários',
    icon: Users
  },
  {
    path: '/admin/analytics',
    label: 'Analytics',
    icon: BarChart2
  },
  {
    path: '/admin/settings',
    label: 'Configurações',
    icon: Settings
  }
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="w-64 h-full bg-[var(--color-background-elevated)] border-r border-[var(--color-border)]">
      <div className="flex flex-col h-full">
        <div className="p-6">
          <h1 className="text-lg font-semibold">Admin Panel</h1>
        </div>

        <nav className="flex-1 px-3">
          {adminRoutes.map((route) => {
            const Icon = route.icon
            return (
              <Link
                key={route.path}
                href={route.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-background-secondary)] transition-colors",
                  pathname === route.path && "text-[var(--color-text-primary)] bg-[var(--color-background-secondary)]"
                )}
              >
                <Icon className="w-5 h-5" />
                {route.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 mt-auto">
          <Button
            variant="ghost"
            className="w-full justify-start text-[var(--color-text-secondary)]"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sair
          </Button>
        </div>
      </div>
    </div>
  )
} 