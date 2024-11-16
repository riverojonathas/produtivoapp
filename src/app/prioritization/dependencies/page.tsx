'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { FilterBar } from "@/components/common/FilterBar";
import {
  RectangleStackIcon,
  ArrowsRightLeftIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  UserGroupIcon,
  TagIcon
} from "@heroicons/react/24/outline";

interface Dependency {
  id: string;
  feature: string;
  description: string;
  dependsOn: string[];
  blockedBy: string[];
  blocks: string[];
  impact: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'resolved';
  estimatedTime: string;
  team: string;
  tags: string[];
}

const mockDependencies: Dependency[] = [
  {
    id: '1',
    feature: 'Autenticação Social',
    description: 'Implementação de login com redes sociais',
    dependsOn: ['API Gateway', 'User Service'],
    blockedBy: ['OAuth Integration'],
    blocks: ['User Profile', 'Social Sharing'],
    impact: 'high',
    status: 'in_progress',
    estimatedTime: '2 semanas',
    team: 'Authentication Team',
    tags: ['auth', 'security', 'user-experience']
  },
  {
    id: '2',
    feature: 'Dashboard Analytics',
    description: 'Sistema de análise em tempo real',
    dependsOn: ['Data Pipeline', 'Event Tracking'],
    blockedBy: ['Data Lake Migration'],
    blocks: ['Reporting System'],
    impact: 'medium',
    status: 'pending',
    estimatedTime: '3 semanas',
    team: 'Analytics Team',
    tags: ['analytics', 'data', 'performance']
  }
];

const filters = [
  {
    id: 'status',
    label: 'Status',
    options: ['Pendente', 'Em Progresso', 'Resolvido']
  },
  {
    id: 'impact',
    label: 'Impacto',
    options: ['Alto', 'Médio', 'Baixo']
  }
];

export default function DependenciesPage() {
  const [dependencies] = useState<Dependency[]>(mockDependencies);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-500 bg-red-500/10';
      case 'medium':
        return 'text-yellow-500 bg-yellow-500/10';
      default:
        return 'text-green-500 bg-green-500/10';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
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
            Dependências
          </h1>
          <span className="text-sm text-[var(--color-text-secondary)]">
            Gestão de Dependências entre Features
          </span>
        </div>
      </div>

      <FilterBar
        filters={filters}
        onFilterChange={() => {}}
        onSearch={() => {}}
        placeholder="Buscar dependências..."
      />

      <div className="grid gap-6">
        {dependencies.map((dependency) => (
          <Card 
            key={dependency.id}
            className="p-6 bg-[var(--color-background-elevated)]"
          >
            <div className="flex flex-col space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <RectangleStackIcon className="w-5 h-5 text-[var(--color-primary)]" />
                    <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                      {dependency.feature}
                    </h2>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                    {dependency.description}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${getImpactColor(dependency.impact)}`}>
                    Impacto {dependency.impact === 'high' ? 'Alto' : 
                            dependency.impact === 'medium' ? 'Médio' : 'Baixo'}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(dependency.status)}`}>
                    {dependency.status === 'resolved' ? 'Resolvido' :
                     dependency.status === 'in_progress' ? 'Em Progresso' : 'Pendente'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowsRightLeftIcon className="w-4 h-4 text-[var(--color-text-secondary)]" />
                    <h3 className="text-sm font-medium text-[var(--color-text-primary)]">
                      Depende de
                    </h3>
                  </div>
                  <ul className="space-y-1">
                    {dependency.dependsOn.map((item) => (
                      <li 
                        key={item}
                        className="text-sm text-[var(--color-text-secondary)]"
                      >
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <ExclamationTriangleIcon className="w-4 h-4 text-[var(--color-text-secondary)]" />
                    <h3 className="text-sm font-medium text-[var(--color-text-primary)]">
                      Bloqueado por
                    </h3>
                  </div>
                  <ul className="space-y-1">
                    {dependency.blockedBy.map((item) => (
                      <li 
                        key={item}
                        className="text-sm text-[var(--color-text-secondary)]"
                      >
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowsRightLeftIcon className="w-4 h-4 text-[var(--color-text-secondary)]" />
                    <h3 className="text-sm font-medium text-[var(--color-text-primary)]">
                      Bloqueia
                    </h3>
                  </div>
                  <ul className="space-y-1">
                    {dependency.blocks.map((item) => (
                      <li 
                        key={item}
                        className="text-sm text-[var(--color-text-secondary)]"
                      >
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-4 border-t border-[var(--color-border)]">
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-4 h-4 text-[var(--color-text-secondary)]" />
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    {dependency.estimatedTime}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <UserGroupIcon className="w-4 h-4 text-[var(--color-text-secondary)]" />
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    {dependency.team}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap gap-2">
                    {dependency.tags.map((tag) => (
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