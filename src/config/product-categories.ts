import { 
  Target, 
  Gauge, 
  ShieldAlert, 
  Building2 
} from 'lucide-react'

export const riskCategories = [
  {
    type: 'value',
    icon: Target,
    title: 'Riscos de Valor',
    description: 'Relacionados ao valor entregue ao usuário',
    color: 'text-blue-500',
    gradient: 'from-blue-500/5 to-cyan-500/5',
    borderHover: 'hover:border-blue-500/30'
  },
  {
    type: 'usability',
    icon: Gauge,
    title: 'Riscos de Usabilidade',
    description: 'Relacionados à experiência do usuário',
    color: 'text-amber-500',
    gradient: 'from-amber-500/5 to-yellow-500/5',
    borderHover: 'hover:border-amber-500/30'
  },
  {
    type: 'feasibility',
    icon: ShieldAlert,
    title: 'Riscos de Viabilidade',
    description: 'Relacionados à implementação técnica',
    color: 'text-purple-500',
    gradient: 'from-purple-500/5 to-pink-500/5',
    borderHover: 'hover:border-purple-500/30'
  },
  {
    type: 'business',
    icon: Building2,
    title: 'Riscos de Negócio',
    description: 'Relacionados ao modelo de negócio',
    color: 'text-green-500',
    gradient: 'from-green-500/5 to-emerald-500/5',
    borderHover: 'hover:border-green-500/30'
  }
] as const 