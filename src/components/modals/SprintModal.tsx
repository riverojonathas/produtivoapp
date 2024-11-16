'use client';

import { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { 
  CalendarIcon,
  UserGroupIcon,
  ListBulletIcon,
  FlagIcon
} from '@heroicons/react/24/outline';

interface SprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (sprint: SprintFormData) => void;
  initialData?: SprintFormData;
}

interface SprintFormData {
  name: string;
  startDate: string;
  endDate: string;
  team: string;
  goals: string[];
  status: 'planning' | 'active' | 'completed';
}

export function SprintModal({ isOpen, onClose, onSubmit, initialData }: SprintModalProps) {
  const [formData, setFormData] = useState<SprintFormData>({
    name: initialData?.name || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    team: initialData?.team || '',
    goals: initialData?.goals || [''],
    status: initialData?.status || 'planning'
  });

  const addGoal = () => {
    setFormData(prev => ({
      ...prev,
      goals: [...prev.goals, '']
    }));
  };

  const removeGoal = (index: number) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index)
    }));
  };

  const updateGoal = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.map((goal, i) => i === index ? value : goal)
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
              {initialData ? 'Editar Sprint' : 'Nova Sprint'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Nome da Sprint
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-[var(--color-background-tertiary)] border border-[var(--color-border)] text-[var(--color-text-primary)]"
                  placeholder="Ex: Sprint 23"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Data de Início
                  </label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--color-background-tertiary)] border border-[var(--color-border)] text-[var(--color-text-primary)]"
                      required
                      aria-label="Data de início"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Data de Término
                  </label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--color-background-tertiary)] border border-[var(--color-border)] text-[var(--color-text-primary)]"
                      required
                      aria-label="Data de término"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Time
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
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
                    Objetivos da Sprint
                  </label>
                  <button
                    type="button"
                    onClick={addGoal}
                    className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary)]/80"
                  >
                    + Adicionar objetivo
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.goals.map((goal, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="relative flex-1">
                        <ListBulletIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
                        <input
                          type="text"
                          value={goal}
                          onChange={(e) => updateGoal(index, e.target.value)}
                          className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--color-background-tertiary)] border border-[var(--color-border)] text-[var(--color-text-primary)]"
                          placeholder="Descreva o objetivo"
                          required
                        />
                      </div>
                      {formData.goals.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeGoal(index)}
                          className="px-3 py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-danger)]"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
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
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as SprintFormData['status'] })}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--color-background-tertiary)] border border-[var(--color-border)] text-[var(--color-text-primary)] appearance-none"
                    aria-label="Status da sprint"
                  >
                    <option value="planning">Planejamento</option>
                    <option value="active">Em Andamento</option>
                    <option value="completed">Concluída</option>
                  </select>
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
                  {initialData ? 'Salvar Alterações' : 'Criar Sprint'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Dialog>
  );
} 