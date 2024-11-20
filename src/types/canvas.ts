export interface Canvas {
  id: string
  title: string
  description?: string
  product_id?: string
  created_at: string
  updated_at: string
  sections: {
    problem: string[]
    solution: string[]
    metrics: string[]
    proposition: string[]
    advantage: string[]
    channels: string[]
    segments: string[]
    costs: string[]
    revenue: string[]
  }
} 