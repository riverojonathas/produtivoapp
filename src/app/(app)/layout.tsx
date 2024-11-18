'use client';

import { Sidebar } from "@/components/sidebar"
import { cn } from "@/lib/utils"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[var(--color-background-primary)]">
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="h-full rounded-tl-2xl bg-[var(--color-background-elevated)] p-6 shadow-inner">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 