import { 
  BookOpen,
  PlayCircle,
  AlertOctagon,
  CheckCircle2
} from 'lucide-react'

export interface IUserStoryDescription {
  asA: string
  iWant: string
  soThat: string
}

export interface ITimeTracking {
  logged_hours: number
  remaining_hours: number
  last_update: string
}

export type StoryStatus = 'open' | 'in-progress' | 'completed' | 'blocked'

export interface IUserStory {
  id: string
  title: string
  description: IUserStoryDescription
  points: number
  status: StoryStatus
  feature_id: string
  created_at: string
  updated_at: string
  acceptanceCriteria?: string[]
  assignees?: string[]
  estimated_hours?: number
  start_date?: string
  deadline?: string
  time_tracking?: ITimeTracking
}

export type UserStoryFormData = Partial<Omit<IUserStory, 'description'>> & {
  description: Partial<IUserStoryDescription>
}

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