'use client';

import { Card } from "@/components/ui/card";
import { 
  PlusIcon, 
  CalendarIcon,
  ClockIcon,
  ChartBarIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";

const sprints = [
  {
    id: '1',
    name: 'Sprint 23',
    startDate: '2024-03-18',
    endDate: '2024-04-01',
    status: 'active',
    progress: 45,
    totalTasks: 12,
    completedTasks: 5,
    team: 'Time Alpha',
    goals: [
      'Implementar autenticação social',
      'Melhorar performance do dashboard',
      'Corrigir bugs críticos'
    ]
  },
  // Adicione mais sprints conforme necessário
];

export default function SprintPlanningPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
          Planejamento de Sprints
        </h1>
        <button className="
          flex items-center gap-2 px-4 py-2 rounded-lg
          bg-[var(--color-primary)] text-white
          hover:bg-[var(--color-primary)]/90
          transition-colors duration-200
        ">
          <PlusIcon className="w-5 h-5" />
          <span>Nova Sprint</span>
        </button>
      </div>

      <div className="grid gap-6">
        {sprints.map((sprint) => (
          <Card 
            key={sprint.id}
            className="p-6 bg-[var(--color-background-elevated)]"
          >
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                    {sprint.name}
                  </h2>
                  <div className="flex items-center gap-4 mt-2 text-sm text-[var(--color-text-secondary)]">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      <span>
                        {new Date(sprint.startDate).toLocaleDateString('pt-BR')} - 
                        {new Date(sprint.endDate).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-4 h-4" />
                      <span>{sprint.team}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ChartBarIcon className="w-5 h-5 text-[var(--color-primary)]" />
                  <span className="text-lg font-semibold text-[var(--color-primary)]">
                    {sprint.progress}%
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-[var(--color-text-secondary)]" />
                  <span className="text-[var(--color-text-secondary)]">
                    {sprint.completedTasks}/{sprint.totalTasks} tarefas concluídas
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-2">
                  Objetivos da Sprint
                </h3>
                <ul className="space-y-2">
                  {sprint.goals.map((goal, index) => (
                    <li 
                      key={index}
                      className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                      {goal}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 