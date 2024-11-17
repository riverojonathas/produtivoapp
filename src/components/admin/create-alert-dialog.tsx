'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAdminAlerts } from '@/hooks/use-admin-alerts'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'

export function CreateAlertDialog() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [type, setType] = useState<'info' | 'warning' | 'error' | 'success'>('info')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium')
  const { createAlert } = useAdminAlerts()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await createAlert.mutateAsync({
        title,
        message,
        type,
        priority,
        targetType: 'all'
      })

      toast.success('Alerta criado com sucesso!')
      setOpen(false)
      resetForm()
    } catch (error) {
      console.error('Erro ao criar alerta:', error)
      toast.error('Erro ao criar alerta')
    }
  }

  const resetForm = () => {
    setTitle('')
    setMessage('')
    setType('info')
    setPriority('medium')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]">
          <Plus className="w-4 h-4 mr-2" />
          Novo Alerta
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-[var(--color-text-primary)]">Criar Novo Alerta</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Input
              placeholder="Título do alerta"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="bg-[var(--color-background-subtle)] text-[var(--color-text-primary)]"
            />
          </div>

          <div className="space-y-2">
            <Textarea
              placeholder="Mensagem do alerta"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="bg-[var(--color-background-subtle)] text-[var(--color-text-primary)] min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Select
                value={type}
                onValueChange={(value: 'info' | 'warning' | 'error' | 'success') => setType(value)}
              >
                <SelectTrigger className="bg-[var(--color-background-subtle)] text-[var(--color-text-primary)]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Informação</SelectItem>
                  <SelectItem value="warning">Aviso</SelectItem>
                  <SelectItem value="error">Erro</SelectItem>
                  <SelectItem value="success">Sucesso</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Select
                value={priority}
                onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => setPriority(value)}
              >
                <SelectTrigger className="bg-[var(--color-background-subtle)] text-[var(--color-text-primary)]">
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="text-[var(--color-text-primary)]"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
            >
              Criar Alerta
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 