'use client'

import { useState } from 'react'
import { Plus, Search, User2, Target, Heart, Goal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { usePersonas } from '@/hooks/use-personas'
import { useProducts } from '@/hooks/use-products'
import { AddPersonaDialog } from '@/components/personas/add-persona-dialog'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function PersonasPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const { personas, isLoading } = usePersonas()
  const { products } = useProducts()

  // Filtrar personas por busca
  const filteredPersonas = personas?.filter(persona => 
    persona.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    persona.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Personas
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Gerencie as personas do seu produto
          </p>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Persona
        </Button>
      </div>

      {/* Busca */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
        <Input
          placeholder="Buscar personas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Lista de Personas */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-6 h-[200px]" />
          ))}
        </div>
      ) : filteredPersonas?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-[var(--color-background-elevated)] rounded-full flex items-center justify-center mb-4">
            <User2 className="w-8 h-8 text-[var(--color-text-secondary)]" />
          </div>
          <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">
            Nenhuma persona encontrada
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">
            {searchTerm 
              ? 'Tente buscar com outros termos'
              : 'Comece criando sua primeira persona'}
          </p>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Persona
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPersonas.map((persona) => {
            const product = products?.find(p => p.id === persona.product_id)
            
            return (
              <Card
                key={persona.id}
                className="p-6 hover:border-[var(--color-border-hover)] transition-colors cursor-pointer"
              >
                {/* Header do Card */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-medium text-[var(--color-text-primary)] mb-1">
                      {persona.name}
                    </h3>
                    {product && (
                      <span className="text-xs px-2 py-1 bg-[var(--color-background-secondary)] text-[var(--color-text-secondary)] rounded-full">
                        {product.name}
                      </span>
                    )}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[var(--color-background-secondary)] flex items-center justify-center">
                    <User2 className="w-5 h-5 text-[var(--color-text-secondary)]" />
                  </div>
                </div>

                {/* Descrição */}
                <p className="text-sm text-[var(--color-text-secondary)] mb-4 line-clamp-2">
                  {persona.description || 'Sem descrição'}
                </p>

                {/* Métricas */}
                <div className="grid grid-cols-3 gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex flex-col items-center p-2 rounded-lg bg-[var(--color-background-secondary)]">
                          <Target className="w-4 h-4 text-blue-500 mb-1" />
                          <span className="text-xs text-[var(--color-text-secondary)]">
                            {persona.characteristics?.length || 0}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Características</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex flex-col items-center p-2 rounded-lg bg-[var(--color-background-secondary)]">
                          <Heart className="w-4 h-4 text-red-500 mb-1" />
                          <span className="text-xs text-[var(--color-text-secondary)]">
                            {persona.pain_points?.length || 0}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Pontos de Dor</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex flex-col items-center p-2 rounded-lg bg-[var(--color-background-secondary)]">
                          <Goal className="w-4 h-4 text-green-500 mb-1" />
                          <span className="text-xs text-[var(--color-text-secondary)]">
                            {persona.goals?.length || 0}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Objetivos</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Dialog de adicionar persona */}
      <AddPersonaDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  )
} 