'use client';

import { PageHeader } from '@/components/ui/page-header';
import { Section } from '@/components/ui/section';
import { MetricCard } from '@/components/ui/metric-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { FilterBar } from "@/components/common/FilterBar";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  PlusIcon,
  ChartBarIcon,
  BeakerIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  RocketLaunchIcon,
  TagIcon
} from '@heroicons/react/24/outline';

const filters = [
  {
    id: 'priority',
    label: 'Prioridade',
    options: ['Alta', 'Média', 'Baixa']
  },
  {
    id: 'status',
    label: 'Status',
    options: ['Avaliado', 'Em Análise', 'Pendente']
  },
  {
    id: 'team',
    label: 'Time',
    options: ['Product', 'Engineering', 'Design', 'Marketing']
  }
];

const scoringMatrix = [
  {
    id: '1',
    feature: 'Autenticação Social',
    description: 'Login com Google e GitHub',
    scores: {
      impact: 85,
      effort: 45,
      confidence: 90,
      reach: 75
    },
    priority: 'high',
    status: 'evaluated',
    team: 'Engineering',
    tags: ['auth', 'user-experience', 'security']
  },
  {
    id: '2',
    feature: 'Dashboard Analytics',
    description: 'Visualização de métricas em tempo real',
    scores: {
      impact: 75,
      effort: 60,
      confidence: 85,
      reach: 80
    },
    priority: 'medium',
    status: 'in_analysis',
    team: 'Product',
    tags: ['analytics', 'dashboard', 'metrics']
  }
];

export default function ScoringPage() {
  return (
    <div className="space-y-8 animate-fade">
      {/* Header com Gradiente */}
      <div className="relative -mx-6 -mt-6 px-6 pt-6 pb-8 mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-5" />
        <div className="relative z-10">
          <PageHeader
            title="Matriz de Priorização"
            subtitle="Avalie e priorize features com base em critérios objetivos"
            action={
              <button className="
                inline-flex items-center gap-2 px-4 py-2 rounded-xl
                bg-[var(--color-primary)] text-white
                hover:bg-[var(--color-primary-dark)]
                transition-colors duration-200
              ">
                <PlusIcon className="w-5 h-5" />
                <span>Nova Avaliação</span>
              </button>
            }
          />
        </div>
      </div>

      <FilterBar
        filters={filters}
        onFilterChange={() => {}}
        onSearch={() => {}}
        placeholder="Buscar features..."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Features Avaliadas"
          value="32"
          icon={<BeakerIcon className="w-5 h-5" />}
          change={{
            value: "+8",
            trend: "up",
            description: "este mês"
          }}
          className="bg-gradient-to-br from-blue-500/10 to-transparent"
        />
        <MetricCard
          title="Média de Impacto"
          value="78%"
          icon={<ChartBarIcon className="w-5 h-5" />}
          change={{
            value: "+5%",
            trend: "up",
            description: "vs. último mês"
          }}
          className="bg-gradient-to-br from-green-500/10 to-transparent"
        />
        <MetricCard
          title="Confiança"
          value="85%"
          icon={<UserGroupIcon className="w-5 h-5" />}
          change={{
            value: "+2%",
            trend: "up",
            description: "média geral"
          }}
          className="bg-gradient-to-br from-purple-500/10 to-transparent"
        />
        <MetricCard
          title="ROI Projetado"
          value="R$ 450K"
          icon={<CurrencyDollarIcon className="w-5 h-5" />}
          change={{
            value: "+15%",
            trend: "up",
            description: "estimativa"
          }}
          className="bg-gradient-to-br from-orange-500/10 to-transparent"
        />
      </div>

      <Section
        title="Matriz de Avaliação"
        description="Avaliação de features baseada em RICE Score"
        className="bg-gradient-card backdrop-blur-sm"
      >
        <div className="space-y-6">
          {scoringMatrix.map((item) => (
            <div
              key={item.id}
              className="group p-6 rounded-xl bg-[var(--color-background-tertiary)] hover:bg-[var(--color-background-elevated)] hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <RocketLaunchIcon className="w-5 h-5 text-[var(--color-primary)]" />
                    <h3 className="font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
                      {item.feature}
                    </h3>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {item.description}
                  </p>
                </div>
                <StatusBadge
                  status={item.status === 'evaluated' ? 'Avaliado' : 'Em Análise'}
                  variant={item.status === 'evaluated' ? 'success' : 'warning'}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--color-text-secondary)]">Impacto</span>
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">{item.scores.impact}%</span>
                  </div>
                  <div className="h-2 bg-[var(--color-background-inset)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-primary transition-all duration-500"
                      style={{ width: `${item.scores.impact}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--color-text-secondary)]">Esforço</span>
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">{item.scores.effort}%</span>
                  </div>
                  <div className="h-2 bg-[var(--color-background-inset)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-primary transition-all duration-500"
                      style={{ width: `${item.scores.effort}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--color-text-secondary)]">Confiança</span>
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">{item.scores.confidence}%</span>
                  </div>
                  <div className="h-2 bg-[var(--color-background-inset)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-primary transition-all duration-500"
                      style={{ width: `${item.scores.confidence}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--color-text-secondary)]">Alcance</span>
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">{item.scores.reach}%</span>
                  </div>
                  <div className="h-2 bg-[var(--color-background-inset)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-primary transition-all duration-500"
                      style={{ width: `${item.scores.reach}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[var(--color-text-secondary)]">{item.team}</span>
                  <span className="text-[var(--color-text-tertiary)]">•</span>
                  <div className="flex gap-1">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-[var(--color-accent-light)] text-[var(--color-primary)]"
                      >
                        <TagIcon className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[var(--color-text-secondary)]">Prioridade:</span>
                  <span className={`
                    text-sm font-medium
                    ${item.priority === 'high' ? 'text-green-500' : 
                      item.priority === 'medium' ? 'text-yellow-500' : 'text-red-500'}
                  `}>
                    {item.priority === 'high' ? 'Alta' : 
                     item.priority === 'medium' ? 'Média' : 'Baixa'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
} 