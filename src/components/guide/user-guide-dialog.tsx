'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Target,
  Lightbulb,
  Sparkles,
  ListChecks
} from "lucide-react"
import { cn } from "@/lib/utils"

interface UserGuideDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const guides = [
  {
    title: 'Framework RICE',
    description: 'Como priorizar usando o framework RICE',
    content: (
      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="text-base font-medium mb-4">O que é o RICE?</h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">
            Um framework de priorização baseado em dados quantitativos que ajuda a tomar decisões mais objetivas.
          </p>

          <div className="space-y-6">
            {/* Como Funciona */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Target className="w-4 h-4" />
                Como Funciona
              </h4>
              <div className="grid gap-3">
                <div className="flex items-start gap-3 p-3 bg-[var(--color-background-subtle)] rounded-lg">
                  <Badge variant="secondary">R</Badge>
                  <div>
                    <p className="text-sm font-medium">Reach (Alcance)</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Número estimado de usuários impactados por trimestre
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[var(--color-background-subtle)] rounded-lg">
                  <Badge variant="secondary">I</Badge>
                  <div>
                    <p className="text-sm font-medium">Impact (Impacto)</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Quanto valor gera para cada usuário (0.25 = Mínimo, 3 = Massivo)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[var(--color-background-subtle)] rounded-lg">
                  <Badge variant="secondary">C</Badge>
                  <div>
                    <p className="text-sm font-medium">Confidence (Confiança)</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Nível de certeza nas estimativas (0-100%)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[var(--color-background-subtle)] rounded-lg">
                  <Badge variant="secondary">E</Badge>
                  <div>
                    <p className="text-sm font-medium">Effort (Esforço)</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Tempo estimado em pessoa-mês
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dicas */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Dicas e Boas Práticas
              </h4>
              <div className="grid gap-2">
                <div className="flex items-start gap-3 p-3 rounded-lg border border-[var(--color-border)]">
                  <Lightbulb className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                  <p className="text-sm">Use dados históricos para estimar o alcance</p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg border border-[var(--color-border)]">
                  <Lightbulb className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                  <p className="text-sm">Mantenha a escala de impacto consistente</p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg border border-[var(--color-border)]">
                  <Lightbulb className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                  <p className="text-sm">Seja conservador na confiança</p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg border border-[var(--color-border)]">
                  <Lightbulb className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                  <p className="text-sm">Considere todo o ciclo no esforço</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-base font-medium mb-4">Método MoSCoW</h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">
            Um método para classificar features por importância e urgência.
          </p>

          <div className="space-y-6">
            {/* Como Funciona */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <ListChecks className="w-4 h-4" />
                Como Funciona
              </h4>
              <div className="grid gap-3">
                <div className="flex items-start gap-3 p-3 bg-[var(--color-background-subtle)] rounded-lg">
                  <Badge variant="secondary" className="bg-red-100 text-red-700">Must</Badge>
                  <div>
                    <p className="text-sm font-medium">Must Have</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Essencial para o produto funcionar
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[var(--color-background-subtle)] rounded-lg">
                  <Badge variant="secondary" className="bg-amber-100 text-amber-700">Should</Badge>
                  <div>
                    <p className="text-sm font-medium">Should Have</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Importante mas não crítico
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[var(--color-background-subtle)] rounded-lg">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">Could</Badge>
                  <div>
                    <p className="text-sm font-medium">Could Have</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Desejável se houver recursos
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[var(--color-background-subtle)] rounded-lg">
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700">Won't</Badge>
                  <div>
                    <p className="text-sm font-medium">Won't Have</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Não será implementado agora
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dicas */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Dicas e Boas Práticas
              </h4>
              <div className="grid gap-2">
                <div className="flex items-start gap-3 p-3 rounded-lg border border-[var(--color-border)]">
                  <Lightbulb className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                  <p className="text-sm">Limite os Must Have a 60% do escopo</p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg border border-[var(--color-border)]">
                  <Lightbulb className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                  <p className="text-sm">Envolva stakeholders na classificação</p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg border border-[var(--color-border)]">
                  <Lightbulb className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                  <p className="text-sm">Revise periodicamente as prioridades</p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg border border-[var(--color-border)]">
                  <Lightbulb className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                  <p className="text-sm">Documente os critérios de decisão</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }
]

export function UserGuideDialog({ open, onOpenChange }: UserGuideDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Guia de Priorização</DialogTitle>
        </DialogHeader>

        {guides.map((guide, index) => (
          <div key={index}>
            {guide.content}
          </div>
        ))}
      </DialogContent>
    </Dialog>
  )
} 