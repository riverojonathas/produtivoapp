'use client';

import { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { 
  TagIcon,
  UserCircleIcon,
  CalendarIcon,
  FolderIcon,
  FlagIcon
} from '@heroicons/react/24/outline';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: any) => void;
  initialData?: any;
}

export function TaskModal({ isOpen, onClose, onSubmit, initialData }: TaskModalProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    priority: initialData?.priority || 'medium',
    assignee: initialData?.assignee || '',
    dueDate: initialData?.dueDate || '',
    product: initialData?.product || '',
    tags: initialData?.tags || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-[var(--color-background-elevated)] rounded-lg w-full max-w-2xl mx-4">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-6">
              {initialData ? 'Editar Tarefa' : 'Nova Tarefa'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-[var(--color-background-tertiary)] border border-[var(--color-border)] text-[var(--color-text-primary)]"
                  placeholder="Digite o título da tarefa"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-[var(--color-background-tertiary)] border border-[var(--color-border)] text-[var(--color-text-primary)] min-h-[100px]"
                  placeholder="Descreva a tarefa"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Prioridade
                  </label>
                  <div className="relative">
                    <FlagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--color-background-tertiary)] border border-[var(--color-border)] text-[var(--color-text-primary)] appearance-none"
                    >
                      <option value="low">Baixa</option>
                      <option value="medium">Média</option>
                      <option value="high">Alta</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Data de Entrega
                  </label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--color-background-tertiary)] border border-[var(--color-border)] text-[var(--color-text-primary)]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Responsável
                  </label>
                  <div className="relative">
                    <UserCircleIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
                    <input
                      type="text"
                      value={formData.assignee}
                      onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--color-background-tertiary)] border border-[var(--color-border)] text-[var(--color-text-primary)]"
                      placeholder="Nome do responsável"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Produto
                  </label>
                  <div className="relative">
                    <FolderIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
                    <input
                      type="text"
                      value={formData.product}
                      onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--color-background-tertiary)] border border-[var(--color-border)] text-[var(--color-text-primary)]"
                      placeholder="Nome do produto"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Tags
                </label>
                <div className="relative">
                  <TagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
                  <input
                    type="text"
                    value={formData.tags.join(', ')}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--color-background-tertiary)] border border-[var(--color-border)] text-[var(--color-text-primary)]"
                    placeholder="Separe as tags por vírgula"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90 transition-colors"
                >
                  {initialData ? 'Salvar Alterações' : 'Criar Tarefa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Dialog>
  );
} 