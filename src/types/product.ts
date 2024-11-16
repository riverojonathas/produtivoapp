export type ProductStatus = 'active' | 'inactive' | 'archived'

export interface Product {
  id: string
  created_at: string
  name: string
  description: string | null
  status: ProductStatus
  owner_id: string
}

export type ProductCreateInput = Omit<Product, 'id' | 'created_at' | 'status' | 'owner_id'>; 

export type FeatureStatus = 'backlog' | 'planned' | 'in-progress' | 'completed' | 'blocked'
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
  description: FeatureDescription
  status: FeatureStatus
  priority: FeaturePriority
  startDate: Date
  endDate: Date
  dependencies: string[]
  assignees: string[]
  tags: string[]
  stories: UserStory[]
  createdAt: Date
  updatedAt: Date
  productId: string
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
  painPoints: string[]
  goals: string[]
  productId: string
  createdAt: Date
  updatedAt: Date
} 