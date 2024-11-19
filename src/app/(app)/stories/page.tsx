'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { 
  Plus,
  Search,
  Map,
  Users,
  Target
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Story {
  id: string
  title: string
  description: string
  status: string
  priority: string
}

export default function StoriesPage() {
  const router = useRouter()

  return (
    <div className="h-full flex flex-col -m-6">
      {/* Cabeçalho */}
      <div className="bg-[var(--color-background-primary)] border-b border-[var(--color-border)]">
        <div className="h-14 px-4 flex items-center justify-between">
          {/* Lado Esquerdo */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-medium text-[var(--color-text-primary)]">
                  Histórias
                </h1>
                <span className="text-xs text-[var(--color-text-secondary)]">
                  12
                </span>
              </div>

              <Button 
                size="sm"
                className="h-8 w-8 p-0 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
                title="Nova História"
              >
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>

            {/* Separador Vertical */}
            <div className="h-4 w-px bg-[var(--color-border)]" />

            {/* Botão User Story Mapping */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/stories/user-story-mapping')}
              className="h-8 gap-2"
            >
              <Map className="w-3.5 h-3.5" />
              User Story Mapping
            </Button>
          </div>

          {/* Lado Direito */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
              <Input
                placeholder="Buscar histórias..."
                className="pl-8 h-8 text-sm bg-[var(--color-background-elevated)] border-[var(--color-border)] w-[200px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 p-6">
        {/* ... resto do conteúdo ... */}
      </div>
    </div>
  )
} 