export interface IPrioritizationHistory {
  id: string
  feature_id: string
  method: 'rice' | 'moscow'
  old_values: {
    rice_score?: number
    moscow_priority?: string
    priority?: string
  }
  new_values: {
    rice_score?: number
    moscow_priority?: string
    priority?: string
  }
  changed_by: string
  reason?: string
  created_at: string
} 