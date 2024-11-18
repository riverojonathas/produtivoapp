export type ProductStatus = 'active' | 'development' | 'archived'

export interface Product {
  id: string
  name: string
  description: string
  status: ProductStatus
  owner_id: string
  created_at: string
  updated_at?: string
  avatar_url?: string | null
  vision?: string | null
  target_audience?: string | null
  team?: string[]
  
  // Relacionamentos
  product_risks?: Array<{
    id: string
    category: string
    description: string
    mitigation: string
  }>
  product_metrics?: Array<{
    id: string
    type: 'heart' | 'north_star'
    name: string
    value: string
  }>
  product_tags?: Array<{
    id: string
    name: string
    type: 'priority' | 'phase' | 'category' | 'custom'
    color?: string
  }>

  // Contadores calculados
  risks_count?: number
  metrics_count?: number
  tags?: Array<{
    id: string
    name: string
    type: 'priority' | 'phase' | 'category' | 'custom'
    color?: string
  }>
}

export type ProductCreateInput = Omit<Product, 'id' | 'created_at' | 'status' | 'owner_id'>; 

export type FeatureStatus = 
  | 'backlog'    // Features ainda não iniciadas
  | 'discovery'  // Features em fase de descoberta/pesquisa
  | 'doing'      // Features em desenvolvimento
  | 'done'       // Features concluídas
export type FeaturePriority = 'low' | 'medium' | 'high' | 'urgent'
export type StoryStatus = 'open' | 'in-progress' | 'completed' | 'blocked'

// Template para descrição de Feature usando framework WHAT-WHY-WHO
export interface FeatureDescription {
  what: string    // O que é a feature
  why: string     // Por que ela é necessária (valor de negócio)
  who: string     // Para quem é a feature (público-alvo)
  metrics?: string // Como medir o sucesso (opcional)
  notes?: string  // Notas adicionais (opcional)
}

// Template para User Story usando formato "Como [persona], eu quero [aço] para [benefício]"
export interface UserStory {
  id: string
  featureId: string
  title: string
  description: {
    asA: string      // Persona/Usuário
    iWant: string    // Ação desejada
    soThat: string   // Benefício esperado
  }
  acceptanceCriteria: string[] // Critérios de aceitação
  status: StoryStatus
  points: number     // Story points para estimativa
  assignees: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Feature {
  id: string
  title: string
  description: {
    what: string
    why: string
    how: string
    who: string
  }
  status: 'backlog' | 'doing' | 'done' | 'blocked'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  start_date: string | null
  end_date: string | null
  product_id: string
  owner_id: string
  dependencies: string[]
  assignees: string[]
  tags: string[]
  created_at: string
  updated_at: string
  // Campos de priorização RICE
  rice_reach?: number
  rice_impact?: number
  rice_confidence?: number
  rice_effort?: number
  rice_score?: number
  // Campo de priorização MoSCoW
  moscow_priority?: 'must' | 'should' | 'could' | 'wont'
}

export interface Milestone {
  id: string
  title: string
  description?: string
  startDate: Date
  endDate: Date
  features: string[]
}

export interface FeatureValidation {
  title: {
    minLength: number
    maxLength: number
    unique: boolean
  }
  description: {
    minLength: number
    maxLength: number
  }
  dates: {
    allowPast: boolean
    maxDuration: number
  }
}

export interface Persona {
  id: string
  name: string
  description: string
  characteristics: string[]
  pain_points: string[]
  goals: string[]
  product_id: string | null
  owner_id: string
  created_at: string
  updated_at: string
}

export interface RICEScore {
  reach: number
  impact: number
  confidence: number
  effort: number
} 