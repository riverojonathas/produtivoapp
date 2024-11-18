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
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface SprintConfigDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (config: SprintConfig) => void
  currentConfig?: SprintConfig
}

interface SprintConfig {
  startDate: Date
  duration: number
}

export function SprintConfigDialog({ 
  open, 
  onOpenChange, 
  onSave,
  currentConfig 
}: SprintConfigDialogProps) {
  const [config, setConfig] = useState<SprintConfig>(currentConfig || {
    startDate: new Date(),
    duration: 14 // Padrão de 2 semanas
  })

  const handleSave = () => {
    onSave(config)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configurar Sprints</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Data de Início */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Data de Início da Sprint</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !config.startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {config.startDate ? (
                    format(config.startDate, "PPP", { locale: ptBR })
                  ) : (
                    "Selecione uma data"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={config.startDate}
                  onSelect={(date) => date && setConfig(prev => ({ ...prev, startDate: date }))}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Duração da Sprint */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Duração da Sprint (dias)</label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="1"
                max="30"
                value={config.duration}
                onChange={(e) => setConfig(prev => ({ 
                  ...prev, 
                  duration: parseInt(e.target.value) || 14
                }))}
                className="flex-1"
              />
              <span className="text-sm text-[var(--color-text-secondary)]">dias</span>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {Math.floor(config.duration / 7)} semana(s) e {config.duration % 7} dia(s)
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 