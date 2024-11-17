'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { useTheme } from "@/hooks/use-theme"
import { Logo, LogoHorizontal } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Package,
  Users,
  ListTodo,
  BookOpen,
  Target,
  GitBranch,
  BarChart3,
  Settings,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Bell,
  AlertTriangle,
  User2,
} from "lucide-react"
import { useProfile } from '@/hooks/use-profile'
import { useAutoCollapse } from '@/hooks/use-auto-collapse'
import { useNotifications } from '@/hooks/use-notifications'
import { useAdmin } from '@/hooks/use-admin'
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
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
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
  const { theme, toggleTheme } = useTheme()
  const { isCollapsed, setIsCollapsed } = useAutoCollapse()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isAdmin } = useAdmin()
  const { unreadCount } = useNotifications()

  // Detectar tamanho da tela
  const [isMobile, setIsMobile] = useState(false)

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
          "w-[280px] lg:w-64",
          isMobileMenuOpen ? "left-0" : "-left-[280px]",
          // Desktop
          "lg:left-0",
          isCollapsed && !isMobile && "lg:w-16"
        )}
      >
        {/* Logo */}
        <div className="flex h-14 items-center justify-center px-3 border-b border-[var(--color-border)]">
          <div className={cn(
            "flex flex-col items-center",
            isCollapsed && !isMobile && "w-8 h-8"
          )}>
            {isCollapsed && !isMobile ? (
              <Logo />
            ) : (
              <div className="flex flex-col items-center">
                <LogoHorizontal />
              </div>
            )}
          </div>
          
          {/* Botão fechar para mobile */}
          {isMobile && (
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden absolute right-2 p-2 rounded-lg hover:bg-[var(--color-background-secondary)]"
              title="Fechar menu"
            >
              <X className="w-4 h-4 text-[var(--color-text-secondary)]" />
            </button>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto p-3">
          <div className="space-y-1">
            {filteredMenuItems.map((item) => (
              <TooltipProvider key={item.href} delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 group",
                        pathname === item.href 
                          ? "bg-[var(--color-primary-subtle)] text-[var(--color-primary)]" 
                          : "text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-subtle)] hover:text-[var(--color-primary)]",
                        isCollapsed && !isMobile && "justify-center px-2"
                      )}
                    >
                      <item.icon className={cn(
                        "flex-shrink-0 transition-transform duration-200",
                        "group-hover:scale-110",
                        pathname === item.href && "animate-[pulse_2s_ease-in-out_infinite]",
                        isCollapsed && !isMobile ? "w-4 h-4" : "w-5 h-5"
                      )} />
                      {(!isCollapsed || isMobile) && (
                        <span className="transition-colors duration-200 font-medium">
                          {item.title}
                        </span>
                      )}
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && !isMobile && (
                    <TooltipContent side="right" className="font-medium">
                      {item.title}
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="shrink-0 border-t border-[var(--color-border)] p-2">
          <div className={cn(
            "flex items-center gap-2",
            isCollapsed ? "flex-col" : "justify-between px-2"
          )}>
            <div className={cn(
              "flex items-center gap-2",
              isCollapsed && "flex-col"
            )}>
              {/* Botão de Tema */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-8 w-8 p-0 text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-subtle)] hover:text-[var(--color-primary)] transition-all duration-200 group"
                title={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
              >
                {theme === 'dark' ? (
                  <Moon className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                ) : (
                  <Sun className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                )}
              </Button>

              {/* Botão de Alertas */}
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="relative h-8 w-8 p-0 text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-subtle)] hover:text-[var(--color-primary)] transition-all duration-200 group"
                title="Alertas"
              >
                <Link href="/alerts">
                  <Bell className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-3.5 min-w-[14px] rounded-full bg-[var(--color-error)] text-white text-[10px] font-medium flex items-center justify-center px-1">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Link>
              </Button>

              {/* Link de Perfil */}
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="h-8 w-8 p-0 text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-subtle)] hover:text-[var(--color-primary)] transition-all duration-200 group"
                title="Perfil"
              >
                <Link href="/profile">
                  <User2 className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                </Link>
              </Button>

              {/* Botão de Colapsar - Movido para dentro do primeiro div quando colapsado */}
              {isCollapsed && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsCollapsed(false)}
                  className="h-8 w-8 p-0 text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-subtle)] hover:text-[var(--color-primary)] transition-all duration-200 group"
                  title="Expandir menu"
                >
                  <ChevronRight className="h-4 w-4 group-hover:scale-110 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              )}
            </div>

            {/* Botão de Colapsar - Mostrado apenas quando expandido */}
            {!isCollapsed && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(true)}
                className="h-8 w-8 p-0 text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-subtle)] hover:text-[var(--color-primary)] transition-all duration-200 group"
                title="Recolher menu"
              >
                <ChevronLeft className="h-4 w-4 group-hover:scale-110 group-hover:-translate-x-1 transition-transform duration-200" />
              </Button>
            )}
          </div>
        </div>
      </aside>
    </>
  )
} 