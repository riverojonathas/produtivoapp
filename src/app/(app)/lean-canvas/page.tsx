'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCanvas } from '@/hooks/use-canvas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Plus,
  Save,
  FileText,
  Pencil,
  Check,
  X
} from 'lucide-react'
import { toast } from 'sonner'
import { CanvasLayout } from '@/components/lean-canvas/canvas-layout'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Canvas } from '@/types/canvas'

// Templates pré-definidos
const CANVAS_TEMPLATES = {
  blank: {
    id: 'blank',
    title: 'Canvas em Branco',
    description: 'Comece do zero',
    icon: '📝',
    sections: {
      problem: [],
      solution: [],
      metrics: [],
      proposition: [],
      advantage: [],
      channels: [],
      segments: [],
      costs: [],
      revenue: []
    }
  },
  saas: {
    id: 'saas',
    title: 'SaaS B2B',
    description: 'Template para produtos SaaS focados em empresas',
    icon: '💼',
    sections: {
      problem: [
        'Alto custo operacional',
        'Processos manuais e ineficientes',
        'Falta de visibilidade em tempo real'
      ],
      solution: [
        'Automação de processos-chave',
        'Interface intuitiva e moderna',
        'Dashboards em tempo real'
      ],
      metrics: [
        'MRR (Monthly Recurring Revenue)',
        'Churn Rate',
        'CAC (Customer Acquisition Cost)',
        'LTV (Lifetime Value)'
      ],
      proposition: [
        'Redução de custos operacionais',
        'Aumento de produtividade',
        'Decisões baseadas em dados'
      ],
      advantage: [
        'Tecnologia proprietária',
        'Integrações nativas',
        'Suporte especializado'
      ],
      channels: [
        'Marketing Digital',
        'Vendas Diretas',
        'Parcerias Estratégicas'
      ],
      segments: [
        'Empresas de médio porte',
        'Departamentos de TI',
        'Gestores de operações'
      ],
      costs: [
        'Desenvolvimento de produto',
        'Infraestrutura cloud',
        'Equipe de suporte',
        'Marketing e vendas'
      ],
      revenue: [
        'Assinatura mensal',
        'Setup fee',
        'Serviços profissionais',
        'Add-ons premium'
      ]
    }
  },
  marketplace: {
    id: 'marketplace',
    title: 'Marketplace',
    description: 'Template para plataformas de marketplace',
    icon: '🛍️',
    sections: {
      problem: [
        'Dificuldade em conectar compradores e vendedores',
        'Falta de confiança nas transações',
        'Processos de pagamento complexos'
      ],
      // ... outras seções
    }
  }
}

export default function LeanCanvasPage() {
  const router = useRouter()
  const { createCanvas } = useCanvas()
  const [isCreating, setIsCreating] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [title, setTitle] = useState('Novo Canvas')
  const [isSaving, setIsSaving] = useState(false)
  const [sections, setSections] = useState<Canvas['sections']>(CANVAS_TEMPLATES.blank.sections)

  // Criar novo canvas
  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error('Digite um título para o canvas')
      return
    }

    try {
      setIsSaving(true)
      const newCanvas = await createCanvas({
        title: title.trim(),
        sections,
        status: 'draft'
      })

      if (newCanvas?.id) {
        toast.success('Canvas criado com sucesso!')
        router.push(`/lean-canvas/${newCanvas.id}`)
      } else {
        throw new Error('Erro ao criar canvas')
      }
    } catch (error) {
      console.error('Erro ao criar:', error)
      toast.error('Erro ao criar canvas. Tente novamente.')
    } finally {
      setIsSaving(false)
    }
  }

  // Atualizar seções do template
  const handleSectionUpdate = (sectionId: keyof Canvas['sections'], content: string[]) => {
    setSections(prev => ({
      ...prev,
      [sectionId]: content
    }))
  }

  // Aplicar template
  const handleTemplateSelect = (templateId: keyof typeof CANVAS_TEMPLATES) => {
    setSections(CANVAS_TEMPLATES[templateId].sections)
    setShowTemplates(false)
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-medium">Lean Canvas</h1>
              <span className="text-xs text-[var(--color-text-secondary)]">
                Novo Canvas
              </span>
            </div>

            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título..."
              className="h-8 w-[200px]"
            />
          </div>

          <div className="h-4 w-px bg-[var(--color-border)]" />

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8"
              onClick={() => setShowTemplates(true)}
            >
              <FileText className="w-3.5 h-3.5 mr-2" />
              Templates
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            onClick={handleCreate}
            disabled={isSaving || !title.trim()}
          >
            <Save className="w-3.5 h-3.5 mr-2" />
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <CanvasLayout
        sections={sections}
        onSectionUpdate={handleSectionUpdate}
        isEditing={true}
      />

      {/* Dialog de Templates */}
      <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Escolha um Template</DialogTitle>
            <DialogDescription>
              Comece mais rápido usando um template pré-definido
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            {Object.entries(CANVAS_TEMPLATES).map(([key, template]) => (
              <Button
                key={key}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start gap-2"
                onClick={() => handleTemplateSelect(key as keyof typeof CANVAS_TEMPLATES)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{template.icon}</span>
                  <span className="font-medium">{template.title}</span>
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] text-left">
                  {template.description}
                </p>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 