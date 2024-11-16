'use client';

import { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { 
  DocumentTextIcon,
  UserGroupIcon,
  TagIcon,
  FlagIcon
} from '@heroicons/react/24/outline';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: ProductFormData) => void;
  initialData?: ProductFormData;
}

interface ProductFormData {
  name: string;
  description: string;
  team: string;
  status: 'active' | 'archived' | 'draft';
  tags: string[];
  objectives: string[];
}

export function ProductModal({ isOpen, onClose, onSubmit, initialData }: ProductModalProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    team: initialData?.team || '',
    status: initialData?.status || 'draft',
    tags: initialData?.tags || [],
    objectives: initialData?.objectives || ['']
  });

  const addObjective = () => {
    setFormData(prev => ({
      ...prev,
      objectives: [...prev.objectives, '']
    }));
  };

  const removeObjective = (index: number) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }));
  };

  const updateObjective = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.map((obj, i) => i === index ? value : obj)
    }));
  };

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
              {initialData ? 'Editar Produto' : 'Novo Produto'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Nome do Produto
                </label>
                <div className="relative">
                  <DocumentTextIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--color-background-tertiary)] border border-[var(--color-border)] text-[var(--color-text-primary)]"
                    placeholder="Nome do produto"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-[var(--color-background-tertiary)] border border-[var(--color-border)] text-[var(--color-text-primary)] min-h-[100px]"
                  placeholder="Descreva o produto"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Time Responsável
                  </label>
                  <div className="relative">
                    <UserGroupIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
                    <input
                      type="text"
                      value={formData.team}
                      onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--color-background-tertiary)] border border-[var(--color-border)] text-[var(--color-text-primary)]"
                      placeholder="Nome do time"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Status
                  </label>
                  <div className="relative">
                    <FlagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as ProductFormData['status'] })}
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--color-background-tertiary)] border border-[var(--color-border)] text-[var(--color-text-primary)] appearance-none"
                      aria-label="Status do produto"
                    >
                      <option value="draft">Rascunho</option>
                      <option value="active">Ativo</option>
                      <option value="archived">Arquivado</option>
                    </select>
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

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
                    Objetivos do Produto
                  </label>
                  <button
                    type="button"
                    onClick={addObjective}
                    className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary)]/80"
                  >
                    + Adicionar objetivo
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.objectives.map((objective, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={objective}
                        onChange={(e) => updateObjective(index, e.target.value)}
                        className="flex-1 px-4 py-2 rounded-lg bg-[var(--color-background-tertiary)] border border-[var(--color-border)] text-[var(--color-text-primary)]"
                        placeholder="Descreva o objetivo"
                        required
                      />
                      {formData.objectives.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeObjective(index)}
                          className="px-3 py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-danger)]"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
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
                  {initialData ? 'Salvar Alterações' : 'Criar Produto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Dialog>
  );
} 