'use client'

import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRoadmap } from '@/hooks/use-roadmap'
import { AddFeatureDialog } from '@/components/roadmap/add-feature-dialog'
import { EditFeatureDialog } from '@/components/roadmap/edit-feature-dialog'
import { Feature } from '@/types/product'
import { FeatureList } from '@/components/features/feature-list'
import { useCurrentProduct } from '@/hooks/use-current-product'

export default function FeaturesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null)
  
  // Carregar produto atual
  const { data: currentProduct, isLoading: isLoadingProduct } = useCurrentProduct()
  
  // Carregar features do produto atual
  const { 
    data: features, 
    isLoading: isLoadingFeatures, 
    error,
    updateFeatureStatus,
    deleteFeature 
  } = useRoadmap(currentProduct?.id)

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

  // Filtrar features por busca
  const filteredFeatures = features?.filter(feature => 
    feature.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feature.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleFeatureStatusChange = async (id: string, status: Feature['status']) => {
    try {
      await updateFeatureStatus.mutateAsync({ id, status })
    } catch (err) {
      console.error('Erro ao atualizar status:', err)
    }
  }

  const handleFeatureDelete = async (id: string) => {
    try {
      await deleteFeature.mutateAsync(id)
    } catch (err) {
      console.error('Erro ao excluir feature:', err)
    }
  }

  return (
    <div className="container max-w-[1200px] mx-auto py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">Features</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Gerencie todas as features do seu produto
          </p>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Feature
        </Button>
      </div>

      {/* Barra de Busca */}
      <div className="mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
          <Input
            placeholder="Buscar features..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Lista de Features */}
      {isLoadingFeatures ? (
        <div className="text-center py-8 text-[var(--color-text-secondary)]">
          Carregando features...
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          Erro ao carregar features: {error instanceof Error ? error.message : 'Erro desconhecido'}
        </div>
      ) : filteredFeatures?.length === 0 ? (
        <div className="text-center py-8 text-[var(--color-text-secondary)]">
          Nenhuma feature encontrada
        </div>
      ) : (
        <FeatureList
          features={filteredFeatures || []}
          onFeatureClick={setSelectedFeature}
          onFeatureStatusChange={handleFeatureStatusChange}
          onFeatureDelete={handleFeatureDelete}
        />
      )}

      {/* Diálogos */}
      <AddFeatureDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        existingFeatures={features || []}
        productId={currentProduct.id}
      />

      {selectedFeature && (
        <EditFeatureDialog
          open={!!selectedFeature}
          onOpenChange={(open) => !open && setSelectedFeature(null)}
          feature={selectedFeature}
          existingFeatures={features || []}
        />
      )}
    </div>
  )
} 