'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { useTheme } from "@/hooks/use-theme"
import { Logo, LogoHorizontal } from "@/components/ui/logo"
import {
  Grid2X2,
  Box,
  Target,
  Users2,
  BarChart3,
  Settings,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Boxes,
  User2,
  Menu,
  X,
  LayoutDashboard,
  Package,
  GitBranch,
  ListTodo,
  Users,
  Bell
} from "lucide-react"
import { useProfile } from '@/hooks/use-profile'
import { useAutoCollapse } from '@/hooks/use-auto-collapse'
import { useNotifications } from '@/hooks/useNotifications'

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Grid2X2,
  },
  {
    title: "Produtos",
    href: "/products",
    icon: Package,
  },
  {
    title: "Roadmap",
    href: "/roadmap",
    icon: GitBranch,
  },
  {
    title: "Features",
    href: "/features",
    icon: ListTodo,
  },
  {
    title: "Personas",
    href: "/personas",
    icon: Users,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
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
  const { profile, loading } = useProfile()
  const { isCollapsed, setIsCollapsed } = useAutoCollapse()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { unreadCount, markAllAsRead } = useNotifications()

  // Detectar tamanho da tela
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024) // 1024px é o breakpoint lg do Tailwind
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Fechar menu mobile ao navegar
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

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
        <Menu className="w-5 h-5 text-[var(--color-text-primary)]" />
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
          isCollapsed && !isMobile && "lg:w-20"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-[var(--color-border)]">
          <div className={cn(
            "flex items-center",
            isCollapsed && !isMobile && "justify-center w-full"
          )}>
            {isCollapsed && !isMobile ? (
              <div className="w-10 h-10">
                <Logo />
              </div>
            ) : (
              <div className="w-full">
                <LogoHorizontal />
              </div>
            )}
          </div>
          {/* Botão fechar para mobile */}
          {isMobile && (
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-[var(--color-background-secondary)]"
            >
              <X className="w-5 h-5 text-[var(--color-text-secondary)]" />
            </button>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 group",
                  pathname === item.href 
                    ? "bg-[var(--color-primary-subtle)] text-[var(--color-primary)]" 
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-subtle)] hover:text-[var(--color-primary)]",
                  isCollapsed && !isMobile && "justify-center"
                )}
                title={isCollapsed && !isMobile ? item.title : undefined}
              >
                <item.icon className={cn(
                  "h-5 w-5 flex-shrink-0 transition-transform duration-200",
                  "group-hover:scale-110",
                  pathname === item.href && "animate-[pulse_2s_ease-in-out_infinite]"
                )} />
                {(!isCollapsed || isMobile) && (
                  <span className="transition-colors duration-200 font-medium">
                    {item.title}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="shrink-0 border-t border-[var(--color-border)] p-2">
          {/* Theme Toggle, Notifications e Collapse Button */}
          <div className={cn(
            "flex items-center gap-2 px-2 py-1",
            isCollapsed && !isMobile && "flex-col"
          )}>
            <button
              onClick={toggleTheme}
              className={cn(
                "w-full p-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-subtle)] hover:text-[var(--color-primary)] transition-all duration-200 group",
                isCollapsed && !isMobile && "justify-center flex"
              )}
              title={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
            >
              {theme === 'dark' ? (
                <Moon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              ) : (
                <Sun className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              )}
            </button>

            {/* Botão de Notificações */}
            <button
              onClick={markAllAsRead}
              className={cn(
                "w-full p-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-subtle)] hover:text-[var(--color-primary)] transition-all duration-200 group relative",
                isCollapsed && !isMobile && "justify-center flex"
              )}
              title="Notificações"
            >
              <Bell className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 min-w-[16px] rounded-full bg-[var(--color-error)] text-white text-xs font-medium flex items-center justify-center px-1">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={cn(
                "w-full p-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-subtle)] hover:text-[var(--color-primary)] transition-all duration-200 group",
                isCollapsed && !isMobile && "justify-center flex"
              )}
              title={isCollapsed ? "Expandir menu" : "Recolher menu"}
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5 group-hover:scale-110 group-hover:translate-x-1 transition-transform duration-200" />
              ) : (
                <ChevronLeft className="h-5 w-5 group-hover:scale-110 group-hover:-translate-x-1 transition-transform duration-200" />
              )}
            </button>
          </div>

          {/* User Info */}
          <Link
            href="/profile"
            className={cn(
              "mt-1 flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
              "text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-subtle)] hover:text-[var(--color-primary)]",
              isCollapsed && !isMobile && "justify-center"
            )}
          >
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] bg-opacity-10 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-200">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User2 className="w-4 h-4 text-[var(--color-primary)]" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[var(--color-background-primary)] bg-green-500" />
            </div>
            {(!isCollapsed || isMobile) && !loading && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {profile?.name || 'Usuário'}
                </p>
                <p className="text-[11px] text-[var(--color-text-secondary)] truncate opacity-80">
                  {profile?.email || ''}
                </p>
              </div>
            )}
          </Link>
        </div>
      </aside>
    </>
  )
} 