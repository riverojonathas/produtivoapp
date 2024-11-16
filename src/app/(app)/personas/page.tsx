'use client'

import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { usePersonas } from '@/hooks/use-personas'
import { PersonaList } from '@/components/personas/persona-list'
import { AddPersonaDialog } from '@/components/personas/add-persona-dialog'
import { EditPersonaDialog } from '@/components/personas/edit-persona-dialog'
import { Persona } from '@/types/product'
import { useCurrentProduct } from '@/hooks/use-current-product'

export default function PersonasPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null)
  
  // Carregar produto atual
  const { data: currentProduct, isLoading: isLoadingProduct } = useCurrentProduct()
  
  // Carregar personas do produto atual
  const { 
    data: personas, 
    isLoading: isLoadingPersonas, 
    error 
  } = usePersonas(currentProduct?.id)

  // Mostrar loading enquanto carrega o produto
  if (isLoadingProduct) {
    return (
      <div className="flex items-center justify-center h-full text-[var(--color-text-secondary)]">
        Carregando produto...
      </div>
    )
  }

  // Verificar se tem produto selecionado
  if (!currentProduct) {
    return (
      <div className="flex items-center justify-center h-full text-[var(--color-text-secondary)]">
        Nenhum produto selecionado
      </div>
    )
  }

  // Filtrar personas por busca
  const filteredPersonas = personas?.filter(persona => 
    persona.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    persona.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container max-w-[1200px] mx-auto py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">Personas</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Defina e gerencie as personas do seu produto
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

      {/* Barra de Busca */}
      <div className="mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
          <Input
            placeholder="Buscar personas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Lista de Personas */}
      {isLoadingPersonas ? (
        <div className="text-center py-8 text-[var(--color-text-secondary)]">
          Carregando personas...
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          Erro ao carregar personas: {error instanceof Error ? error.message : 'Erro desconhecido'}
        </div>
      ) : filteredPersonas?.length === 0 ? (
        <div className="text-center py-8 text-[var(--color-text-secondary)]">
          Nenhuma persona encontrada
        </div>
      ) : (
        <PersonaList
          personas={filteredPersonas || []}
          onPersonaClick={setSelectedPersona}
        />
      )}

      {/* Diálogos */}
      <AddPersonaDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        productId={currentProduct.id}
      />

      {selectedPersona && (
        <EditPersonaDialog
          open={!!selectedPersona}
          onOpenChange={(open) => !open && setSelectedPersona(null)}
          persona={selectedPersona}
        />
      )}
    </div>
  )
} 