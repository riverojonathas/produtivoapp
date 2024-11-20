import { 
  BookOpen,
  PlayCircle,
  AlertOctagon,
  CheckCircle2
} from 'lucide-react'

export interface IUserStory {
  id: string
  title: string
  description: {
    asA: string
    iWant: string
    soThat: string
  }
  points: number
  status: StoryStatus
  feature_id: string
  owner_id: string
  created_at: string
  updated_at: string
  acceptance_criteria?: string[]
  assignees?: string[]
  dependencies?: {
    id: string
    title: string
    status: StoryStatus
  }[]
  related_stories?: {
    id: string
    title: string
    status: StoryStatus
    relationship_type: 'blocks' | 'blocked_by' | 'related' | 'duplicates'
  }[]
  estimated_hours?: number
  actual_hours?: number
  start_date?: string
  end_date?: string
  deadline?: string
  time_tracking?: {
    logged_hours: number
    remaining_hours: number
    last_update: string
  }
}

export type StoryStatus = 'open' | 'in-progress' | 'completed' | 'blocked'

export const STORY_STATUS = {
  open: {
    label: 'Aberta',
    value: 'open' as const,
    color: 'bg-gray-100 text-gray-700',
    icon: BookOpen
  },
  'in-progress': {
    label: 'Em Progresso',
    value: 'in-progress' as const,
    color: 'bg-blue-100 text-blue-700',
    icon: PlayCircle
  },
  blocked: {
    label: 'Bloqueada',
    value: 'blocked' as const,
    color: 'bg-red-100 text-red-700',
    icon: AlertOctagon
  },
  completed: {
    label: 'Concluída',
    value: 'completed' as const,
    color: 'bg-emerald-100 text-emerald-700',
    icon: CheckCircle2
  }
} as const 