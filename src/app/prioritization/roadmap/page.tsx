'use client';

import { PageHeader } from '@/components/ui/page-header';
import { Section } from '@/components/ui/section';
import { MetricCard } from '@/components/ui/metric-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { FilterBar } from '@/components/common/FilterBar';
import {
  MapIcon,
  CalendarIcon,
  FlagIcon,
  PlusIcon,
  RocketLaunchIcon,
  CheckCircleIcon,
  ClockIcon,
  TagIcon,
  ArrowPathIcon,
  ChevronRightIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const filters = [
  {
    id: 'quarter',
    label: 'Trimestre',
    options: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024']
  },
  {
    id: 'status',
    label: 'Status',
    options: ['Planejado', 'Em Progresso', 'Concluído']
  },
  {
    id: 'team',
    label: 'Time',
    options: ['Product', 'Engineering', 'Design', 'Marketing']
  }
];

const metrics = [
  {
    title: 'Features Planejadas',
    value: '24',
    change: {
      value: '+4',
      trend: 'up',
      description: 'vs. trimestre anterior'
    }
  },
  {
    title: 'Em Progresso',
    value: '8',
    change: {
      value: '32%',
      trend: 'neutral',
      description: 'do total'
    }
  },
  {
    title: 'Concluídas',
    value: '16',
    change: {
      value: '+25%',
      trend: 'up',
      description: 'taxa de entrega'
    }
  },
  {
    title: 'Tempo Médio',
    value: '18d',
    change: {
      value: '-3d',
      trend: 'down',
      description: 'tempo de ciclo'
    }
  }
];

const quarters = ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'];

const roadmapItems = [
  {
    id: '1',
    title: 'Autenticação e Segurança',
    description: 'Melhorias no sistema de autenticação e segurança',
    quarter: 'Q1 2024',
    status: 'in_progress',
    priority: 'high',
    progress: 65,
    features: [
      { id: '1.1', name: 'Login Social', status: 'completed' },
      { id: '1.2', name: 'Two-Factor Authentication', status: 'in_progress' },
      { id: '1.3', name: 'Permissões Avançadas', status: 'planned' }
    ],
    tags: ['security', 'auth', 'user-experience'],
    team: 'Security Team',
    dueDate: '2024-03-30'
  },
  // ... mais itens
];

export default function RoadmapPage() {
  return (
    <div className="space-y-8 animate-fade">
      {/* Header com Gradiente */}
      <div className="relative -mx-6 -mt-6 px-6 pt-6 pb-8 mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-5" />
        <div className="relative z-10">
          <PageHeader
            title="Roadmap"
            subtitle="Planejamento e acompanhamento das entregas"
            action={
              <button className="
                inline-flex items-center gap-2 px-4 py-2 rounded-xl
                bg-[var(--color-primary)] text-white
                hover:bg-[var(--color-primary-dark)]
                transition-colors duration-200
              ">
                <PlusIcon className="w-5 h-5" />
                <span>Nova Entrega</span>
              </button>
            }
          />
        </div>
      </div>

      <FilterBar
        filters={filters}
        onFilterChange={() => {}}
        onSearch={() => {}}
        placeholder="Buscar no roadmap..."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            icon={
              index === 0 ? <MapIcon className="w-5 h-5" /> :
              index === 1 ? <RocketLaunchIcon className="w-5 h-5" /> :
              index === 2 ? <CheckCircleIcon className="w-5 h-5" /> :
              <ClockIcon className="w-5 h-5" />
            }
            change={metric.change}
            className={`
              bg-gradient-to-br 
              ${index === 0 ? 'from-blue-500/10' : ''}
              ${index === 1 ? 'from-purple-500/10' : ''}
              ${index === 2 ? 'from-green-500/10' : ''}
              ${index === 3 ? 'from-orange-500/10' : ''}
              to-transparent
            `}
          />
        ))}
      </div>

      {/* Timeline View */}
      <Section
        title="Timeline de Entregas"
        description="Acompanhamento das entregas por trimestre"
        className="bg-gradient-card backdrop-blur-sm"
      >
        <div className="grid grid-cols-4 gap-6">
          {quarters.map((quarter) => (
            <div key={quarter} className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-[var(--color-text-primary)]">
                  {quarter}
                </h3>
                <ChevronRightIcon className="w-5 h-5 text-[var(--color-text-secondary)]" />
              </div>
              
              {roadmapItems
                .filter(item => item.quarter === quarter)
                .map((item) => (
                  <div
                    key={item.id}
                    className="group p-4 rounded-xl bg-[var(--color-background-tertiary)] hover:bg-[var(--color-background-elevated)] hover:shadow-lg transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-[var(--color-accent-light)] text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                        <RocketLaunchIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-sm text-[var(--color-text-secondary)]">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <UserGroupIcon className="w-4 h-4 text-[var(--color-text-secondary)]" />
                          <span className="text-[var(--color-text-secondary)]">{item.team}</span>
                        </div>
                        <StatusBadge
                          status={item.status === 'completed' ? 'Concluído' : 
                                 item.status === 'in_progress' ? 'Em Progresso' : 'Planejado'}
                          variant={item.status === 'completed' ? 'success' : 
                                  item.status === 'in_progress' ? 'warning' : 'info'}
                          size="sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-[var(--color-text-secondary)]">Progresso</span>
                          <span className="font-medium text-[var(--color-text-primary)]">
                            {item.progress}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-[var(--color-background-inset)] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-primary transition-all duration-500"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
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
                  </div>
                ))}
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
} 