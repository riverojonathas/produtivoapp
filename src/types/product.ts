import { 
  Rocket,
  Hammer,
  Archive,
  LucideIcon
} from 'lucide-react'

export type ProductStatus = 'active' | 'development' | 'archived'
export type RiskCategory = 'value' | 'usability' | 'feasibility' | 'business'
export type TeamMemberRole = 'owner' | 'manager' | 'member'
export type MetricType = 'heart' | 'north_star' | 'kpi'
export type TagType = 'priority' | 'phase' | 'category' | 'custom'

export interface ITag {
  id: string
  product_id: string
  name: string
  type: TagType
  color?: string
  created_at: string
  updated_at: string
}

export interface IProductRisk {
  id: string
  product_id: string
  category: RiskCategory
  description: string
  mitigation: string
  created_at: string
  updated_at: string
}

export interface IProductMetric {
  id: string
  product_id: string
  type: MetricType
  name: string
  value: string
  created_at: string
  updated_at: string
}

export interface ITeamMember {
  id: string
  name: string
  email: string
  role: TeamMemberRole
  avatar_url?: string | null
}

export interface IProduct {
  id: string
  name: string
  description: string | null
  status: ProductStatus
  owner_id: string | null
  team: ITeamMember[]
  target_audience?: string | null
  vision?: string | null
  avatar_url?: string | null
  created_at: string
  updated_at: string
  product_metrics?: IProductMetric[]
  product_risks?: IProductRisk[]
  tags?: ITag[]
  product_tags?: ITag[]
  risks_count?: number
  metrics_count?: number
}

export interface UploadAvatarResponse {
  url: string
}

export interface UploadAvatarError {
  message: string
}

interface StatusConfig {
  label: string
  icon: LucideIcon
  color: string
  bgColor: string
}

export const productStatusConfig: Record<ProductStatus, StatusConfig> = {
  active: {
    label: 'Ativo',
    icon: Rocket,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10'
  },
  development: {
    label: 'Em Desenvolvimento',
    icon: Hammer,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  archived: {
    label: 'Arquivado',
    icon: Archive,
    color: 'text-gray-500',
    bgColor: 'bg-gray-500/10'
  }
} as const 