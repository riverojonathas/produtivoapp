'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { usePreferences } from "@/hooks/use-preferences"
import { Logo, LogoHorizontal } from "@/components/logo"
import {
  LayoutDashboard,
  Package,
  Users,
  ListTodo,
  BookOpen,
  Target,
  GitBranch,
  Settings,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Menu,
  Bell,
  AlertTriangle,
  User2,
} from "lucide-react"
import { useAutoCollapse } from '@/hooks/use-auto-collapse'
import { useNotifications } from '@/hooks/use-notifications'
import { useAdmin } from '@/hooks/use-admin'
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Produtos",
    href: "/products",
    icon: Package,
  },
  {
    title: "Personas",
    href: "/personas",
    icon: Users,
  },
  {
    title: "Features",
    href: "/features",
    icon: ListTodo,
  },
  {
    title: "Histórias",
    href: "/stories",
    icon: BookOpen,
  },
  {
    title: "Priorização",
    href: "/prioritization",
    icon: Target,
  },
  {
    title: "Roadmap",
    href: "/roadmap",
    icon: GitBranch,
  },
  {
    title: "Alertas Admin",
    href: "/admin-alerts",
    icon: AlertTriangle,
    adminOnly: true,
  },
  {
    title: "Configurações",
    href: "/settings",
    icon: Settings,
  }
]

export function Sidebar() {
  const pathname = usePathname()
  const { theme, setTheme } = usePreferences()
  const { isCollapsed, setIsCollapsed } = useAutoCollapse()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isAdmin } = useAdmin()
  const { unreadCount } = useNotifications()
  const [isMobile, setIsMobile] = useState(false)

  // Detectar tamanho da tela
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Fechar menu mobile ao navegar
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Filtrar itens do menu baseado em permissões
  const filteredMenuItems = menuItems.filter(item => 
    !item.adminOnly || (item.adminOnly && isAdmin)
  )

  const handleThemeToggle = async () => {
    try {
      await setTheme(theme === 'light' ? 'dark' : 'light')
    } catch (error) {
      console.error('Erro ao alternar tema:', error)
    }
  }

  return (
    <>
      {/* Botão do menu mobile */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className={cn(
          "lg:hidden fixed left-4 top-4 z-50 p-2 rounded-lg bg-[var(--color-background-elevated)] border border-[var(--color-border)]",
          "hover:bg-[var(--color-background-secondary)] transition-colors"
        )}
        title="Abrir menu"
      >
        <Menu className="w-4 h-4 text-[var(--color-text-primary)]" />
      </button>

      {/* Overlay para mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside 
        className={cn(
          "shrink-0 fixed lg:sticky top-0 h-screen z-50 border-r border-[var(--color-border)] bg-[var(--color-background-primary)] flex flex-col transition-all duration-300",
          // Mobile
          "w-[280px] lg:w-48",
          isMobileMenuOpen ? "left-0" : "-left-[280px]",
          // Desktop
          "lg:left-0",
          isCollapsed && !isMobile && "lg:w-12",
          isCollapsed && "collapsed"
        )}
      >
        {/* Logo */}
        <div className="flex h-14 items-center justify-center border-b border-[var(--color-border)]">
          <div className={cn(
            'transition-all duration-300 overflow-hidden',
            isCollapsed && !isMobile ? 'w-8 px-0' : 'w-full px-3',
            !isCollapsed && 'flex justify-center'
          )}>
            {isCollapsed && !isMobile ? (
              <div className="flex items-center justify-center">
                <Logo 
                  className="transition-all duration-300"
                  collapsed={isCollapsed} 
                />
              </div>
            ) : (
              <LogoHorizontal className="h-[42px]" />
            )}
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto py-2 px-1.5">
          <div className="space-y-0.5">
            {filteredMenuItems.map((item) => (
              <TooltipProvider key={item.href} delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-2 py-1.5 transition-all duration-200 group",
                        pathname === item.href 
                          ? "bg-[var(--color-primary-subtle)] text-[var(--color-primary)]" 
                          : "text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-subtle)] hover:text-[var(--color-primary)]",
                        isCollapsed && !isMobile && "justify-center p-1.5"
                      )}
                    >
                      <item.icon className={cn(
                        "flex-shrink-0 transition-transform duration-200",
                        "group-hover:scale-105",
                        pathname === item.href && "animate-[pulse_2s_ease-in-out_infinite]",
                        "w-4 h-4"
                      )} />
                      {(!isCollapsed || isMobile) && (
                        <span className="text-[11px] font-medium truncate">
                          {item.title}
                        </span>
                      )}
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && !isMobile && (
                    <TooltipContent side="right" className="text-[11px] font-medium">
                      {item.title}
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="shrink-0 border-t border-[var(--color-border)] p-1.5">
          <div className={cn(
            "flex items-center gap-1",
            isCollapsed ? "flex-col" : "justify-between px-1"
          )}>
            <div className={cn(
              "flex items-center gap-1",
              isCollapsed && "flex-col"
            )}>
              {/* Botões do footer */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleThemeToggle}
                className="h-7 w-7 p-0"
                title={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
              >
                {theme === 'dark' ? (
                  <Sun className="h-3.5 w-3.5" />
                ) : (
                  <Moon className="h-3.5 w-3.5" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                asChild
                className="relative h-7 w-7 p-0"
                title="Alertas"
              >
                <Link href="/alerts">
                  <Bell className="h-3.5 w-3.5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-2.5 min-w-[10px] rounded-full bg-[var(--color-error)] text-white text-[8px] font-medium flex items-center justify-center px-1">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                asChild
                className="h-7 w-7 p-0"
                title="Perfil"
              >
                <Link href="/profile">
                  <User2 className="h-3.5 w-3.5" />
                </Link>
              </Button>

              {isCollapsed && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsCollapsed(false)}
                  className="h-7 w-7 p-0"
                  title="Expandir menu"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>

            {!isCollapsed && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(true)}
                className="h-7 w-7 p-0"
                title="Recolher menu"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      </aside>
    </>
  )
} 