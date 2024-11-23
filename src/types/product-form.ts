export type Step = 'basic' | 'vision' | 'risks' | 'northstar'

export interface ProductVision {
  targetAudience: string
  problem: string
  solution: string
  metrics: {
    happiness: string
    engagement: string
    adoption: string
    retention: string
    taskSuccess: string
  }
}

export interface Risk {
  description: string
  mitigation: string
}

export interface ProductRisks {
  valueRisks: Risk[]
  usabilityRisks: Risk[]
  feasibilityRisks: Risk[]
  businessRisks: Risk[]
}

export interface NorthStar {
  metric: string
  target: string
  signals: string
  actions: string
  rationale: string
}

export const stepTitles = {
  basic: 'Informações Básicas',
  vision: 'Visão do Produto',
  risks: 'Riscos e Mitigações',
  northstar: 'Métrica North Star'
} as const

export const steps: Step[] = ['basic', 'vision', 'risks', 'northstar'] 