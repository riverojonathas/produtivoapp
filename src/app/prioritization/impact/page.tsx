'use client';

import { PageHeader } from '@/components/ui/page-header';
import { Section } from '@/components/ui/section';
import { MetricCard } from '@/components/ui/metric-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { FilterBar } from '@/components/common/FilterBar';
import {
  ArrowTrendingUpIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ClockIcon,
  TagIcon,
  ChartBarIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

const filters = [
  {
    id: 'impact',
    label: 'Impacto',
    options: ['Alto', 'Médio', 'Baixo']
  },
  {
    id: 'status',
    label: 'Status',
    options: ['Em Análise', 'Validado', 'Pendente']
  }
];

const impactAnalyses = [
  {
    id: '1',
    feature: 'Autenticação Social',
    description: 'Implementação de login com redes sociais',
    metrics: {
      businessValue: 85,
      userSatisfaction: 92,
      implementation: 65,
      timeToMarket: 45
    },
    status: 'validated',
    stakeholders: ['Product', 'Engineering', 'UX'],
    risks: [
      'Dependência de APIs externas',
      'Complexidade de integração',
      'Segurança de dados'
    ],
    opportunities: [
      'Redução de fricção no onboarding',
      'Aumento na taxa de conversão',
      'Melhoria na experiência do usuário'
    ],
    tags: ['auth', 'user-experience', 'conversion']
  },
  // ... mais análises
];

export default function ImpactAnalysisPage() {
  return (
    <div className="space-y-8 animate-fade">
      <PageHeader
        title="Análise de Impacto"
        subtitle="Avalie o impacto potencial das features no negócio e nos usuários"
      />

      <FilterBar
        filters={filters}
        onFilterChange={() => {}}
        onSearch={() => {}}
        placeholder="Buscar análises..."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Média de Impacto no Negócio"
          value="8.5"
          icon={<ChartBarIcon className="w-5 h-5 text-[var(--color-primary)]" />}
          change={{
            value: "+0.8",
            trend: "up",
            description: "vs. último trimestre"
          }}
        />
        <MetricCard
          title="Satisfação do Usuário"
          value="92%"
          icon={<UserGroupIcon className="w-5 h-5 text-[var(--color-primary)]" />}
          change={{
            value: "+5%",
            trend: "up",
            description: "vs. último trimestre"
          }}
        />
        <MetricCard
          title="ROI Estimado"
          value="R$ 250K"
          icon={<CurrencyDollarIcon className="w-5 h-5 text-[var(--color-primary)]" />}
          change={{
            value: "+12%",
            trend: "up",
            description: "projeção anual"
          }}
        />
        <MetricCard
          title="Time to Market"
          value="45d"
          icon={<ClockIcon className="w-5 h-5 text-[var(--color-primary)]" />}
          change={{
            value: "-10d",
            trend: "down",
            description: "média por feature"
          }}
        />
      </div>

      <div className="grid gap-6">
        {impactAnalyses.map((analysis) => (
          <Section
            key={analysis.id}
            className="hover-lift hover-glow transition-all duration-300"
          >
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <BeakerIcon className="w-5 h-5 text-[var(--color-primary)]" />
                    <h3 className="text-lg font-medium text-[var(--color-text-primary)]">
                      {analysis.feature}
                    </h3>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {analysis.description}
                  </p>
                </div>
                <StatusBadge
                  status={analysis.status === 'validated' ? 'Validado' : 'Em Análise'}
                  variant={analysis.status === 'validated' ? 'success' : 'warning'}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-[var(--color-text-secondary)]">
                    Impacto no Negócio
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-[var(--color-background-tertiary)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--color-primary)]"
                        style={{ width: `${analysis.metrics.businessValue}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">
                      {analysis.metrics.businessValue}%
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-[var(--color-text-secondary)]">
                    Satisfação do Usuário
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-[var(--color-background-tertiary)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--color-primary)]"
                        style={{ width: `${analysis.metrics.userSatisfaction}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">
                      {analysis.metrics.userSatisfaction}%
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-[var(--color-text-secondary)]">
                    Complexidade
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-[var(--color-background-tertiary)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--color-primary)]"
                        style={{ width: `${analysis.metrics.implementation}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">
                      {analysis.metrics.implementation}%
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-[var(--color-text-secondary)]">
                    Time to Market
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-[var(--color-background-tertiary)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--color-primary)]"
                        style={{ width: `${analysis.metrics.timeToMarket}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">
                      {analysis.metrics.timeToMarket}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[var(--color-border)]">
                <div>
                  <h4 className="text-sm font-medium text-[var(--color-text-primary)] mb-3">
                    Stakeholders
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.stakeholders.map((stakeholder) => (
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
                  <h4 className="text-sm font-medium text-[var(--color-text-primary)] mb-3">
                    Riscos
                  </h4>
                  <ul className="space-y-1">
                    {analysis.risks.map((risk) => (
                      <li
                        key={risk}
                        className="text-sm text-[var(--color-text-secondary)]"
                      >
                        • {risk}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-[var(--color-text-primary)] mb-3">
                    Oportunidades
                  </h4>
                  <ul className="space-y-1">
                    {analysis.opportunities.map((opportunity) => (
                      <li
                        key={opportunity}
                        className="text-sm text-[var(--color-text-secondary)]"
                      >
                        • {opportunity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-4">
                {analysis.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-[var(--color-accent-light)] text-[var(--color-primary)]"
                  >
                    <TagIcon className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Section>
        ))}
      </div>
    </div>
  );
} 