'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useFeatures } from '@/hooks/use-features'
import { toast } from 'sonner'
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface AddFeatureDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddFeatureDialog({ open, onOpenChange, onSuccess }: AddFeatureDialogProps) {
  const { features = [], updateFeature } = useFeatures()
  const [selectedFeature, setSelectedFeature] = useState<string>('')
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      if (!selectedFeature) {
        toast.error('Selecione uma feature')
        return
      }

      if (!startDate || !endDate) {
        toast.error('Selecione as datas de início e fim')
        return
      }

      await updateFeature.mutateAsync({
        id: selectedFeature,
        data: {
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString()
        }
      })

      toast.success('Feature adicionada ao roadmap')
      onSuccess?.()
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao adicionar feature:', error)
      toast.error('Erro ao adicionar feature ao roadmap')
    } finally {
      setIsSubmitting(false)
    }
  }

  const availableFeatures = features.filter(f => !f.start_date || !f.end_date)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Feature ao Roadmap</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Seleção de Feature */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Feature</label>
            <select
              value={selectedFeature}
              onChange={(e) => setSelectedFeature(e.target.value)}
              className="w-full h-9 rounded-md border border-[var(--color-border)] bg-[var(--color-background-primary)] px-3 text-sm"
            >
              <option value="">Selecione uma feature...</option>
              {availableFeatures.map(feature => (
                <option key={feature.id} value={feature.id}>
                  {feature.title}
                </option>
              ))}
            </select>
          </div>

          {/* Data de Início */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Data de Início</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP", { locale: ptBR }) : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Data de Término */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Data de Término</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP", { locale: ptBR }) : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  locale={ptBR}
                  disabled={(date) => startDate ? date < startDate : false}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedFeature || !startDate || !endDate}
          >
            {isSubmitting ? 'Adicionando...' : 'Adicionar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 