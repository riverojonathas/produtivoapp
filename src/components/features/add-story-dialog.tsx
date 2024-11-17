'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { UserStory } from '@/types/product'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFeatures } from '@/hooks/use-features'

interface AddStoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Partial<UserStory>) => Promise<void>
  isSubmitting?: boolean
}

const defaultValues: Partial<UserStory> = {
  featureId: '',
  title: '',
  description: {
    asA: '',
    iWant: '',
    soThat: ''
  },
  acceptanceCriteria: [],
  status: 'open',
  points: 1,
  assignees: []
}

export function AddStoryDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting
}: AddStoryDialogProps) {
  const { features } = useFeatures()
  const form = useForm<UserStory>({
    defaultValues
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nova História de Usuário</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Feature */}
            <FormField
              control={form.control}
              name="featureId"
              rules={{ required: 'Feature é obrigatória' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feature</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a feature" />
                    </SelectTrigger>
                    <SelectContent>
                      {features?.map(feature => (
                        <SelectItem key={feature.id} value={feature.id}>
                          {feature.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Título */}
            <FormField
              control={form.control}
              name="title"
              rules={{ required: 'Título é obrigatório' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <Input
                    {...field}
                    placeholder="Ex: Visualizar notificações não lidas"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Descrição */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-[var(--color-text-secondary)]">
                Descrição
              </h3>

              <FormField
                control={form.control}
                name="description.asA"
                rules={{ required: 'Campo obrigatório' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Como</FormLabel>
                    <Input
                      {...field}
                      placeholder="Ex: usuário do sistema"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description.iWant"
                rules={{ required: 'Campo obrigatório' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Eu quero</FormLabel>
                    <Input
                      {...field}
                      placeholder="Ex: visualizar minhas notificações não lidas"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description.soThat"
                rules={{ required: 'Campo obrigatório' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Para que</FormLabel>
                    <Input
                      {...field}
                      placeholder="Ex: eu possa me manter atualizado sobre as novidades"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Critérios de Aceitação */}
            <FormField
              control={form.control}
              name="acceptanceCriteria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Critérios de Aceitação</FormLabel>
                  <Textarea
                    value={field.value?.join('\n') || ''}
                    onChange={e => field.onChange(e.target.value.split('\n'))}
                    placeholder="Ex: - Deve mostrar um badge com o número de notificações&#10;- Deve marcar como lida ao clicar&#10;- Deve atualizar em tempo real"
                    className="h-24"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Story Points */}
            <FormField
              control={form.control}
              name="points"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Story Points</FormLabel>
                  <Select
                    value={field.value?.toString()}
                    onValueChange={value => field.onChange(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione os pontos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 ponto</SelectItem>
                      <SelectItem value="2">2 pontos</SelectItem>
                      <SelectItem value="3">3 pontos</SelectItem>
                      <SelectItem value="5">5 pontos</SelectItem>
                      <SelectItem value="8">8 pontos</SelectItem>
                      <SelectItem value="13">13 pontos</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Botões */}
            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : 'Criar História'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 