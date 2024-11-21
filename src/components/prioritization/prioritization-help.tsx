'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Target, 
  Users, 
  ArrowUp, 
  Gauge, 
  Clock,
  Sparkles,
  ListChecks,
  LayoutGrid
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PrioritizationHelpProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PrioritizationHelp({ open, onOpenChange }: PrioritizationHelpProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Como Priorizar Features</DialogTitle>
          <DialogDescription>
            Guia completo sobre os diferentes métodos de priorização
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="rice" className="mt-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="rice">RICE Score</TabsTrigger>
            <TabsTrigger value="moscow">MoSCoW</TabsTrigger>
            <TabsTrigger value="matrix">Matriz de Prioridade</TabsTrigger>
          </TabsList>

          <TabsContent value="rice" className="mt-4 space-y-4">
            <Card className="p-4">
              <h3 className="text-sm font-medium flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-[var(--color-primary)]" />
                Framework RICE
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                O framework RICE ajuda a priorizar features com base em quatro fatores:
              </p>

              <div className="grid gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-blue-100 dark:bg-blue-900">
                    <Users className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Reach (Alcance)</h4>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Quantos usuários serão impactados por trimestre? Considere o número de usuários que interagirão com a feature.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-red-100 dark:bg-red-900">
                    <ArrowUp className="w-4 h-4 text-red-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Impact (Impacto)</h4>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Qual o impacto por usuário? Use uma escala de 0.25 (mínimo) a 3 (massivo) para medir o impacto individual.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-amber-100 dark:bg-amber-900">
                    <Gauge className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Confidence (Confiança)</h4>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Qual sua confiança nas estimativas? Use uma porcentagem de 0 a 100% para indicar o nível de certeza.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-emerald-100 dark:bg-emerald-900">
                    <Clock className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Effort (Esforço)</h4>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Quanto esforço será necessário? Estime em pessoa-mês, usando a sequência 0.5, 1, 2, 3, 5, 8, 13.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-[var(--color-background-subtle)] rounded-lg">
                <h4 className="text-sm font-medium mb-2">Fórmula do RICE Score</h4>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  RICE = (Reach × Impact × Confidence) ÷ Effort
                </p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="moscow" className="mt-4 space-y-4">
            <Card className="p-4">
              <h3 className="text-sm font-medium flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
                Método MoSCoW
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                O método MoSCoW ajuda a classificar features por importância:
              </p>

              <div className="grid gap-4">
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <Badge variant="secondary" className="bg-red-100 text-red-700 mb-2">
                    Must Have
                  </Badge>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Features essenciais para o produto. Sem elas, o produto não funciona adequadamente.
                  </p>
                </div>

                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <Badge variant="secondary" className="bg-amber-100 text-amber-700 mb-2">
                    Should Have
                  </Badge>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Features importantes mas não críticas. Agregam valor significativo mas o produto funciona sem elas.
                  </p>
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 mb-2">
                    Could Have
                  </Badge>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Features desejáveis mas não essenciais. Serão implementadas se houver recursos disponíveis.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700 mb-2">
                    Won't Have
                  </Badge>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Features que não serão implementadas no momento. Podem ser reconsideradas no futuro.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="matrix" className="mt-4 space-y-4">
            <Card className="p-4">
              <h3 className="text-sm font-medium flex items-center gap-2 mb-2">
                <LayoutGrid className="w-4 h-4 text-[var(--color-primary)]" />
                Matriz de Prioridade
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                A matriz de prioridade organiza features por impacto e esforço:
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                  <h4 className="text-sm font-medium text-emerald-700 mb-2">Quick Wins</h4>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Alto impacto, baixo esforço. Prioridade máxima.
                  </p>
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-700 mb-2">Projetos Maiores</h4>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Alto impacto, alto esforço. Requer planejamento.
                  </p>
                </div>

                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <h4 className="text-sm font-medium text-amber-700 mb-2">Tarefas Menores</h4>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Baixo impacto, baixo esforço. Fazer quando possível.
                  </p>
                </div>

                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <h4 className="text-sm font-medium text-red-700 mb-2">Não Recomendado</h4>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Baixo impacto, alto esforço. Evitar ou repensar.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
} 