'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Settings2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { STATUS_LABELS } from '@/hooks/use-admin-alerts'

interface EditAlertDialogProps {
  alert: {
    id: string
    status: string
    scheduled_for?: string | null
  }
  onUpdateAlert: (id: string, data: { status: string, scheduled_for?: string | null }) => Promise<void>
}

export function EditAlertDialog({ alert, onUpdateAlert }: EditAlertDialogProps) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState(alert.status)
  const [date, setDate] = useState<Date | undefined>(
    alert.scheduled_for ? new Date(alert.scheduled_for) : undefined
  )
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    try {
      setIsLoading(true)

      if (status === 'scheduled' && !date) {
        toast.error('Selecione uma data para agendar o alerta')
        return
      }

      await onUpdateAlert(alert.id, {
        status,
        scheduled_for: status === 'scheduled' ? date?.toISOString() : null
      })

      toast.success('Alerta atualizado com sucesso')
      setOpen(false)
    } catch (error) {
      console.error('Erro ao atualizar alerta:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar alerta')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs h-7 px-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
        >
          <Settings2 className="w-3 h-3 mr-1" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Alerta</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-[var(--color-text-primary)]">
              Status
            </label>
            <Select
              value={status}
              onValueChange={setStatus}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {status === 'scheduled' && (
            <div className="grid gap-2">
              <label className="text-sm font-medium text-[var(--color-text-primary)]">
                Data de Envio
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: ptBR }) : "Selecione uma data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
            disabled={isLoading}
          >
            {isLoading ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 