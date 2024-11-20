import { StoryStatus } from './story'

export interface IStoryTemplate {
  id: string
  title: string
  description: {
    asA: string
    iWant: string
    soThat: string
  }
  defaultPoints: number
  defaultStatus: StoryStatus
  suggestedCriteria: string[]
  created_at: string
  updated_at: string
  owner_id: string
  category?: string
  tags?: string[]
} 