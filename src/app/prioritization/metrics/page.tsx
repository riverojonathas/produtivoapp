'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { FilterBar } from "@/components/common/FilterBar";
import {
  SignalIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";

interface ValueMetric {
  id: string;
  name: string;
  description: string;
  category: 'revenue' | 'engagement' | 'satisfaction' | 'performance';
  currentValue: number;
  previousValue: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'neutral';
  features: string[];
  updateFrequency: string;
  lastUpdate: string;
}

const mockMetrics: ValueMetric[] = [
  {
    id: '1',
    name: 'Taxa de Conversão',
    description: 'Percentual de usuários que completam a ação desejada',
    category: 'engagement',
    currentValue: 15.8,
    previousValue: 12.3,
    target: 20,
    unit: '%',
    trend: 'up',
    features: ['Onboarding Simplificado', 'Página de Produto Otimizada'],
    updateFrequency: 'Diária',
    lastUpdate: '2024-03-15'
  },
  {
    id: '2',
    name: 'Receita Média por Usuário',
    description: 'Valor médio gerado por usuário ativo',
    category: 'revenue',
    currentValue: 89.5,
    previousValue: 85.2,
    target: 100,
    unit: 'R$',
    trend: 'up',
    features: ['Recomendações Personalizadas', 'Programa de Fidelidade'],
    updateFrequency: 'Mensal',
    lastUpdate: '2024-03-01'
  }
];

const filters = [
  {
    id: 'category',
    label: 'Categoria',
    options: ['Receita', 'Engajamento', 'Satisfação', 'Performance']
  },
  {
    id: 'trend',
    label: 'Tendência',
    options: ['Crescimento', 'Queda', 'Estável']
  }
];

export default function ValueMetricsPage() {
  const [metrics] = useState<ValueMetric[]>(mockMetrics);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'revenue':
        return <CurrencyDollarIcon className="w-5 h-5 text-green-500" />;
      case 'engagement':
        return <UsersIcon className="w-5 h-5 text-blue-500" />;
      case 'satisfaction':
        return <ChartBarIcon className="w-5 h-5 text-yellow-500" />;
      case 'performance':
        return <SignalIcon className="w-5 h-5 text-purple-500" />;
      default:
        return null;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowTrendingUpIcon className="w-5 h-5 text-green-500" />;
      case 'down':
        return <ArrowTrendingDownIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ArrowPathIcon className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getProgressColor = (current: number, target: number) => {
    const progress = (current / target) * 100;
    if (progress >= 90) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const formatChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Métricas de Valor
          </h1>
          <span className="text-sm text-[var(--color-text-secondary)]">
            Indicadores de Performance
          </span>
        </div>
      </div>

      <FilterBar
        filters={filters}
        onFilterChange={() => {}}
        onSearch={() => {}}
        placeholder="Buscar métricas..."
      />

      <div className="grid gap-6">
        {metrics.map((metric) => (
          <Card 
            key={metric.id}
            className="p-6 bg-[var(--color-background-elevated)]"
          >
            <div className="flex flex-col space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getCategoryIcon(metric.category)}
                    <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                      {metric.name}
                    </h2>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                    {metric.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getTrendIcon(metric.trend)}
                  <span className={`text-sm font-medium ${
                    metric.trend === 'up' ? 'text-green-500' : 
                    metric.trend === 'down' ? 'text-red-500' : 
                    'text-yellow-500'
                  }`}>
                    {formatChange(metric.currentValue, metric.previousValue)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-[var(--color-text-primary)]">
                      {metric.currentValue}{metric.unit}
                    </span>
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      Meta: {metric.target}{metric.unit}
                    </span>
                  </div>
                  <div className="h-2 bg-[var(--color-background-tertiary)] rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getProgressColor(metric.currentValue, metric.target)}`}
                      style={{ width: `${calculateProgress(metric.currentValue, metric.target)}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--color-text-secondary)]">
                      Atualização
                    </span>
                    <span className="text-[var(--color-text-primary)]">
                      {metric.updateFrequency}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--color-text-secondary)]">
                      Última Atualização
                    </span>
                    <span className="text-[var(--color-text-primary)]">
                      {new Date(metric.lastUpdate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--color-border)]">
                <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-2">
                  Features Relacionadas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {metric.features.map((feature) => (
                    <span 
                      key={feature}
                      className="px-2 py-1 text-xs rounded-full bg-[var(--color-accent-light)] text-[var(--color-primary)]"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 