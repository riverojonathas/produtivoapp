import { 
  InboxIcon,
  PlayCircle,
  AlertOctagon,
  CheckCircle2
} from 'lucide-react'

export interface IFeature {
  id: string
  title: string
  description: {
    what?: string
    why?: string
    how?: string
    who?: string
  }
  status: FeatureStatus
  priority: 'low' | 'medium' | 'high' | 'urgent'
  product_id: string
  owner_id: string
  created_at: string
  updated_at: string
  start_date?: string
  end_date?: string
  dependencies?: {
    id: string
    title: string
    status: FeatureStatus
  }[]
  assignees?: string[]
  tags?: string[]
  progress?: number
  rice_reach?: number
  rice_impact?: number
  rice_confidence?: number
  rice_effort?: number
  rice_score?: number
  moscow_priority?: 'must' | 'should' | 'could' | 'wont'
  dependent_features?: {
    id: string
    title: string
    status: FeatureStatus
  }[]
  related_products?: {
    id: string
    name: string
    avatar_url?: string | null
  }[]
  stories?: IUserStory[]
}

export type FeatureStatus = 'backlog' | 'doing' | 'done' | 'blocked'

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

export type FeaturePriority = 'low' | 'medium' | 'high' | 'urgent'

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
} 