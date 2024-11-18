'use client'

import { useProducts } from '@/hooks/use-products'
import { useFeatures } from '@/hooks/use-features'
import { usePersonas } from '@/hooks/use-personas'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Target, 
  Users,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ArrowRight,
  Plus,
  ListTodo,
  GitBranch,
  Lightbulb,
  LineChart,
  Package
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { format, subDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ProductAvatar } from '@/components/products/product-avatar'
import { ProductStatusBadge } from '@/components/products/product-status-badge'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
  const router = useRouter()
  const { products, isLoading: isLoadingProducts } = useProducts()
  const { features, isLoading: isLoadingFeatures } = useFeatures()
  const { personas, isLoading: isLoadingPersonas } = usePersonas()

  // Métricas Gerais
  const metrics = {
    products: {
      total: products?.length || 0,
      active: products?.filter(p => p.status === 'active').length || 0,
      development: products?.filter(p => p.status === 'development').length || 0,
      withRisks: products?.filter(p => p.risks_count && p.risks_count > 0).length || 0,
      recentlyCreated: products?.filter(p => {
        const createdAt = new Date(p.created_at)
        return createdAt > subDays(new Date(), 30)
      }).length || 0
    },
    features: {
      total: features?.length || 0,
      backlog: features?.filter(f => f.status === 'backlog').length || 0,
      inProgress: features?.filter(f => f.status === 'doing').length || 0,
      completed: features?.filter(f => f.status === 'done').length || 0,
      blocked: features?.filter(f => f.status === 'blocked').length || 0,
      highPriority: features?.filter(f => f.priority === 'high').length || 0
    },
    personas: personas?.length || 0
  }

  // Produtos Recentes
  const recentProducts = products
    ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3)

  // Features Prioritárias
  const priorityFeatures = features
    ?.filter(f => f.priority === 'high' && f.status !== 'done')
    .slice(0, 3)

  if (isLoadingProducts || isLoadingFeatures || isLoadingPersonas) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-[var(--color-text-secondary)]">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Boas-vindas */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Bem-vindo ao Produtivo
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            Gerencie seus produtos digitais com excelência
          </p>
        </div>
        <Button
          onClick={() => router.push('/products/new')}
          className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-4 gap-6">
        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[var(--color-text-secondary)] text-sm">Produtos Ativos</p>
              <p className="text-3xl font-semibold mt-2">{metrics.products.active}</p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-500/8">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="secondary" className="text-xs">
              +{metrics.products.recentlyCreated} no último mês
            </Badge>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[var(--color-text-secondary)] text-sm">Features Ativas</p>
              <p className="text-3xl font-semibold mt-2">{metrics.features.inProgress}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500/8">
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="secondary" className="text-xs">
              {metrics.features.highPriority} alta prioridade
            </Badge>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[var(--color-text-secondary)] text-sm">Features Concluídas</p>
              <p className="text-3xl font-semibold mt-2">{metrics.features.completed}</p>
            </div>
            <div className="p-3 rounded-lg bg-violet-500/8">
              <CheckCircle2 className="w-5 h-5 text-violet-500" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="secondary" className="text-xs">
              {((metrics.features.completed / metrics.features.total) * 100).toFixed(0)}% do total
            </Badge>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[var(--color-text-secondary)] text-sm">Personas</p>
              <p className="text-3xl font-semibold mt-2">{metrics.personas}</p>
            </div>
            <div className="p-3 rounded-lg bg-amber-500/8">
              <Users className="w-5 h-5 text-amber-500" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="secondary" className="text-xs">
              {(metrics.personas / metrics.products.total).toFixed(1)} por produto
            </Badge>
          </div>
        </Card>
      </div>

      {/* Seções Principais */}
      <div className="grid grid-cols-2 gap-6">
        {/* Produtos Recentes */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Package className="w-5 h-5 text-[var(--color-primary)]" />
              Produtos Recentes
            </h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.push('/products')}
              className="text-xs"
            >
              Ver todos
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="space-y-4">
            {recentProducts?.map(product => (
              <div 
                key={product.id}
                className="flex items-center gap-4 p-4 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors cursor-pointer"
                onClick={() => router.push(`/products/${product.id}`)}
              >
                <ProductAvatar
                  className="w-10 h-10 rounded-lg border border-[var(--color-border)]"
                  src={product.avatar_url}
                >
                  {product.name.substring(0, 2).toUpperCase()}
                </ProductAvatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium truncate">
                      {product.name}
                    </h3>
                    <ProductStatusBadge status={product.status} />
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                    Criado em {format(new Date(product.created_at), "dd MMM, yy", { locale: ptBR })}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs text-[var(--color-text-secondary)]">
                  <div className="flex items-center gap-1">
                    <ListTodo className="w-4 h-4" />
                    <span>{features?.filter(f => f.product_id === product.id).length || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{product.risks_count || 0}</span>
                  </div>
                </div>
              </div>
            ))}

            {recentProducts?.length === 0 && (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-[var(--color-background-subtle)] flex items-center justify-center mx-auto mb-3">
                  <Package className="w-6 h-6 text-[var(--color-text-secondary)]" />
                </div>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Nenhum produto criado ainda
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/products/new')}
                  className="mt-4"
                >
                  Criar Produto
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Features Prioritárias */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Target className="w-5 h-5 text-[var(--color-primary)]" />
              Features Prioritárias
            </h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.push('/features')}
              className="text-xs"
            >
              Ver todas
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="space-y-4">
            {priorityFeatures?.map(feature => (
              <div 
                key={feature.id}
                className="p-4 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors cursor-pointer"
                onClick={() => router.push(`/features/${feature.id}`)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-medium">
                    {feature.title}
                  </h3>
                  <Badge variant="secondary" className={cn(
                    "text-xs",
                    feature.status === 'blocked' && "bg-red-100 text-red-700",
                    feature.status === 'doing' && "bg-blue-100 text-blue-700"
                  )}>
                    {feature.status}
                  </Badge>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2 mb-3">
                  {feature.description.what}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-red-100 text-red-700">
                      Alta Prioridade
                    </Badge>
                    {feature.moscow_priority && (
                      <Badge variant="secondary">
                        {feature.moscow_priority.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                  <span className="text-[var(--color-text-secondary)]">
                    {format(new Date(feature.created_at), "dd MMM, yy", { locale: ptBR })}
                  </span>
                </div>
              </div>
            ))}

            {priorityFeatures?.length === 0 && (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-[var(--color-background-subtle)] flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-[var(--color-text-secondary)]" />
                </div>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Nenhuma feature prioritária
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/features/new')}
                  className="mt-4"
                >
                  Criar Feature
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Links Rápidos */}
      <div className="grid grid-cols-4 gap-6">
        {[
          {
            title: 'Roadmap',
            description: 'Visualize o planejamento do produto',
            icon: GitBranch,
            href: '/roadmap',
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/8'
          },
          {
            title: 'Priorização',
            description: 'Priorize features com RICE e MoSCoW',
            icon: Target,
            href: '/prioritization',
            color: 'text-violet-500',
            bgColor: 'bg-violet-500/8'
          },
          {
            title: 'Discovery',
            description: 'Gerencie personas e pesquisas',
            icon: Lightbulb,
            href: '/personas',
            color: 'text-amber-500',
            bgColor: 'bg-amber-500/8'
          },
          {
            title: 'Métricas',
            description: 'Acompanhe KPIs e resultados',
            icon: LineChart,
            href: '/metrics',
            color: 'text-emerald-500',
            bgColor: 'bg-emerald-500/8'
          }
        ].map(item => (
          <Card
            key={item.title}
            className="p-6 cursor-pointer hover:shadow-md transition-all"
            onClick={() => router.push(item.href)}
          >
            <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mb-4", item.bgColor)}>
              <item.icon className={cn("w-6 h-6", item.color)} />
            </div>
            <h3 className="text-sm font-medium mb-1">{item.title}</h3>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {item.description}
            </p>
          </Card>
        ))}
      </div>
    </div>
  )
} 