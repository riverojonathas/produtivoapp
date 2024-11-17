export type ProductStatus = 'active' | 'inactive' | 'archived'

export interface Product {
  id: string
  created_at: string
  name: string
  description: string
  status: string
  owner_id: string
  team: string[]
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

// Template para User Story usando formato "Como [persona], eu quero [ação] para [benefício]"
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