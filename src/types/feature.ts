export interface IFeature {
  id: string
  title: string
  description: {
    what?: string
    why?: string
    how?: string
    who?: string
  }
  status: 'backlog' | 'doing' | 'done' | 'blocked'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  product_id: string
  owner_id: string
  created_at: string
  updated_at: string
  start_date?: string
  end_date?: string
  dependencies?: string[]
  assignees?: string[]
  tags?: string[]
  progress?: number
  rice_reach?: number
  rice_impact?: number
  rice_confidence?: number
  rice_effort?: number
  moscow_priority?: 'must' | 'should' | 'could' | 'wont'
} 