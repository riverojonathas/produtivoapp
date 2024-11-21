import { 
  InboxIcon,
  PlayCircle,
  AlertOctagon,
  CheckCircle2
} from 'lucide-react'

// Tipos base
export type FeatureStatus = 'backlog' | 'doing' | 'done' | 'blocked'
export type FeaturePriority = 'low' | 'medium' | 'high' | 'urgent'
export type MoscowPriority = 'must' | 'should' | 'could' | 'wont'

// Interfaces
export interface IFeatureDescription {
  what?: string
  why?: string
  who?: string
  metrics?: string
  notes?: string
}

export interface IFeatureDependency {
  id: string
  title: string
  status: FeatureStatus
}

export interface IRelatedProduct {
  id: string
  name: string
  avatar_url?: string
}

export interface IUserStory {
  id: string
  title: string
  description: {
    asA: string
    iWant: string
    soThat: string
  }
  points: number
  status: 'open' | 'in-progress' | 'completed' | 'blocked'
  feature_id: string
  created_at: string
  updated_at: string
  acceptanceCriteria?: string[]
  assignees?: string[]
}

// Interface principal da Feature
export interface IFeature {
  id: string
  title: string
  description?: IFeatureDescription
  status: FeatureStatus
  priority?: FeaturePriority
  created_at: string
  updated_at?: string
  product_id?: string
  start_date?: string
  end_date?: string
  progress?: number
  rice_score?: number
  moscow_priority?: MoscowPriority
  rice_impact?: number
  rice_effort?: number
  rice_reach?: number
  rice_confidence?: number
  user_stories?: IUserStory[]
  assignees?: string[]
  dependencies?: IFeatureDependency[]
  dependent_features?: IFeatureDependency[]
  related_products?: IRelatedProduct[]
}

// Constantes
export const FEATURE_STATUS = {
  backlog: {
    label: 'Backlog',
    value: 'backlog' as const,
    color: 'bg-gray-100 text-gray-700',
    icon: InboxIcon
  },
  doing: {
    label: 'Em Progresso',
    value: 'doing' as const,
    color: 'bg-blue-100 text-blue-700',
    icon: PlayCircle
  },
  blocked: {
    label: 'Bloqueado',
    value: 'blocked' as const,
    color: 'bg-red-100 text-red-700',
    icon: AlertOctagon
  },
  done: {
    label: 'Concluído',
    value: 'done' as const,
    color: 'bg-emerald-100 text-emerald-700',
    icon: CheckCircle2
  }
} as const

export const FEATURE_PRIORITY = {
  low: {
    label: 'Baixa',
    value: 'low' as const,
    color: 'bg-green-100 text-green-700',
  },
  medium: {
    label: 'Média',
    value: 'medium' as const,
    color: 'bg-yellow-100 text-yellow-700',
  },
  high: {
    label: 'Alta',
    value: 'high' as const,
    color: 'bg-red-100 text-red-700',
  },
  urgent: {
    label: 'Urgente',
    value: 'urgent' as const,
    color: 'bg-purple-100 text-purple-700',
  }
} as const

// Remover a interface Feature antiga e usar apenas IFeature
export type Feature = IFeature 