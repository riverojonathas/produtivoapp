'use client'

import { Suspense } from 'react'
import { Sidebar } from '@/components/admin/sidebar'
import { Loading } from '@/components/ui/loading'
import { AdminProvider } from '@/providers/admin-provider'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminProvider>
      <div className="flex h-screen">
        <Suspense fallback={<Loading />}>
          <Sidebar />
        </Suspense>
        <main className="flex-1 overflow-auto p-6">
          <Suspense fallback={<Loading />}>
            {children}
          </Suspense>
        </main>
      </div>
    </AdminProvider>
  )
} 