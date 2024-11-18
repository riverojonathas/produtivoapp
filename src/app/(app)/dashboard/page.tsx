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
  GitBranch,
  Lightbulb,
  LineChart
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

  // Métricas Principais
  const metrics = {
    products: {
      active: products?.filter(p => p.status === 'active').length || 0,
      development: products?.filter(p => p.status === 'development').length || 0,
      recentlyCreated: products?.filter(p => {
        const createdAt = new Date(p.created_at)
        return createdAt > subDays(new Date(), 30)
      }).length || 0
    },
    features: {
      inProgress: features?.filter(f => f.status === 'doing').length || 0,
      completed: features?.filter(f => f.status === 'done').length || 0,
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
      {/* Header Hero */}
      <div className="relative -m-6 mb-6 p-6 pb-12 pt-16 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)]">
        <div className="relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-semibold text-white mb-3">
              Bem-vindo ao Produtivo
            </h1>
            <p className="text-white/80">
              Gerencie seus produtos, acompanhe métricas e tome decisões baseadas em dados.
            </p>
          </div>

          <div className="flex items-center gap-3 mt-8">
            <Button
              onClick={() => router.push('/products/new')}
              className="bg-white text-[var(--color-primary)] hover:bg-white/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Produto
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/roadmap')}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <GitBranch className="w-4 h-4 mr-2" />
              Ver Roadmap
            </Button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-l from-white/5 to-transparent" />
          <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/5" />
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-4 gap-6">
        <MetricCard
          title="Produtos Ativos"
          value={metrics.products.active}
          icon={TrendingUp}
          color="emerald"
          badge={`+${metrics.products.recentlyCreated} no último mês`}
        />
        <MetricCard
          title="Features Ativas"
          value={metrics.features.inProgress}
          icon={Clock}
          color="blue"
          badge={`${metrics.features.highPriority} alta prioridade`}
        />
        <MetricCard
          title="Features Concluídas"
          value={metrics.features.completed}
          icon={CheckCircle2}
          color="violet"
          badge={`${((metrics.features.completed / (features?.length || 1)) * 100).toFixed(0)}% do total`}
        />
        <MetricCard
          title="Personas"
          value={metrics.personas}
          icon={Users}
          color="amber"
          badge={`${(metrics.personas / (products?.length || 1)).toFixed(1)} por produto`}
        />
      </div>

      {/* Seções Principais */}
      <div className="grid grid-cols-2 gap-6">
        {/* Produtos Recentes */}
        <RecentProducts products={recentProducts} onProductClick={(id) => router.push(`/products/${id}`)} />
        
        {/* Features Prioritárias */}
        <PriorityFeatures features={priorityFeatures} onFeatureClick={(id) => router.push(`/features/${id}`)} />
      </div>
    </div>
  )
}

// Componentes auxiliares para melhor organização
function MetricCard({ title, value, icon: Icon, color, badge }: any) {
  const colors = {
    emerald: "text-emerald-500 bg-emerald-500/8",
    blue: "text-blue-500 bg-blue-500/8",
    violet: "text-violet-500 bg-violet-500/8",
    amber: "text-amber-500 bg-amber-500/8"
  }

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[var(--color-text-secondary)] text-sm">{title}</p>
          <p className="text-3xl font-semibold mt-2">{value}</p>
        </div>
        <div className={cn("p-3 rounded-lg", colors[color])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {badge && (
        <div className="mt-4">
          <Badge variant="secondary" className="text-xs">
            {badge}
          </Badge>
        </div>
      )}
    </Card>
  )
}

function RecentProducts({ products, onProductClick }: any) {
  if (!products?.length) return null
  
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Produtos Recentes</h2>
        <Button variant="ghost" size="sm" className="text-xs">
          Ver todos
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <div className="space-y-4">
        {products.map((product: any) => (
          <div 
            key={product.id}
            className="flex items-center gap-4 p-4 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors cursor-pointer"
            onClick={() => onProductClick(product.id)}
          >
            <ProductAvatar src={product.avatar_url} className="w-10 h-10">
              {product.name.substring(0, 2).toUpperCase()}
            </ProductAvatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium truncate">{product.name}</h3>
                <ProductStatusBadge status={product.status} />
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                Criado em {format(new Date(product.created_at), "dd MMM, yy", { locale: ptBR })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function PriorityFeatures({ features, onFeatureClick }: any) {
  if (!features?.length) return null

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Features Prioritárias</h2>
        <Button variant="ghost" size="sm" className="text-xs">
          Ver todas
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <div className="space-y-4">
        {features.map((feature: any) => (
          <div 
            key={feature.id}
            className="p-4 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors cursor-pointer"
            onClick={() => onFeatureClick(feature.id)}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-sm font-medium">{feature.title}</h3>
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
          </div>
        ))}
      </div>
    </Card>
  )
} 