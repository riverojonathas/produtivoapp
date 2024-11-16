'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { FilterBar } from "@/components/common/FilterBar";
import {
  AdjustmentsHorizontalIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChartBarIcon,
  UserGroupIcon,
  ClockIcon,
  TagIcon
} from "@heroicons/react/24/outline";

interface RankedFeature {
  id: string;
  name: string;
  description: string;
  score: number;
  businessValue: number;
  userValue: number;
  complexity: number;
  timeToValue: number;
  rank: number;
  previousRank: number;
  stakeholders: string[];
  tags: string[];
  status: 'planned' | 'in_progress' | 'completed';
}

const mockFeatures: RankedFeature[] = [
  {
    id: '1',
    name: 'Autenticação Social',
    description: 'Implementação de login com redes sociais',
    score: 8.5,
    businessValue: 8,
    userValue: 9,
    complexity: 6,
    timeToValue: 4,
    rank: 1,
    previousRank: 2,
    stakeholders: ['Product', 'Engineering', 'UX'],
    tags: ['auth', 'user-experience'],
    status: 'planned'
  },
  {
    id: '2',
    name: 'Dashboard Analytics',
    description: 'Painel de análise de métricas em tempo real',
    score: 8.2,
    businessValue: 9,
    userValue: 7,
    complexity: 8,
    timeToValue: 6,
    rank: 2,
    previousRank: 1,
    stakeholders: ['Product', 'Data', 'Engineering'],
    tags: ['analytics', 'dashboard'],
    status: 'in_progress'
  }
];

const filters = [
  {
    id: 'status',
    label: 'Status',
    options: ['Planejado', 'Em Progresso', 'Concluído']
  },
  {
    id: 'complexity',
    label: 'Complexidade',
    options: ['Alta', 'Média', 'Baixa']
  }
];

export default function FeatureRankingPage() {
  const [features] = useState<RankedFeature[]>(mockFeatures);

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-500';
    if (score >= 6) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getRankChange = (current: number, previous: number) => {
    if (current < previous) {
      return <ArrowUpIcon className="w-4 h-4 text-green-500" />;
    }
    if (current > previous) {
      return <ArrowDownIcon className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500 bg-green-500/10';
      case 'in_progress':
        return 'text-yellow-500 bg-yellow-500/10';
      default:
        return 'text-blue-500 bg-blue-500/10';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Ranking de Features
          </h1>
          <span className="text-sm text-[var(--color-text-secondary)]">
            Priorização por Pontuação
          </span>
        </div>
      </div>

      <FilterBar
        filters={filters}
        onFilterChange={() => {}}
        onSearch={() => {}}
        placeholder="Buscar features..."
      />

      <div className="grid gap-6">
        {features.map((feature) => (
          <Card 
            key={feature.id}
            className="p-6 bg-[var(--color-background-elevated)]"
          >
            <div className="flex flex-col space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-[var(--color-primary)]">
                        #{feature.rank}
                      </span>
                      {getRankChange(feature.rank, feature.previousRank)}
                    </div>
                    <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                      {feature.name}
                    </h2>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                    {feature.description}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-2xl font-bold ${getScoreColor(feature.score)}`}>
                    {feature.score.toFixed(1)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(feature.status)}`}>
                    {feature.status === 'completed' ? 'Concluído' :
                     feature.status === 'in_progress' ? 'Em Progresso' : 'Planejado'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <ChartBarIcon className="w-4 h-4 text-[var(--color-text-secondary)]" />
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      Valor para o Negócio
                    </span>
                  </div>
                  <span className={`text-lg font-semibold ${getScoreColor(feature.businessValue)}`}>
                    {feature.businessValue}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <UserGroupIcon className="w-4 h-4 text-[var(--color-text-secondary)]" />
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      Valor para o Usuário
                    </span>
                  </div>
                  <span className={`text-lg font-semibold ${getScoreColor(feature.userValue)}`}>
                    {feature.userValue}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AdjustmentsHorizontalIcon className="w-4 h-4 text-[var(--color-text-secondary)]" />
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      Complexidade
                    </span>
                  </div>
                  <span className={`text-lg font-semibold ${getScoreColor(10 - feature.complexity)}`}>
                    {feature.complexity}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <ClockIcon className="w-4 h-4 text-[var(--color-text-secondary)]" />
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      Tempo até Valor
                    </span>
                  </div>
                  <span className={`text-lg font-semibold ${getScoreColor(10 - feature.timeToValue)}`}>
                    {feature.timeToValue}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-4 border-t border-[var(--color-border)]">
                <div>
                  <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-2">
                    Stakeholders
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {feature.stakeholders.map((stakeholder) => (
                      <span 
                        key={stakeholder}
                        className="px-2 py-1 text-xs rounded-full bg-[var(--color-background-tertiary)] text-[var(--color-text-secondary)]"
                      >
                        {stakeholder}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-2">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {feature.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-[var(--color-accent-light)] text-[var(--color-primary)]"
                      >
                        <TagIcon className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 