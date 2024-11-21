export interface ITag {
  id: string
  name: string
  type: 'priority' | 'phase' | 'category' | 'custom'
  color?: string
  product_id: string
  created_at: string
  updated_at: string
}

export const TAG_TYPES = {
  priority: {
    label: 'Prioridade',
    value: 'priority' as const,
    color: 'bg-violet-100 text-violet-700'
  },
  phase: {
    label: 'Fase',
    value: 'phase' as const,
    color: 'bg-blue-100 text-blue-700'
  },
  category: {
    label: 'Categoria',
    value: 'category' as const,
    color: 'bg-emerald-100 text-emerald-700'
  },
  custom: {
    label: 'Personalizada',
    value: 'custom' as const,
    color: 'bg-gray-100 text-gray-700'
  }
} as const

export type TagType = keyof typeof TAG_TYPES 