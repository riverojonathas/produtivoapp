'use client';

import { Card } from "@/components/ui/card";
import { 
  PlusIcon,
  ArrowUpIcon,
  ArrowRightIcon,
  ArrowDownIcon,
  FolderIcon
} from "@heroicons/react/24/outline";

const backlogItems = [
  {
    id: '1',
    title: 'Implementar autenticação social',
    description: 'Adicionar login com Google e GitHub',
    priority: 'high',
    product: 'Product Analytics Dashboard',
    estimatedTime: '8h',
    tags: ['feature', 'auth']
  },
  // Adicione mais itens conforme necessário
];

const PriorityIcon = ({ priority }: { priority: string }) => {
  switch (priority) {
    case 'high':
      return <ArrowUpIcon className="w-5 h-5 text-red-500" />;
    case 'medium':
      return <ArrowRightIcon className="w-5 h-5 text-yellow-500" />;
    case 'low':
      return <ArrowDownIcon className="w-5 h-5 text-green-500" />;
    default:
      return null;
  }
};

export default function BacklogPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
          Backlog
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

      <div className="grid gap-4">
        {backlogItems.map((item) => (
          <Card 
            key={item.id}
            className="p-4 bg-[var(--color-background-elevated)] hover:border-[var(--color-primary)] transition-colors duration-200 cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="p-2 bg-[var(--color-accent-light)] rounded-lg">
                <PriorityIcon priority={item.priority} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] mb-3">
                  {item.description}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                    <FolderIcon className="w-4 h-4" />
                    <span>{item.product}</span>
                  </div>
                  <div className="text-[var(--color-text-secondary)]">
                    {item.estimatedTime}
                  </div>
                  <div className="flex gap-2">
                    {item.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="px-2 py-1 text-xs rounded-full bg-[var(--color-accent-light)] text-[var(--color-primary)]"
                      >
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