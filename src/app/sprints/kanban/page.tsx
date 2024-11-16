'use client';

import { Card } from "@/components/ui/card";
import { 
  PlusIcon,
  TagIcon,
  UserCircleIcon,
  ClockIcon
} from "@heroicons/react/24/outline";

const columns = [
  {
    id: 'todo',
    title: 'A Fazer',
    tasks: [
      {
        id: '1',
        title: 'Implementar login social',
        description: 'Adicionar autenticação via Google',
        priority: 'high',
        assignee: 'João Silva',
        dueDate: '2024-03-25',
        tags: ['feature', 'auth']
      },
      // Adicione mais tarefas
    ]
  },
  {
    id: 'in_progress',
    title: 'Em Progresso',
    tasks: [
      {
        id: '2',
        title: 'Otimizar queries do dashboard',
        description: 'Melhorar performance das consultas',
        priority: 'medium',
        assignee: 'Maria Santos',
        dueDate: '2024-03-20',
        tags: ['improvement', 'performance']
      }
    ]
  },
  {
    id: 'done',
    title: 'Concluído',
    tasks: [
      {
        id: '3',
        title: 'Corrigir bug no filtro',
        description: 'Resolver problema de filtro na listagem',
        priority: 'low',
        assignee: 'Pedro Costa',
        dueDate: '2024-03-15',
        tags: ['bug', 'fix']
      }
    ]
  }
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'text-red-500 bg-red-500/10';
    case 'medium':
      return 'text-yellow-500 bg-yellow-500/10';
    case 'low':
      return 'text-green-500 bg-green-500/10';
    default:
      return 'text-gray-500 bg-gray-500/10';
  }
};

export default function KanbanPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
          Kanban Board
        </h1>
        <button className="
          flex items-center gap-2 px-4 py-2 rounded-lg
          bg-[var(--color-primary)] text-white
          hover:bg-[var(--color-primary)]/90
          transition-colors duration-200
        ">
          <PlusIcon className="w-5 h-5" />
          <span>Nova Tarefa</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div key={column.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-[var(--color-text-primary)]">
                {column.title}
              </h2>
              <span className="text-sm text-[var(--color-text-secondary)]">
                {column.tasks.length}
              </span>
            </div>

            <div className="space-y-3">
              {column.tasks.map((task) => (
                <Card 
                  key={task.id}
                  className="p-4 bg-[var(--color-background-elevated)] hover:border-[var(--color-primary)] transition-colors duration-200 cursor-pointer"
                >
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-sm font-medium text-[var(--color-text-primary)]">
                        {task.title}
                      </h3>
                      <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                        {task.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {task.tags.map((tag) => (
                        <span 
                          key={tag}
                          className="flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-[var(--color-accent-light)] text-[var(--color-primary)]"
                        >
                          <TagIcon className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
                      <div className="flex items-center gap-2">
                        <UserCircleIcon className="w-4 h-4" />
                        {task.assignee}
                      </div>
                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4" />
                        {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 