'use client'

import { useState } from 'react'
import { useFeatures } from '@/hooks/use-features'
import { useProducts } from '@/hooks/use-products'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Ban,
  TrendingUp,
  Target,
  Calendar,
  GitPullRequest
} from 'lucide-react'

const COLORS = {
  done: '#10B981',
  doing: '#3B82F6',
  blocked: '#EF4444',
  backlog: '#6B7280',
  high: '#DC2626',
  medium: '#F59E0B',
  low: '#10B981'
}

export default function AnalyticsPage() {
  const { products } = useProducts()
  const [selectedProductId, setSelectedProductId] = useState<string>()
  const { features } = useFeatures()

  // Métricas de Status
  const statusMetrics = features?.reduce((acc, feature) => {
    acc[feature.status] = (acc[feature.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const statusData = Object.entries(statusMetrics || {}).map(([name, value]) => ({
    name,
    value
  }))

  // Métricas de Prioridade
  const priorityMetrics = features?.reduce((acc, feature) => {
    acc[feature.priority] = (acc[feature.priority] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const priorityData = Object.entries(priorityMetrics || {}).map(([name, value]) => ({
    name,
    value
  }))

  // Métricas de RICE Score
  const riceData = features
    ?.filter(f => f.rice_score)
    .sort((a, b) => (b.rice_score || 0) - (a.rice_score || 0))
    .slice(0, 5)
    .map(feature => ({
      name: feature.title,
      score: feature.rice_score
    }))

  // Cálculo de Tempo Médio
  const completedFeatures = features?.filter(f => f.status === 'done') || []
  const averageCompletionTime = completedFeatures.length > 0
    ? completedFeatures.reduce((acc, feature) => {
        const start = new Date(feature.start_date || 0)
        const end = new Date(feature.end_date || 0)
        return acc + (end.getTime() - start.getTime())
      }, 0) / completedFeatures.length / (1000 * 60 * 60 * 24) // Convertendo para dias
    : 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
          Analytics
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Análise de desempenho do produto
        </p>
      </div>

      {/* Seletor de Produto */}
      <div className="w-64">
        <Select
          value={selectedProductId}
          onValueChange={setSelectedProductId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um produto" />
          </SelectTrigger>
          <SelectContent>
            {products?.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Features Concluídas
              </p>
              <p className="text-2xl font-semibold mt-1">
                {completedFeatures.length}
              </p>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Em Progresso
              </p>
              <p className="text-2xl font-semibold mt-1">
                {features?.filter(f => f.status === 'doing').length || 0}
              </p>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Bloqueadas
              </p>
              <p className="text-2xl font-semibold mt-1">
                {features?.filter(f => f.status === 'blocked').length || 0}
              </p>
            </div>
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Tempo Médio
              </p>
              <p className="text-2xl font-semibold mt-1">
                {averageCompletionTime.toFixed(1)} dias
              </p>
            </div>
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-6">Distribuição por Status</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {statusData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[entry.name as keyof typeof COLORS]} 
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Priority Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-6">Distribuição por Prioridade</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {priorityData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[entry.name as keyof typeof COLORS]} 
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* RICE Score Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-6">Top 5 RICE Score</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
} 