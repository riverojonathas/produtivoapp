'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, ChevronRight, ChevronLeft, CheckCircle2, HelpCircle } from 'lucide-react'
import { useProducts } from '@/hooks/use-products'
import { toast } from 'sonner'
import { AvatarUpload } from '@/components/ui/avatar-upload'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type Step = 'basic' | 'vision' | 'risks' | 'northstar'

interface ProductVision {
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

interface Risk {
  description: string
  mitigation: string
}

interface ProductRisks {
  valueRisks: Risk[]
  usabilityRisks: Risk[]
  feasibilityRisks: Risk[]
  businessRisks: Risk[]
}

interface NorthStar {
  metric: string
  target: string
  signals: string
  actions: string
  rationale: string
}

const steps: Step[] = ['basic', 'vision', 'risks', 'northstar']

const stepTitles = {
  basic: 'Informações Básicas',
  vision: 'Visão do Produto',
  risks: 'Riscos e Mitigações',
  northstar: 'Métrica North Star'
}

const StepProgress = ({ 
  currentStep, 
  onStepClick,
  completedSteps,
  validationErrors 
}: { 
  currentStep: Step
  onStepClick: (step: Step) => void 
  completedSteps: Set<Step>
  validationErrors: Record<Step, string[]>
}) => {
  const currentIndex = steps.indexOf(currentStep)
  
  return (
    <div className="mb-16 relative">
      {/* Container principal com padding reduzido */}
      <div className="relative flex justify-between items-center px-4">
        {/* Linha conectora com design mais sutil */}
        <div className="absolute top-[15px] left-[15px] right-[15px] h-[1px] bg-gray-200" />
        
        {/* Linha de progresso com transição suave */}
        <div 
          className="absolute top-[15px] left-[15px] h-[1px] bg-[var(--color-primary)] transition-all duration-500 ease-in-out"
          style={{ 
            width: `${(currentIndex / (steps.length - 1)) * (100 - 5)}%`
          }} 
        />

        {steps.map((step, index) => (
          <div key={step} className="relative flex flex-col items-center">
            <button
              onClick={() => onStepClick(step)}
              disabled={index > currentIndex + 1}
              className="relative group focus:outline-none"
            >
              {/* Círculo indicador com animações suaves */}
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                "font-medium text-sm",
                completedSteps.has(step)
                  ? "bg-[var(--color-primary)] text-white shadow-sm scale-105"
                  : index === currentIndex
                  ? "bg-white border-2 border-[var(--color-primary)] text-[var(--color-primary)]"
                  : "bg-white border border-gray-200 text-gray-400",
                "hover:scale-110 hover:shadow-md",
                validationErrors[step]?.length > 0 && index === currentIndex && "border-red-500 text-red-500"
              )}>
                {completedSteps.has(step) ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              
              {/* Título da etapa com melhor espaçamento e transições */}
              <div className={cn(
                "absolute -bottom-8 left-1/2 -translate-x-1/2",
                "whitespace-nowrap text-xs font-medium",
                "transition-all duration-300",
                "pt-2",
                index === currentIndex 
                  ? "text-[var(--color-primary)] transform scale-105" 
                  : completedSteps.has(step)
                  ? "text-gray-600"
                  : "text-gray-400"
              )}>
                <span className="relative">
                  {stepTitles[step]}
                  {validationErrors[step]?.length > 0 && index === currentIndex && (
                    <span className="absolute -right-4 -top-1 w-2 h-2 rounded-full bg-red-500" />
                  )}
                </span>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// Adicione este objeto com as sugestões em português
const heartMetricSuggestions = {
  happiness: [
    'NPS (Net Promoter Score)',
    'Índice de satisfação do usuário',
    'Avaliações positivas',
    'Feedback qualitativo',
    'Número de recomendações'
  ],
  engagement: [
    'Tempo médio de sessão',
    'Número de interações por dia',
    'Frequência de uso',
    'Taxa de retorno diário',
    'Ações por sessão'
  ],
  adoption: [
    'Taxa de conversão',
    'Novos usuários ativos',
    'Tempo até primeira ação',
    'Funcionalidades descobertas',
    'Taxa de ativação'
  ],
  retention: [
    'Taxa de retenção em 30 dias',
    'Churn mensal',
    'Tempo médio de permanência',
    'Usuários recorrentes',
    'Taxa de abandono'
  ],
  taskSuccess: [
    'Taxa de conclusão de tarefas',
    'Tempo para completar ação',
    'Taxa de erro',
    'Eficiência da jornada',
    'Objetivos alcançados'
  ]
}

// Adicione este objeto com as sugestões de riscos
const riskSuggestions = {
  valueRisks: [
    'Produto não resolve a dor real do usuário',
    'Solução muito complexa para o problema',
    'Proposta de valor não clara',
    'Benefícios não justificam o custo'
  ],
  usabilityRisks: [
    'Interface muito complexa',
    'Curva de aprendizado elevada',
    'Baixa acessibilidade',
    'Experiência inconsistente entre dispositivos'
  ],
  feasibilityRisks: [
    'Limitações técnicas na implementação',
    'Dependências de terceiros',
    'Escalabilidade comprometida',
    'Restrições de infraestrutura'
  ],
  businessRisks: [
    'Modelo de negócio não sustentável',
    'Concorrência estabelecida',
    'Regulamentações restritivas',
    'Alto custo de aquisição de clientes'
  ]
}

// Adicione este objeto com as sugestões de mitigações
const mitigationSuggestions = {
  valueRisks: [
    'Realizar pesquisas frequentes com usuários',
    'Implementar MVP para validação rápida',
    'Criar programa de early adopters',
    'Estabelecer métricas claras de sucesso'
  ],
  usabilityRisks: [
    'Realizar testes de usabilidade regulares',
    'Implementar onboarding interativo',
    'Criar documentação clara e tutoriais',
    'Manter consistência com padrões de mercado'
  ],
  feasibilityRisks: [
    'Desenvolver POC técnica',
    'Estabelecer parcerias estratégicas',
    'Planejar arquitetura escalável',
    'Manter redundância de sistemas críticos'
  ],
  businessRisks: [
    'Diversificar fontes de receita',
    'Criar vantagens competitivas claras',
    'Manter conformidade regulatória',
    'Otimizar CAC com marketing focado'
  ]
}

// Adicione estas sugestões para North Star
const northStarSuggestions = {
  metric: [
    'Número de usuários ativos diários (DAU)',
    'Tempo médio de uso por sessão',
    'Número de tarefas completadas',
    'Receita mensal recorrente (MRR)',
    'Taxa de retenção em 30 dias'
  ],
  target: [
    '10.000 usuários ativos/dia',
    '30 minutos/sessão',
    '5 tarefas/usuário/dia',
    'R$ 100.000/mês',
    '85% de retenão'
  ],
  signals: [
    'Logs de acesso, Eventos de interação',
    'Tempo de sessão, Número de cliques',
    'Taxa de conclusão, Tempo por tarefa',
    'Pagamentos processados, Upgrades de plano',
    'Logins recorrentes, Uso de features'
  ],
  actions: [
    'Otimizar onboarding, Melhorar UX',
    'Implementar gamificação, Adicionar atalhos',
    'Simplificar fluxos, Reduzir fricção',
    'Lançar novos recursos, Campanhas de marketing',
    'Programa de fidelidade, Suporte proativo'
  ],
  rationale: [
    'Indica crescimento real do produto',
    'Demonstra engajamento efetivo dos usuários',
    'Reflete valor entregue diretamente',
    'Valida sustentabilidade do negócio',
    'Comprova retenção e satisfação'
  ]
}

interface NewProductPageProps {
  mode?: 'create' | 'edit'
  initialData?: Product
}

export default function NewProductPage({ mode = 'create', initialData }: NewProductPageProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>('basic')
  const [name, setName] = useState(initialData?.name || '')
  const [description, setDescription] = useState(initialData?.description || '')
  
  const [vision, setVision] = useState<ProductVision>(() => {
    if (initialData?.vision) {
      // Parse da visão do produto
      const visionLines = initialData.vision.split('\n')
      return {
        targetAudience: visionLines[0].replace('Para ', ''),
        problem: visionLines[1].replace('Que ', ''),
        solution: visionLines[3].replace('Oferece ', ''),
        metrics: {
          happiness: '',
          engagement: '',
          adoption: '',
          retention: '',
          taskSuccess: ''
        }
      }
    }
    return {
      targetAudience: '',
      problem: '',
      solution: '',
      metrics: {
        happiness: '',
        engagement: '',
        adoption: '',
        retention: '',
        taskSuccess: ''
      }
    }
  })

  const [risks, setRisks] = useState<ProductRisks>({
    valueRisks: [],
    usabilityRisks: [],
    feasibilityRisks: [],
    businessRisks: []
  })

  const [northStar, setNorthStar] = useState<NorthStar>({
    metric: '',
    target: '',
    signals: '',
    actions: '',
    rationale: ''
  })

  const { createProduct, createProductRisk, createProductMetric, updateProduct } = useProducts()

  const [formErrors, setFormErrors] = useState<Record<Step, string[]>>({
    basic: [],
    vision: [],
    risks: [],
    northstar: []
  })

  const [completedSteps, setCompletedSteps] = useState<Set<Step>>(new Set())

  const validateStep = (step: Step): string[] => {
    const errors: string[] = []
    
    switch (step) {
      case 'basic':
        if (!name.trim()) errors.push('Nome do produto é obrigatório')
        break
        
      case 'vision':
      case 'risks':
      case 'northstar':
        break
    }
    
    return errors
  }

  const handleNext = () => {
    console.log('Estado atual antes da validação:', {
      currentStep,
      vision,
      completedSteps: Array.from(completedSteps)
    })

    const errors = validateStep(currentStep)
    console.log('Erros encontrados:', errors)

    setFormErrors(prev => ({ ...prev, [currentStep]: errors }))
    
    if (errors.length === 0) {
      setCompletedSteps(prev => {
        const newSet = new Set(prev)
        newSet.add(currentStep)
        return newSet
      })

      const currentIndex = steps.indexOf(currentStep)
      if (currentIndex < steps.length - 1) {
        setCurrentStep(steps[currentIndex + 1])
      }
    } else {
      const errorMessage = errors.length === 1 
        ? errors[0]
        : `Por favor, preencha os seguintes campos: ${errors.join(', ')}`
      
      toast.error(errorMessage)
    }
  }

  const handleBack = () => {
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (!name.trim()) {
        toast.error('Nome do produto é obrigatório')
        return
      }

      // Formatar a visão do produto
      const formattedVision = `Para ${vision.targetAudience}
Que ${vision.problem}
Nosso ${name}
Oferece ${vision.solution}`.trim()

      if (mode === 'edit' && initialData?.id) {
        // Modo Edição
        await updateProduct.mutateAsync({
          id: initialData.id,
          data: {
            name,
            description,
            vision: formattedVision,
            target_audience: vision.targetAudience,
          }
        })

        toast.success('Produto atualizado com sucesso')
        router.push('/products')
        return
      }

      // Modo Criação
      const productData = {
        name,
        description,
        owner_id: null, // será preenchido pelo backend
        team: [],
        vision: formattedVision,
        target_audience: vision.targetAudience,
        status: 'active'
      }

      console.log('Dados para criação:', productData)

      const product = await createProduct.mutateAsync(productData)

      if (!product?.id) {
        throw new Error('ID do produto não retornado')
      }

      // Criar riscos se houver
      if (risks && Object.values(risks).some(arr => arr.length > 0)) {
        const riskPromises = Object.entries(risks).flatMap(([category, categoryRisks]) =>
          categoryRisks
            .filter(risk => risk.description.trim() && risk.mitigation.trim())
            .map(risk =>
              createProductRisk.mutateAsync({
                product_id: product.id,
                category: category.replace(/Risks$/, ''),
                description: risk.description.trim(),
                mitigation: risk.mitigation.trim()
              }).catch(error => {
                console.error(`Erro ao criar risco ${category}:`, error)
              })
            )
        )

        await Promise.all(riskPromises)
      }

      // Criar métricas HEART se houver
      if (vision.metrics) {
        const heartMetricPromises = Object.entries(vision.metrics)
          .filter(([_, value]) => value.trim())
          .map(([key, value]) =>
            createProductMetric.mutateAsync({
              product_id: product.id,
              type: 'heart',
              name: key,
              value: value.trim()
            }).catch(error => {
              console.error(`Erro ao criar métrica HEART ${key}:`, error)
            })
          )

        await Promise.all(heartMetricPromises)
      }

      // Criar métricas North Star se houver
      if (northStar) {
        const northStarMetricPromises = Object.entries(northStar)
          .filter(([_, value]) => value.trim())
          .map(([name, value]) =>
            createProductMetric.mutateAsync({
              product_id: product.id,
              type: 'north_star',
              name,
              value: value.trim()
            }).catch(error => {
              console.error(`Erro ao criar métrica North Star ${name}:`, error)
            })
          )

        await Promise.all(northStarMetricPromises)
      }

      toast.success('Produto criado com sucesso')
      router.push('/products')
    } catch (error) {
      console.error('Erro detalhado:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erro ao processar produto'
      toast.error(errorMessage)
    }
  }

  const handleStepClick = (step: Step) => {
    const targetIndex = steps.indexOf(step)
    const currentIndex = steps.indexOf(currentStep)

    // Só permite avançar um passo além do atual ou voltar para qualquer passo anterior
    if (targetIndex <= currentIndex + 1) {
      setCurrentStep(step)
    }
  }

  const renderNavigation = () => (
    <div className="flex justify-between mt-6">
      {currentStep !== 'basic' && (
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          className="flex items-center"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      )}
      
      {currentStep !== 'northstar' ? (
        <Button
          type="button"
          onClick={handleNext}
          className="ml-auto bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
        >
          Próximo
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      ) : (
        <Button
          type="submit"
          disabled={createProduct.isPending}
          className="ml-auto bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
        >
          {mode === 'edit' ? 'Editar Produto' : 'Criar Produto'}
        </Button>
      )}
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'basic':
        return renderBasicInfo()
      case 'vision':
        return renderVisionForm()
      case 'risks':
        return renderRisksForm()
      case 'northstar':
        return renderNorthStarForm()
      default:
        return null
    }
  }

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <AvatarUpload
          onChange={() => {}}
          className="shrink-0"
        />
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome do produto"
          required
          className="flex-1"
        />
      </div>

      <div>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrição do produto"
          required
          className="min-h-[120px]"
        />
      </div>
    </div>
  )

  const renderField = (
    label: string,
    value: string,
    onChange: (value: string) => void,
    placeholder: string,
    required = true
  ) => {
    const isEmpty = required && !value

    return (
      <div className="relative">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={cn(
            "transition-all duration-200",
            isEmpty && "border-red-200 focus:border-red-500",
            !isEmpty && value && "border-green-200 focus:border-green-500"
          )}
        />
        {!isEmpty && value && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        )}
      </div>
    )
  }

  const renderVisionForm = () => (
    <div className="space-y-8">
      {/* Cabeçalho Informativo */}
      <div className="flex items-start gap-4 p-4 bg-[var(--color-background-subtle)] rounded-lg border border-[var(--color-border)]">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
            Visão do Produto
          </h3>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Preencha o framework abaixo para definir uma visão clara e objetiva do seu produto.
          </p>
        </div>
      </div>

      {/* Framework de Visão */}
      <div className="space-y-8">
        {/* Para */}
        <div className="space-y-3">
          <div className="flex items-baseline gap-3">
            <span className="w-16 text-sm font-semibold text-[var(--color-primary)]">Para</span>
            <div className="flex-1 flex items-center gap-2">
              <Input
                value={vision.targetAudience}
                onChange={(e) => setVision({ ...vision, targetAudience: e.target.value })}
                placeholder="Qual é o seu público-alvo específico?"
                className={cn(
                  "flex-1",
                  vision.targetAudience?.trim() && "border-green-200 focus:border-green-500"
                )}
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="text-gray-400 hover:text-gray-600 transition-colors">
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-xs">
                      Ex: desenvolvedores independentes que criam produtos digitais
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* Que */}
        <div className="space-y-3">
          <div className="flex items-baseline gap-3">
            <span className="w-16 text-sm font-semibold text-[var(--color-primary)]">Que</span>
            <div className="flex-1 flex items-center gap-2">
              <Input
                value={vision.problem}
                onChange={(e) => setVision({ ...vision, problem: e.target.value })}
                placeholder="Qual problema ou necessidade eles enfrentam?"
                className={cn(
                  "flex-1",
                  vision.problem?.trim() && "border-green-200 focus:border-green-500"
                )}
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="text-gray-400 hover:text-gray-600 transition-colors">
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-xs">
                      Ex: precisam gerenciar o desenvolvimento de produtos de forma ágil e eficiente
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* Nosso */}
        <div className="space-y-3">
          <div className="flex items-baseline gap-3">
            <span className="w-16 text-sm font-semibold text-[var(--color-primary)]">Nosso</span>
            <div className="flex-1 flex items-center gap-2">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome do produto"
                className={cn(
                  "flex-1",
                  name?.trim() && "border-green-200 focus:border-green-500"
                )}
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      type="button" 
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Dicas para nome do produto"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-xs">
                      Digite um nome curto e memorável para seu produto
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* Oferece */}
        <div className="space-y-3">
          <div className="flex items-baseline gap-3">
            <span className="w-16 text-sm font-semibold text-[var(--color-primary)]">Oferece</span>
            <div className="flex-1 flex items-center gap-2">
              <Input
                value={vision.solution}
                onChange={(e) => setVision({ ...vision, solution: e.target.value })}
                placeholder="Qual é a sua solução única?"
                className={cn(
                  "flex-1",
                  vision.solution?.trim() && "border-green-200 focus:border-green-500"
                )}
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="text-gray-400 hover:text-gray-600 transition-colors">
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-xs">
                      Ex: uma plataforma intuitiva que integra gestão de produtos e métricas em um só lugar
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* Métricas HEART */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center gap-3">
            <span className="w-16 text-sm font-semibold text-[var(--color-primary)]">
              Medido por
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          
          <div className="grid gap-6 pl-[76px]">
            {Object.entries(vision.metrics).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center gap-4">
                  {/* Letra inicial à esquerda */}
                  <span className="text-xl font-bold text-[var(--color-primary)] w-6">
                    {key.charAt(0).toUpperCase()}
                  </span>
                  
                  <div className="flex-1">
                    {/* Nome completo em branco */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[var(--color-text-primary)]">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button 
                              type="button" 
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                              aria-label={`Sugestões para métrica ${key}`}
                            >
                              <HelpCircle className="w-3 h-3" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="max-w-xs p-3">
                            <p className="text-xs font-medium mb-2">Sugestões de métricas:</p>
                            <ul className="text-xs space-y-1">
                              {heartMetricSuggestions[key as keyof typeof heartMetricSuggestions].map((suggestion, index) => (
                                <li 
                                  key={index}
                                  className="cursor-pointer hover:text-[var(--color-primary)] transition-colors pl-2 border-l-2 border-transparent hover:border-[var(--color-primary)]"
                                  onClick={() => setVision({
                                    ...vision,
                                    metrics: { ...vision.metrics, [key]: suggestion }
                                  })}
                                >
                                  {suggestion}
                                </li>
                              ))}
                            </ul>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    
                    <Input
                      value={value}
                      onChange={(e) => setVision({
                        ...vision,
                        metrics: { ...vision.metrics, [key]: e.target.value }
                      })}
                      placeholder="Defina a métrica..."
                      className={cn(
                        value?.trim() && "border-green-200 focus:border-green-500"
                      )}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderRisksForm = () => {
    const addRisk = (category: keyof ProductRisks) => {
      setRisks(prev => ({
        ...prev,
        [category]: [...prev[category], { description: '', mitigation: '' }]
      }))
    }

    const removeRisk = (category: keyof ProductRisks, index: number) => {
      setRisks(prev => ({
        ...prev,
        [category]: prev[category].filter((_, i) => i !== index)
      }))
    }

    const updateRisk = (
      category: keyof ProductRisks, 
      index: number, 
      field: keyof Risk, 
      value: string
    ) => {
      setRisks(prev => ({
        ...prev,
        [category]: prev[category].map((risk, i) => 
          i === index ? { ...risk, [field]: value } : risk
        )
      }))
    }

    const riskCategories = {
      valueRisks: 'Valor',
      usabilityRisks: 'Usabilidade',
      feasibilityRisks: 'Viabilidade',
      businessRisks: 'Negócio'
    }

    return (
      <div className="space-y-8">
        {/* Cabeçalho Informativo */}
        <div className="flex items-start gap-4 p-4 bg-[var(--color-background-subtle)] rounded-lg border border-[var(--color-border)]">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
              Riscos e Mitigações
            </h3>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Identifique os principais riscos do produto e suas estratégias de mitigação.
            </p>
          </div>
        </div>

        {/* Categorias de Risco */}
        <div className="space-y-8">
          {(Object.entries(riskCategories) as [keyof ProductRisks, string][]).map(([category, title]) => (
            <div key={category} className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">
                  Riscos de {title}
                </h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addRisk(category)}
                  className="text-xs"
                >
                  Adicionar Risco
                </Button>
              </div>

              <div className="space-y-6">
                {risks[category].map((risk, index) => (
                  <div key={index} className="relative p-4 border rounded-lg bg-[var(--color-background-subtle)]">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2 h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                      onClick={() => removeRisk(category, index)}
                    >
                      ×
                    </Button>

                    <div className="space-y-4">
                      {/* Descrição do Risco */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium">Risco</label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button 
                                  type="button" 
                                  className="text-gray-400 hover:text-gray-600 transition-colors"
                                  aria-label={`Sugestões de riscos de ${title}`}
                                >
                                  <HelpCircle className="w-3 h-3" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="right" className="max-w-xs p-3">
                                <p className="text-xs font-medium mb-2">Sugestões de riscos:</p>
                                <ul className="text-xs space-y-1">
                                  {riskSuggestions[category].map((suggestion, i) => (
                                    <li 
                                      key={i}
                                      className="cursor-pointer hover:text-[var(--color-primary)] transition-colors pl-2 border-l-2 border-transparent hover:border-[var(--color-primary)]"
                                      onClick={() => updateRisk(category, index, 'description', suggestion)}
                                    >
                                      {suggestion}
                                    </li>
                                  ))}
                                </ul>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Textarea
                          value={risk.description}
                          onChange={(e) => updateRisk(category, index, 'description', e.target.value)}
                          placeholder={`Descreva o risco de ${title.toLowerCase()}...`}
                          className="min-h-[60px]"
                        />
                      </div>

                      {/* Mitigação */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium">Mitigação</label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button 
                                  type="button" 
                                  className="text-gray-400 hover:text-gray-600 transition-colors"
                                  aria-label={`Sugestões de mitigação para ${title}`}
                                >
                                  <HelpCircle className="w-3 h-3" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="right" className="max-w-xs p-3">
                                <p className="text-xs font-medium mb-2">Sugestões de mitigação:</p>
                                <ul className="text-xs space-y-1">
                                  {mitigationSuggestions[category].map((suggestion, i) => (
                                    <li 
                                      key={i}
                                      className="cursor-pointer hover:text-[var(--color-primary)] transition-colors pl-2 border-l-2 border-transparent hover:border-[var(--color-primary)]"
                                      onClick={() => updateRisk(category, index, 'mitigation', suggestion)}
                                    >
                                      {suggestion}
                                    </li>
                                  ))}
                                </ul>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Textarea
                          value={risk.mitigation}
                          onChange={(e) => updateRisk(category, index, 'mitigation', e.target.value)}
                          placeholder="Como você pretende mitigar este risco?"
                          className="min-h-[60px]"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {risks[category].length === 0 && (
                  <div className="text-center p-6 border border-dashed rounded-lg text-gray-400">
                    <p className="text-sm">
                      Nenhum risco adicionado. Clique em "Adicionar Risco" para começar.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderNorthStarForm = () => (
    <div className="space-y-8">
      {/* Cabeçalho Informativo */}
      <div className="flex items-start gap-4 p-4 bg-[var(--color-background-subtle)] rounded-lg border border-[var(--color-border)]">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
            Métrica North Star
          </h3>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Defina a métrica principal que guiará o sucesso do seu produto e alinhe toda a equipe em torno dela.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Métrica Principal */}
        <div className="space-y-3">
          <div className="flex items-baseline gap-3">
            <span className="w-32 text-sm font-semibold text-[var(--color-primary)]">Métrica</span>
            <div className="flex-1 flex items-center gap-2">
              <Input
                value={northStar.metric}
                onChange={(e) => setNorthStar({ ...northStar, metric: e.target.value })}
                placeholder="Qual é a sua métrica principal de sucesso?"
                className={cn(
                  "flex-1",
                  northStar.metric?.trim() && "border-green-200 focus:border-green-500"
                )}
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      type="button" 
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Sugestões de métricas North Star"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs p-3">
                    <p className="text-xs font-medium mb-2">Sugestões de métricas:</p>
                    <ul className="text-xs space-y-1">
                      {northStarSuggestions.metric.map((suggestion, index) => (
                        <li 
                          key={index}
                          className="cursor-pointer hover:text-[var(--color-primary)] transition-colors pl-2 border-l-2 border-transparent hover:border-[var(--color-primary)]"
                          onClick={() => setNorthStar(prev => ({ ...prev, metric: suggestion }))}
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* Meta */}
        <div className="space-y-3">
          <div className="flex items-baseline gap-3">
            <span className="w-32 text-sm font-semibold text-[var(--color-primary)]">Meta</span>
            <div className="flex-1 flex items-center gap-2">
              <Input
                value={northStar.target}
                onChange={(e) => setNorthStar({ ...northStar, target: e.target.value })}
                placeholder="Qual é o objetivo quantificável?"
                className={cn(
                  "flex-1",
                  northStar.target?.trim() && "border-green-200 focus:border-green-500"
                )}
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      type="button" 
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Sugestões de metas"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs p-3">
                    <p className="text-xs font-medium mb-2">Sugestões de metas:</p>
                    <ul className="text-xs space-y-1">
                      {northStarSuggestions.target.map((suggestion, index) => (
                        <li 
                          key={index}
                          className="cursor-pointer hover:text-[var(--color-primary)] transition-colors pl-2 border-l-2 border-transparent hover:border-[var(--color-primary)]"
                          onClick={() => setNorthStar(prev => ({ ...prev, target: suggestion }))}
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* Sinais */}
        <div className="space-y-3">
          <div className="flex items-baseline gap-3">
            <span className="w-32 text-sm font-semibold text-[var(--color-primary)]">Sinais</span>
            <div className="flex-1 flex items-center gap-2">
              <Input
                value={northStar.signals}
                onChange={(e) => setNorthStar({ ...northStar, signals: e.target.value })}
                placeholder="Como você vai medir esta métrica?"
                className={cn(
                  "flex-1",
                  northStar.signals?.trim() && "border-green-200 focus:border-green-500"
                )}
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      type="button" 
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Sugestões de sinais de medição"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs p-3">
                    <p className="text-xs font-medium mb-2">Sugestões de sinais:</p>
                    <ul className="text-xs space-y-1">
                      {northStarSuggestions.signals.map((suggestion, index) => (
                        <li 
                          key={index}
                          className="cursor-pointer hover:text-[var(--color-primary)] transition-colors pl-2 border-l-2 border-transparent hover:border-[var(--color-primary)]"
                          onClick={() => setNorthStar(prev => ({ ...prev, signals: suggestion }))}
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="space-y-3">
          <div className="flex items-baseline gap-3">
            <span className="w-32 text-sm font-semibold text-[var(--color-primary)]">Ações</span>
            <div className="flex-1 flex items-center gap-2">
              <Input
                value={northStar.actions}
                onChange={(e) => setNorthStar({ ...northStar, actions: e.target.value })}
                placeholder="Que ações são necessárias para atingir a meta?"
                className={cn(
                  "flex-1",
                  northStar.actions?.trim() && "border-green-200 focus:border-green-500"
                )}
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      type="button" 
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Sugestões de ações"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs p-3">
                    <p className="text-xs font-medium mb-2">Sugestões de ações:</p>
                    <ul className="text-xs space-y-1">
                      {northStarSuggestions.actions.map((suggestion, index) => (
                        <li 
                          key={index}
                          className="cursor-pointer hover:text-[var(--color-primary)] transition-colors pl-2 border-l-2 border-transparent hover:border-[var(--color-primary)]"
                          onClick={() => setNorthStar(prev => ({ ...prev, actions: suggestion }))}
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* Justificativa */}
        <div className="space-y-3">
          <div className="flex items-baseline gap-3">
            <span className="w-32 text-sm font-semibold text-[var(--color-primary)]">Justificativa</span>
            <div className="flex-1 flex items-start gap-2">
              <Textarea
                value={northStar.rationale}
                onChange={(e) => setNorthStar({ ...northStar, rationale: e.target.value })}
                placeholder="Por que esta é a mtrica mais importante para o sucesso do produto?"
                className={cn(
                  "flex-1 min-h-[100px]",
                  northStar.rationale?.trim() && "border-green-200 focus:border-green-500"
                )}
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      type="button" 
                      className="text-gray-400 hover:text-gray-600 transition-colors mt-2"
                      aria-label="Sugestões de justificativa"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs p-3">
                    <p className="text-xs font-medium mb-2">Sugestões de justificativa:</p>
                    <ul className="text-xs space-y-1">
                      {northStarSuggestions.rationale.map((suggestion, index) => (
                        <li 
                          key={index}
                          className="cursor-pointer hover:text-[var(--color-primary)] transition-colors pl-2 border-l-2 border-transparent hover:border-[var(--color-primary)]"
                          onClick={() => setNorthStar(prev => ({ ...prev, rationale: suggestion }))}
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Adicione esta função para debug
  useEffect(() => {
    console.log('Current Step:', currentStep)
    console.log('Form Errors:', formErrors)
    console.log('Completed Steps:', Array.from(completedSteps))
  }, [currentStep, formErrors, completedSteps])

  // Atualizar o título e botões baseado no modo
  const pageTitle = mode === 'edit' ? 'Editar Produto' : 'Novo Produto'
  const submitButtonText = mode === 'edit' ? 'Salvar Alterações' : 'Criar Produto'

  return (
    <div className="h-full flex flex-col -m-6">
      {/* Header */}
      <div className="bg-[var(--color-background-primary)]">
        <div className="h-14 px-4 flex items-center gap-4 border-b border-[var(--color-border)]">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => router.push('/products')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-sm font-medium text-[var(--color-text-primary)]">
              {pageTitle}
            </h1>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {stepTitles[currentStep]}
            </p>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-2xl mx-auto">
          <StepProgress 
            currentStep={currentStep} 
            onStepClick={handleStepClick}
            completedSteps={completedSteps}
            validationErrors={formErrors}
          />
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderCurrentStep()}
            {renderNavigation()}
          </form>
        </div>
      </div>
    </div>
  )
} 