export interface IProduct {
  id: string
  name: string
  description: string
  status: ProductStatus
  team?: string[]
  created_at: string
  owner_id: string
  avatar_url?: string | null
  vision?: string | null
  target_audience?: string | null
  risks_count?: number
  metrics_count?: number
  product_metrics?: IProductMetric[]
  product_risks?: IProductRisk[]
  tags?: Tag[]
  product_tags?: Tag[]
}

export interface IProductMetric {
  id: string
  product_id: string
  type: 'heart' | 'north_star'
  name: string
  value: string
}

export interface IProductRisk {
  id: string
  product_id: string
  category: string
  description: string
  mitigation: string
}

export interface Tag {
  id: string
  name: string
  type: 'priority' | 'phase' | 'category' | 'custom'
  color?: string
  product_id: string
  created_at: string
  updated_at: string
}

export type ProductStatus = 'active' | 'inactive' | 'archived' | 'development'

export interface Feature {
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
  dependencies?: {
    id: string
    title: string
    status: string
  }[]
  assignees?: string[]
  tags?: string[]
  progress?: number
} 