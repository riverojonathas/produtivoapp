'use client'

import { useRouter } from 'next/navigation'
import { useProducts } from '@/hooks/use-products'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Pencil, 
  MoreHorizontal,
  Users,
  Target,
  Lightbulb,
  AlertTriangle,
  ArrowUp,
  ListChecks,
  Eye,
  LineChart,
  TagIcon,
  Files,
  Trash2,
  BarChart3
} from 'lucide-react'
import { ProductAvatar } from '@/components/products/product-avatar'
import { ProductStatusBadge } from '@/components/products/product-status-badge'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'
import { use } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ProductTagsDialog } from '@/components/products/product-tags-dialog'
import { useState, useEffect } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { IProduct, IProductMetric, IProductRisk } from '@/types/product'
import { ITag } from '@/types/tag'

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const router = useRouter()
  const resolvedParams = use(params)
  const { product, isLoading, deleteProduct } = useProducts(resolvedParams.id)
  const [showVisionDialog, setShowVisionDialog] = useState(false)
  const [showMetricsDialog, setShowMetricsDialog] = useState(false)
  const [showTagsDialog, setShowTagsDialog] = useState(false)

  useEffect(() => {
    if (!isLoading && !product) {
      toast.error('Produto não encontrado')
      router.push('/products')
    }
  }, [isLoading, product, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-[var(--color-text-secondary)]">Carregando...</div>
      </div>
    )
  }

  if (!product) {
    return null
  }

  const handleDelete = async () => {
    try {
      await deleteProduct.mutateAsync(product.id)
      toast.success('Produto excluído com sucesso')
      router.push('/products')
    } catch (error) {
      console.error('Erro ao excluir produto:', error)
      toast.error('Erro ao excluir produto')
    }
  }

  const handleDuplicate = () => {
    router.push(`/products/new?duplicate=${product.id}`)
  }

  // Helper function para renderizar métricas
  const renderMetrics = (metrics?: IProductMetric[]) => {
    if (!metrics?.length) {
      return (
        <p className="text-sm text-[var(--color-text-secondary)]">
          Nenhuma métrica definida para este produto.
        </p>
      )
    }

    return (
      <div className="space-y-4">
        {/* HEART Metrics */}
        <div>
          <h3 className="text-sm font-medium mb-3">Métricas HEART</h3>
          <div className="grid gap-3">
            {metrics
              .filter(metric => metric.type === 'heart')
              .map((metric, index) => (
                <div 
                  key={index}
                  className="p-3 bg-[var(--color-background-subtle)] rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium">{metric.name}</span>
                  </div>
                  <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                    {metric.value}
                  </p>
                </div>
              ))}
          </div>
        </div>

        {/* North Star Metrics */}
        <div>
          <h3 className="text-sm font-medium mb-3">Métricas North Star</h3>
          <div className="grid gap-3">
            {metrics
              .filter(metric => metric.type === 'north_star')
              .map((metric, index) => (
                <div 
                  key={index}
                  className="p-3 bg-[var(--color-background-subtle)] rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium">{metric.name}</span>
                  </div>
                  <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                    {metric.value}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    )
  }

  // Helper function para renderizar riscos
  const renderRisks = (risks?: IProductRisk[]) => {
    if (!risks?.length) {
      return (
        <p className="text-sm text-[var(--color-text-secondary)]">
          Nenhum risco identificado
        </p>
      )
    }

    return (
      <div className="space-y-4">
        {risks.map((risk, index) => (
          <div 
            key={index} 
            className="p-4 bg-[var(--color-background-subtle)] rounded-lg border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <Badge variant="secondary" className="text-[10px] bg-amber-500/10 text-amber-600">
                {risk.category}
              </Badge>
            </div>
            <p className="text-sm mb-3">{risk.description}</p>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="text-[10px] shrink-0">
                Mitigação
              </Badge>
              <p className="text-sm text-[var(--color-text-secondary)]">
                {risk.mitigation}
              </p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col -m-6">
      {/* Cabeçalho Unificado */}
      <div className="bg-[var(--color-background-primary)] border-b border-[var(--color-border)]">
        <div className="h-14 px-4 flex items-center justify-between">
          {/* Lado Esquerdo - Navegação e Identificação */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => router.push('/products')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-4">
              <ProductAvatar
                className="w-8 h-8 rounded-lg border border-[var(--color-border)]"
                src={product.avatar_url}
              >
                {product.name.substring(0, 2).toUpperCase()}
              </ProductAvatar>

              <div className="space-y-1">
                <h1 className="text-sm font-medium text-[var(--color-text-primary)]">
                  {product.name}
                </h1>
                <div className="flex items-center gap-3 text-xs">
                  <ProductStatusBadge status={product.status} />
                  <span className="text-[var(--color-text-secondary)]">
                    Criado em {format(new Date(product.created_at), "dd MMM, yy", { locale: ptBR })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Lado Direito - Métricas e Ações */}
          <div className="flex items-center gap-6">
            {/* Métricas Rápidas */}
            <div className="flex items-center gap-4 border-r border-[var(--color-border)] pr-6">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded bg-violet-500/8 dark:bg-violet-500/10">
                        <Users className="w-3.5 h-3.5 text-violet-500" />
                      </div>
                      <span className="text-sm font-medium">
                        {product.team?.length || 0}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="center">
                    <p className="text-xs font-medium">Membros no time</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded bg-amber-500/8 dark:bg-amber-500/10">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                      </div>
                      <span className="text-sm font-medium">
                        {product.risks_count || 0}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="center">
                    <p className="text-xs font-medium">Riscos identificados</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded bg-blue-500/8 dark:bg-blue-500/10">
                        <LineChart className="w-3.5 h-3.5 text-blue-500" />
                      </div>
                      <span className="text-sm font-medium">
                        {product.metrics_count || 0}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="center">
                    <p className="text-xs font-medium">Métricas definidas</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Ações */}
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setShowTagsDialog(true)}
                    >
                      <TagIcon className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-xs">Gerenciar tags</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={handleDuplicate}
                    >
                      <Files className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-xs">Duplicar produto</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => router.push(`/products/${product.id}/edit`)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-xs">Editar produto</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                      onClick={handleDelete}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-xs">Excluir produto</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-3 gap-6">
          {/* Coluna Principal - 2/3 */}
          <div className="col-span-2 space-y-6">
            {/* Visão */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-base font-medium flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-[var(--color-primary)]" />
                    Visão do Produto
                  </h2>
                  <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                    {product.vision 
                      ? 'Propósito e direção do produto'
                      : 'Nenhuma visão definida para este produto'}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setShowVisionDialog(true)}
                >
                  <Eye className="w-3.5 h-3.5 mr-1.5" />
                  Detalhes
                </Button>
              </div>

              {product.vision ? (
                <div className="space-y-6">
                  {/* Visão em formato de frase */}
                  <div className="p-4 bg-[var(--color-background-subtle)] rounded-lg border border-[var(--color-border)]">
                    <p className="text-sm leading-relaxed">
                      Para <span className="text-[var(--color-primary)] font-medium">{product.target_audience}</span>,
                      <br />que {product.vision.split('\n')[1].replace('Que ', '')},
                      <br />nosso <span className="text-[var(--color-primary)] font-medium">{product.name}</span>
                      <br />{product.vision.split('\n')[3].replace('Oferece ', '')}.
                    </p>
                  </div>

                  {/* Métricas HEART */}
                  {product.product_metrics?.some(m => m.type === 'heart') && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-sm font-medium">Framework HEART</h3>
                        <Badge variant="secondary" className="text-[10px]">
                          Métricas de UX
                        </Badge>
                      </div>
                      <div className="grid grid-cols-5 gap-3">
                        {['Happiness', 'Engagement', 'Adoption', 'Retention', 'Task Success'].map(metricType => {
                          const metric = product.product_metrics?.find(
                            m => m.type === 'heart' && m.name.toLowerCase() === metricType.toLowerCase()
                          )
                          return (
                            <div 
                              key={metricType}
                              className="p-3 bg-[var(--color-background-subtle)] rounded-lg border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors"
                            >
                              <div className="text-xs font-medium text-[var(--color-primary)] mb-1">
                                {metricType.charAt(0)}
                              </div>
                              <div className="text-sm">
                                {metric?.value || '-'}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 px-4 border-2 border-dashed border-[var(--color-border)] rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-background-subtle)] flex items-center justify-center mb-3">
                    <Lightbulb className="w-6 h-6 text-[var(--color-text-secondary)]" />
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] text-center">
                    A visão do produto ajuda a alinhar o time e guiar as decisões.
                    <br />
                    Defina uma visão clara para seu produto.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => router.push(`/products/${product.id}/edit`)}
                  >
                    Definir Visão
                  </Button>
                </div>
              )}
            </Card>

            {/* Riscos */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <h2 className="text-base font-medium">Riscos e Mitigações</h2>
                  {product.product_risks && product.product_risks.length > 0 && (
                    <Badge variant="secondary" className="text-[10px]">
                      {product.product_risks.length} {product.product_risks.length === 1 ? 'risco' : 'riscos'}
                    </Badge>
                  )}
                </div>
              </div>
              {renderRisks(product.product_risks)}
            </Card>
          </div>

          {/* Sidebar - 1/3 */}
          <div className="space-y-6">
            {/* Informações */}
            <Card className="p-6">
              <h2 className="text-base font-medium mb-6 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[var(--color-primary)]" />
                Informações
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-[var(--color-background-subtle)] rounded-lg border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-violet-500" />
                    <span className="text-sm">Time</span>
                  </div>
                  <span className="text-sm font-medium">{product.team?.length || 0} membros</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[var(--color-background-subtle)] rounded-lg border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span className="text-sm">Riscos</span>
                  </div>
                  <span className="text-sm font-medium">{product.risks_count || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[var(--color-background-subtle)] rounded-lg border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors">
                  <div className="flex items-center gap-2">
                    <LineChart className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Métricas</span>
                  </div>
                  <span className="text-sm font-medium">{product.metrics_count || 0}</span>
                </div>
              </div>
            </Card>

            {/* Tags */}
            <Card className="p-6">
              <h2 className="text-base font-medium mb-6 flex items-center gap-2">
                <TagIcon className="w-4 h-4 text-[var(--color-primary)]" />
                Tags
              </h2>
              {product.tags && product.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map(tag => (
                    <Badge 
                      key={tag.id} 
                      variant="secondary"
                      className="hover:bg-[var(--color-background-subtle)] transition-colors"
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Nenhuma tag adicionada
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <Dialog open={showVisionDialog} onOpenChange={setShowVisionDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Visão do Produto
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {product.vision ? (
              <div className="space-y-6">
                {/* Framework de Visão */}
                <div className="space-y-4">
                  {/* Para */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[var(--color-primary)]">Para</span>
                      <Badge variant="secondary" className="text-xs">Público-alvo</Badge>
                    </div>
                    <p className="text-sm p-3 bg-[var(--color-background-subtle)] rounded-lg">
                      {product.target_audience}
                    </p>
                  </div>

                  {/* Que */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[var(--color-primary)]">Que</span>
                      <Badge variant="secondary" className="text-xs">Problema/Necessidade</Badge>
                    </div>
                    <p className="text-sm p-3 bg-[var(--color-background-subtle)] rounded-lg">
                      {product.vision.split('\n')[1].replace('Que ', '')}
                    </p>
                  </div>

                  {/* Nosso */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[var(--color-primary)]">Nosso</span>
                      <Badge variant="secondary" className="text-xs">Produto</Badge>
                    </div>
                    <p className="text-sm p-3 bg-[var(--color-background-subtle)] rounded-lg font-medium">
                      {product.name}
                    </p>
                  </div>

                  {/* Oferece */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[var(--color-primary)]">Oferece</span>
                      <Badge variant="secondary" className="text-xs">Solução</Badge>
                    </div>
                    <p className="text-sm p-3 bg-[var(--color-background-subtle)] rounded-lg">
                      {product.vision.split('\n')[3].replace('Oferece ', '')}
                    </p>
                  </div>
                </div>

                {/* Métricas HEART */}
                {product.product_metrics?.some(m => m.type === 'heart') && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-sm font-semibold">Métricas HEART</h3>
                      <Badge variant="secondary" className="text-xs">Framework de Métricas de UX</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {product.product_metrics
                        .filter(metric => metric.type === 'heart')
                        .map((metric, index) => (
                          <div 
                            key={index}
                            className="p-3 bg-[var(--color-background-subtle)] rounded-lg"
                          >
                            <div className="text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                              {metric.name}
                            </div>
                            <div className="text-sm">
                              {metric.value}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-[var(--color-text-secondary)]">
                Nenhuma visão definida para este produto.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showMetricsDialog} onOpenChange={setShowMetricsDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Métricas do Produto</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {renderMetrics(product.product_metrics)}
          </div>
        </DialogContent>
      </Dialog>

      <ProductTagsDialog
        productId={product.id}
        open={showTagsDialog}
        onOpenChange={setShowTagsDialog}
        currentTags={product.tags || []}
      />
    </div>
  )
} 