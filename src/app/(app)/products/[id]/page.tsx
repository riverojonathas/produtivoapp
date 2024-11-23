'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { use } from 'react'
import { useProducts } from '@/hooks/use-products'
import { PageContainer, PageHeader, PageContent } from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/animated-tabs"
import { ProductNameEdit } from '@/components/products/product-name-edit'
import { ProductAvatarUpload } from '@/components/products/product-avatar-upload'
import { ProductStatusBadge } from '@/components/products/product-status-badge'
import { ProductRiskDialog } from '@/components/products/product-risk-dialog'
import { ProductTagsDialog } from '@/components/products/product-tags-dialog'
import { ProductStatusDialog } from '@/components/products/product-status-dialog'
import { ProductRisksTab } from '@/components/products/risks/product-risks-tab'
import { AnimatedCard, AnimatedList, AnimatedListItem } from '@/components/ui/animated-card'
import { animations } from '@/config/theme'
import { 
  IProduct, 
  IProductRisk, 
  RiskCategory, 
  ProductStatus,
  ITeamMember,
  IProductMetric,
  ITag
} from '@/types/product'
import { ProductVisionDialog } from '@/components/products/product-vision-dialog'
import { ProductMetricsDialog } from '@/components/products/product-metrics-dialog'
import { ProductTeamDialog } from '@/components/products/product-team-dialog'
import { TrendIndicator } from '@/components/products/trend-indicator'

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import {
  ArrowLeft, 
  Tag as TagIcon,
  Files,
  Pencil,
  Trash2,
  Lightbulb,
  Eye,
  AlertTriangle,
  LineChart,
  BarChart3,
  Users as UsersIcon,
  UserPlus,
  Shield,
  Star,
  Mail,
  Plus,
  Heart,
  Target
} from 'lucide-react'

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const router = useRouter()
  const resolvedParams = use(params)
  const { 
    product, 
    isLoading, 
    risks,
    isLoadingRisks,
    removeRisk,
    deleteProduct,
    removeTeamMember
  } = useProducts(resolvedParams.id)
  const [showVisionDialog, setShowVisionDialog] = useState(false)
  const [showMetricsDialog, setShowMetricsDialog] = useState(false)
  const [showTagsDialog, setShowTagsDialog] = useState(false)
  const [showRiskDialog, setShowRiskDialog] = useState(false)
  const [selectedRiskCategory, setSelectedRiskCategory] = useState<RiskCategory | undefined>()
  const [selectedRisk, setSelectedRisk] = useState<IProductRisk | undefined>()
  const [activeTab, setActiveTab] = useState('overview')
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [showTeamDialog, setShowTeamDialog] = useState(false)
  const [selectedMember, setSelectedMember] = useState<ITeamMember | undefined>()
  const [showKPIDialog, setShowKPIDialog] = useState(false)

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

  const tags = product.tags || []

  const handleDelete = async () => {
    try {
      await deleteProduct.mutateAsync(product.id)
      router.push('/products')
    } catch (error) {
      console.error('Erro ao excluir produto:', error)
    }
  }

  const handleDuplicate = () => {
    router.push(`/products/new?duplicate=${product.id}`)
  }

  const handleEditMember = (member: ITeamMember) => {
    setSelectedMember(member)
    setShowTeamDialog(true)
  }

  const handleRemoveMember = async (member: ITeamMember) => {
    try {
      await removeTeamMember.mutateAsync({
        productId: product.id,
        memberId: member.id
      })
    } catch (error) {
      console.error('Erro ao remover membro:', error)
    }
  }

  const handleAddRisk = (category: RiskCategory) => {
    setSelectedRiskCategory(category)
    setShowRiskDialog(true)
  }

  const handleEditRisk = (risk: IProductRisk) => {
    setSelectedRisk(risk)
    setShowRiskDialog(true)
  }

  const handleRemoveRisk = async (risk: IProductRisk) => {
    try {
      await removeRisk.mutateAsync({
        productId: product.id,
        riskId: risk.id
      })
    } catch (error) {
      console.error('Erro ao remover risco:', error)
    }
  }

  return (
    <PageContainer>
      <PageHeader>
        {/* Header minimalista */}
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
              <ProductAvatarUpload
                productId={product.id}
                name={product.name}
                currentUrl={product.avatar_url}
              />

              <div className="flex items-center gap-3">
                <ProductNameEdit
                  productId={product.id}
                  initialName={product.name}
                />
                <button 
                  onClick={() => setShowStatusDialog(true)}
                  className="hover:opacity-80 transition-opacity"
                  aria-label="Alterar status do produto"
                >
                  <ProductStatusBadge status={product.status} />
                </button>
              </div>
            </div>
          </div>

          {/* Lado Direito - Ações */}
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setShowTagsDialog(true)}
                    aria-label="Gerenciar tags"
                  >
                    <TagIcon className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Gerenciar tags</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={handleDuplicate}
                    aria-label="Duplicar produto"
                  >
                    <Files className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Duplicar produto</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => router.push(`/products/${product.id}/edit`)}
                    aria-label="Editar produto"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Editar produto</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                    onClick={handleDelete}
                    aria-label="Excluir produto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Excluir produto</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </PageHeader>

      <Tabs defaultValue="overview" className="flex-1">
        <div className="border-t border-[var(--color-border)]">
          <TabsList className="h-10 -mb-px bg-transparent border-0 p-0 ml-[104px]">
            <TabsTrigger 
              value="overview"
              className="relative h-10 px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none text-sm font-medium text-[var(--color-text-secondary)] data-[state=active]:text-[var(--color-text-primary)] transition-colors"
            >
              Visão Geral
            </TabsTrigger>
            <TabsTrigger 
              value="metrics"
              className="relative h-10 px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none text-sm font-medium text-[var(--color-text-secondary)] data-[state=active]:text-[var(--color-text-primary)] transition-colors"
            >
              Métricas
            </TabsTrigger>
            <TabsTrigger 
              value="team"
              className="relative h-10 px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none text-sm font-medium text-[var(--color-text-secondary)] data-[state=active]:text-[var(--color-text-primary)] transition-colors"
            >
              Time
            </TabsTrigger>
            <TabsTrigger 
              value="risks"
              className="relative h-10 px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none text-sm font-medium text-[var(--color-text-secondary)] data-[state=active]:text-[var(--color-text-primary)] transition-colors"
            >
              Riscos
            </TabsTrigger>
          </TabsList>
        </div>

        <PageContent>
          <TabsContent value="overview">
            <AnimatedList>
              {/* Visão Geral - 8 colunas */}
              <div className="grid grid-cols-12 gap-6">
                {/* Visão Geral - 8 colunas */}
                <div className="col-span-8 space-y-6">
                  {/* Card de Visão */}
                  <AnimatedCard className="overflow-hidden">
                    <div className="p-6 bg-gradient-to-br from-blue-500/5 to-purple-500/5">
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
                        {product.vision && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowVisionDialog(true)}
                            className="bg-white/50 backdrop-blur-sm"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Detalhes
                          </Button>
                        )}
                      </div>

                      {product.vision ? (
                        <div className="p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-[var(--color-border)]">
                          <p className="text-sm leading-relaxed">
                            Para <span className="text-[var(--color-primary)] font-medium">{product.target_audience}</span>,
                            <br />
                            que {product.vision.split('\n')[1].replace('Que ', '')},
                            <br />
                            nosso <span className="text-[var(--color-primary)] font-medium">{product.name}</span>
                            <br />
                            {product.vision.split('\n')[3].replace('Oferece ', '')}.
                          </p>
                        </div>
                      ) : (
                        <div className="text-center p-8">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/products/${product.id}/edit`)}
                            className="bg-white/50 backdrop-blur-sm"
                          >
                            Definir Visão
                          </Button>
                        </div>
                      )}
                    </div>
                  </AnimatedCard>

                  {/* Card de Métricas HEART */}
                  {product.product_metrics?.some((m: IProductMetric) => m.type === 'heart') && (
                    <AnimatedCard className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-sm font-medium">Framework HEART</h3>
                        <Badge variant="secondary" className="text-[10px]">
                          Métricas de UX
                        </Badge>
                      </div>
                      <div className="grid grid-cols-5 gap-3">
                        {['Happiness', 'Engagement', 'Adoption', 'Retention', 'Task Success'].map(metricType => {
                          const metric = product.product_metrics?.find(
                            (m: IProductMetric) => m.type === 'heart' && m.name.toLowerCase() === metricType.toLowerCase()
                          )
                          return (
                            <AnimatedListItem 
                              key={metricType}
                              className="group p-3 bg-[var(--color-background-subtle)] rounded-lg border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all hover:shadow-sm"
                            >
                              <div className="text-xs font-medium text-[var(--color-primary)] mb-1 opacity-60 group-hover:opacity-100">
                                {metricType.charAt(0)}
                              </div>
                              <div className="text-sm">
                                {metric?.value || '-'}
                              </div>
                            </AnimatedListItem>
                          )
                        })}
                      </div>
                    </AnimatedCard>
                  )}
                </div>

                {/* Sidebar - 4 colunas */}
                <div className="col-span-4 space-y-6">
                  {/* Card de Informações */}
                  <AnimatedCard className="p-6">
                    <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-[var(--color-primary)]" />
                      Informações
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-[var(--color-background-subtle)] rounded-lg hover:bg-[var(--color-background-subtle)]/80 transition-colors">
                        <div className="flex items-center gap-2">
                          <UsersIcon className="w-4 h-4 text-violet-500" />
                          <span className="text-sm">Time</span>
                        </div>
                        <span className="text-sm font-medium">{product.team?.length || 0} membros</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-[var(--color-background-subtle)] rounded-lg hover:bg-[var(--color-background-subtle)]/80 transition-colors">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                          <span className="text-sm">Riscos</span>
                        </div>
                        <span className="text-sm font-medium">{product.risks_count || 0}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-[var(--color-background-subtle)] rounded-lg hover:bg-[var(--color-background-subtle)]/80 transition-colors">
                        <div className="flex items-center gap-2">
                          <LineChart className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">Métricas</span>
                        </div>
                        <span className="text-sm font-medium">{product.metrics_count || 0}</span>
                      </div>
                    </div>
                  </AnimatedCard>

                  {/* Card de Tags */}
                  <AnimatedCard className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium flex items-center gap-2">
                        <TagIcon className="w-4 h-4 text-[var(--color-primary)]" />
                        Tags
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowTagsDialog(true)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {product.tags?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag: ITag) => (
                          <Badge 
                            key={tag.id}
                            variant="secondary"
                            className={`${tag.color || ''} hover:bg-[var(--color-background-subtle)] transition-colors`}
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
                  </AnimatedCard>
                </div>
              </div>
            </AnimatedList>
          </TabsContent>

          <TabsContent value="metrics">
            <AnimatedList>
              <div className="grid grid-cols-12 gap-6">
                {/* Métricas Principais - 8 colunas */}
                <div className="col-span-8 space-y-6">
                  {/* HEART Framework */}
                  <AnimatedCard className="overflow-hidden">
                    <div className="p-6 bg-gradient-to-br from-pink-500/5 to-red-500/5">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h2 className="text-base font-medium flex items-center gap-2">
                            <Heart className="w-4 h-4 text-pink-500" />
                            Framework HEART
                          </h2>
                          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                            Métricas centradas no usuário
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowMetricsDialog(true)}
                          className="bg-white/50 backdrop-blur-sm"
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          Editar Métricas
                        </Button>
                      </div>

                      <div className="grid grid-cols-5 gap-4">
                        {['Happiness', 'Engagement', 'Adoption', 'Retention', 'Task Success'].map(metricType => {
                          const metric = product.product_metrics?.find(
                            (m: IProductMetric) => m.type === 'heart' && m.name.toLowerCase() === metricType.toLowerCase()
                          )
                          return (
                            <AnimatedListItem 
                              key={metricType}
                              className="group p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-[var(--color-border)] hover:border-pink-500/30 transition-all"
                            >
                              <div className="text-xs font-medium text-pink-500/70 mb-2 group-hover:text-pink-500">
                                {metricType}
                              </div>
                              <div className="text-2xl font-semibold">
                                {metric?.value || '-'}
                              </div>
                            </AnimatedListItem>
                          )
                        })}
                      </div>
                    </div>
                  </AnimatedCard>

                  {/* North Star */}
                  <AnimatedCard className="overflow-hidden">
                    <div className="p-6 bg-gradient-to-br from-purple-500/5 to-blue-500/5">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h2 className="text-base font-medium flex items-center gap-2">
                            <Target className="w-4 h-4 text-purple-500" />
                            Métrica North Star
                          </h2>
                          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                            Métrica principal do produto
                          </p>
                        </div>
                      </div>

                      {product.product_metrics?.some((m: IProductMetric) => m.type === 'north_star') ? (
                        <div className="space-y-4">
                          {['metric', 'target', 'signals', 'actions', 'rationale'].map(key => {
                            const metricValue = product.product_metrics?.find(
                              (m: IProductMetric) => m.type === 'north_star' && m.name === key
                            )

                            return (
                              <AnimatedListItem 
                                key={key}
                                className="p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-[var(--color-border)]"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium capitalize text-purple-500/70">
                                    {key === 'metric' ? 'Métrica' :
                                     key === 'target' ? 'Meta' :
                                     key === 'signals' ? 'Sinais' :
                                     key === 'actions' ? 'Ações' :
                                     'Justificativa'}
                                  </span>
                                </div>
                                <p className="text-sm">
                                  {metricValue?.value || 'Não definido'}
                                </p>
                              </AnimatedListItem>
                            )
                          })}
                        </div>
                      ) : (
                        <div className="text-center p-8">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowMetricsDialog(true)}
                            className="bg-white/50 backdrop-blur-sm"
                          >
                            Definir Métrica North Star
                          </Button>
                        </div>
                      )}
                    </div>
                  </AnimatedCard>
                </div>

                {/* KPIs - 4 colunas */}
                <div className="col-span-4 space-y-6">
                  <AnimatedCard className="p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h2 className="text-base font-medium flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-[var(--color-primary)]" />
                          KPIs
                        </h2>
                        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                          Indicadores chave de performance
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowKPIDialog(true)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar KPI
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {product.product_metrics?.filter((m: IProductMetric) => m.type === 'kpi')
                        .map((kpi: IProductMetric, index: number) => (
                          <AnimatedListItem 
                            key={index}
                            className="p-4 bg-[var(--color-background-subtle)] rounded-lg border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">{kpi.name}</span>
                              <TrendIndicator value={kpi.value} />
                            </div>
                            <p className="text-2xl font-semibold">{kpi.value}</p>
                          </AnimatedListItem>
                        ))}

                      {!product.product_metrics?.some((m: IProductMetric) => m.type === 'kpi') && (
                        <div className="text-center p-6 border-2 border-dashed border-[var(--color-border)] rounded-lg">
                          <p className="text-sm text-[var(--color-text-secondary)]">
                            Nenhum KPI definido ainda
                          </p>
                        </div>
                      )}
                    </div>
                  </AnimatedCard>
                </div>
              </div>
            </AnimatedList>
          </TabsContent>

          <TabsContent value="team">
            <AnimatedList>
              <div className="grid grid-cols-12 gap-6">
                {/* Time Principal - 8 colunas */}
                <div className="col-span-8 space-y-6">
                  {/* Lista de Membros */}
                  <AnimatedCard className="overflow-hidden">
                    <div className="p-6 bg-gradient-to-br from-violet-500/5 to-indigo-500/5">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h2 className="text-base font-medium flex items-center gap-2">
                            <UsersIcon className="w-4 h-4 text-violet-500" />
                            Time do Produto
                          </h2>
                          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                            {product.team?.length 
                              ? `${product.team.length} membros no time`
                              : 'Nenhum membro no time ainda'}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowTeamDialog(true)}
                          className="bg-white/50 backdrop-blur-sm"
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Adicionar Membro
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {product.team?.map((member: ITeamMember) => (
                          <AnimatedListItem 
                            key={member.id}
                            className="group p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-[var(--color-border)] hover:border-violet-500/30 transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-500 text-white">
                                  {member.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <h3 className="text-sm font-medium truncate">{member.name}</h3>
                                  {member.role === 'owner' && (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger>
                                          <Shield className="w-3.5 h-3.5 text-violet-500" />
                                        </TooltipTrigger>
                                        <TooltipContent>Product Owner</TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                  {member.role === 'manager' && (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger>
                                          <Star className="w-3.5 h-3.5 text-amber-500" />
                                        </TooltipTrigger>
                                        <TooltipContent>Product Manager</TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                                  <Mail className="w-3.5 h-3.5" />
                                  <span className="truncate">{member.email}</span>
                                </div>
                              </div>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={() => handleEditMember(member)}
                                      >
                                        <Pencil className="w-4 h-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Editar membro</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                          </AnimatedListItem>
                        ))}

                        {!product.team?.length && (
                          <div className="col-span-2 text-center p-8 border-2 border-dashed border-[var(--color-border)] rounded-lg">
                            <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center mx-auto mb-3">
                              <UsersIcon className="w-6 h-6 text-violet-500" />
                            </div>
                            <p className="text-sm text-[var(--color-text-secondary)]">
                              Nenhum membro adicionado ao time ainda.
                              <br />
                              Adicione membros para colaborar no produto.
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowTeamDialog(true)}
                              className="mt-4"
                            >
                              <UserPlus className="w-4 h-4 mr-2" />
                              Adicionar Primeiro Membro
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </AnimatedCard>
                </div>

                {/* Papéis e Responsabilidades - 4 colunas */}
                <div className="col-span-4 space-y-6">
                  <AnimatedCard className="p-6">
                    <h3 className="text-sm font-medium mb-4">Papéis e Responsabilidades</h3>
                    <div className="space-y-3">
                      {[
                        {
                          role: 'owner',
                          title: 'Product Owner',
                          icon: Shield,
                          color: 'text-violet-500',
                          bgColor: 'bg-violet-500/10',
                          description: 'Responsável pela visão do produto e priorização do backlog'
                        },
                        {
                          role: 'manager',
                          title: 'Product Manager',
                          icon: Star,
                          color: 'text-amber-500',
                          bgColor: 'bg-amber-500/10',
                          description: 'Gerencia o desenvolvimento e estratégia do produto'
                        },
                        {
                          role: 'member',
                          title: 'Team Member',
                          icon: UsersIcon,
                          color: 'text-blue-500',
                          bgColor: 'bg-blue-500/10',
                          description: 'Contribui com o desenvolvimento e evolução do produto'
                        }
                      ].map(role => (
                        <AnimatedListItem 
                          key={role.role}
                          className="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-background-subtle)]"
                        >
                          <div className={`p-2 rounded-lg ${role.bgColor}`}>
                            <role.icon className={`w-4 h-4 ${role.color}`} />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">{role.title}</h4>
                            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                              {role.description}
                            </p>
                          </div>
                        </AnimatedListItem>
                      ))}
                    </div>
                  </AnimatedCard>
                </div>
              </div>
            </AnimatedList>
          </TabsContent>

          <TabsContent value="risks">
            {product && !isLoadingRisks && (
              <ProductRisksTab
                product={product}
                onAddRisk={(category: RiskCategory) => {
                  setSelectedRiskCategory(category)
                  setShowRiskDialog(true)
                }}
                onEditRisk={(risk: IProductRisk) => {
                  setSelectedRisk(risk)
                  setShowRiskDialog(true)
                }}
                onRemoveRisk={handleRemoveRisk}
              />
            )}
          </TabsContent>
        </PageContent>
      </Tabs>

      {/* Dialogs */}
      <ProductVisionDialog
        product={product}
        open={showVisionDialog}
        onOpenChange={setShowVisionDialog}
      />

      <ProductRiskDialog
        productId={product.id}
        open={showRiskDialog}
        onOpenChange={(open) => {
          setShowRiskDialog(open)
          if (!open) {
            setSelectedRisk(undefined)
            setSelectedRiskCategory(undefined)
          }
        }}
        risk={selectedRisk}
        initialCategory={selectedRiskCategory}
      />

      <ProductTagsDialog
        productId={product.id}
        open={showTagsDialog}
        onOpenChange={setShowTagsDialog}
        currentTags={product.tags}
      />

      {/* Adicionar o diálogo de status */}
      <ProductStatusDialog
        productId={product.id}
        currentStatus={product.status as ProductStatus}
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
      />

      {/* Outros dialogs... */}
      <ProductMetricsDialog
        productId={product.id}
        open={showMetricsDialog}
        onOpenChange={setShowMetricsDialog}
        currentMetrics={product.product_metrics}
      />

      <ProductTeamDialog
        productId={product.id}
        open={showTeamDialog}
        onOpenChange={(open) => {
          setShowTeamDialog(open)
          if (!open) setSelectedMember(undefined)
        }}
        member={selectedMember}
      />
    </PageContainer>
  )
} 