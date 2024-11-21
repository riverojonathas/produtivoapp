import { ITag } from '@/types/tag'

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

export interface IProductTag extends ITag {
  product_id: string
}

export type ProductStatus = 'active' | 'inactive' | 'archived' | 'development'

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
  product_tags?: IProductTag[]
  tags?: ITag[]
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  progress?: number
}

// Tipo para uso em componentes que não aceitam null
export type Product = Omit<IProduct, 'vision' | 'avatar_url' | 'target_audience'> & {
  vision?: string
  avatar_url?: string
  target_audience?: string
}

// Função helper para converter IProduct para Product
export function toProduct(product: IProduct): Product {
  return {
    ...product,
    vision: product.vision || undefined,
    avatar_url: product.avatar_url || undefined,
    target_audience: product.target_audience || undefined,
    tags: product.product_tags || product.tags || []
  }
} 