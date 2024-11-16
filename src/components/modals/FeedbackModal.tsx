'use client';

import { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { 
  ChatBubbleLeftIcon,
  TagIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: FeedbackFormData) => void;
  initialData?: FeedbackFormData;
}

interface FeedbackFormData {
  content: string;
  type: 'feature' | 'bug' | 'improvement';
  user: string;
  tags: string[];
}

export function FeedbackModal({ isOpen, onClose, onSubmit, initialData }: FeedbackModalProps) {
  const [formData, setFormData] = useState<FeedbackFormData>({
    content: initialData?.content || '',
    type: initialData?.type || 'feature',
    user: initialData?.user || '',
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
              {initialData ? 'Editar Feedback' : 'Novo Feedback'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Descrição do Feedback
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-[var(--color-background-tertiary)] border border-[var(--color-border)] text-[var(--color-text-primary)] min-h-[120px]"
                  placeholder="Descreva sua sugestão ou problema encontrado"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Tipo
                  </label>
                  <div className="relative">
                    <ChatBubbleLeftIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as FeedbackFormData['type'] })}
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--color-background-tertiary)] border border-[var(--color-border)] text-[var(--color-text-primary)] appearance-none"
                      aria-label="Tipo de feedback"
                    >
                      <option value="feature">Nova Funcionalidade</option>
                      <option value="bug">Problema/Bug</option>
                      <option value="improvement">Melhoria</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Usuário
                  </label>
                  <div className="relative">
                    <UserCircleIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
                    <input
                      type="text"
                      value={formData.user}
                      onChange={(e) => setFormData({ ...formData, user: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--color-background-tertiary)] border border-[var(--color-border)] text-[var(--color-text-primary)]"
                      placeholder="Seu nome"
                      required
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
                    placeholder="Separe as tags por vírgula (ex: interface, desempenho)"
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
                  {initialData ? 'Salvar Alterações' : 'Enviar Feedback'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Dialog>
  );
} 