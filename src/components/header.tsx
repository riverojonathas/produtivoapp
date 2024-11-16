'use client'

import { UserButton } from "@/components/user-button"

export function Header() {
  return (
    <header className="h-16 border-b border-[var(--color-border)] bg-[var(--color-background-primary)]">
      <div className="flex items-center justify-between h-full px-6">
        <div></div>
        <UserButton />
      </div>
    </header>
  )
} 