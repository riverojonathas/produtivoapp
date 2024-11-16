'use client'

import { useState } from 'react'
import { Feature, FeatureStatus, FeaturePriority } from '@/types/product'
import { useFeatureValidation } from '@/hooks/use-feature-validation'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

interface FeatureFormProps {
  feature?: Feature
  existingFeatures: Feature[]
  personas?: Persona[]
  onSubmit: (data: Partial<Feature>) => Promise<void>
  isSubmitting?: boolean
  defaultValues?: Partial<Feature>
}

export function FeatureForm({ 
  feature, 
  existingFeatures, 
  personas = [],
  onSubmit,
  isSubmitting,
  defaultValues
}: FeatureFormProps) {
  const form = useForm<Feature>({
    defaultValues: defaultValues || {
      title: '',
      description: {
        what: '',
        why: '',
        how: '',
        who: ''
      },
      status: 'backlog',
      priority: 'medium',
      startDate: null,
      endDate: null,
      dependencies: [],
      assignees: [],
      tags: []
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Título */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <Input
                {...field}
                placeholder="Ex: Implementar sistema de notificações"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Descrição */}
        <div className="space-y-6">
          <h3 className="text-sm font-medium text-[var(--color-text-secondary)]">
            Descrição
          </h3>
          
          <FormField
            control={form.control}
            name="description.what"
            render={({ field }) => (
              <FormItem>
                <FormLabel>O que é?</FormLabel>
                <Textarea
                  {...field}
                  placeholder="Descreva o que é a feature e suas principais funcionalidades"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description.why"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Por quê?</FormLabel>
                <Textarea
                  {...field}
                  placeholder="Explique o motivo e o valor que essa feature trará"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description.who"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Para quem?</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a persona" />
                  </SelectTrigger>
                  <SelectContent>
                    {personas?.map(persona => (
                      <SelectItem key={persona.id} value={persona.id}>
                        {persona.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Status e Prioridade */}
        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="backlog">Backlog</SelectItem>
                    <SelectItem value="discovery">Discovery</SelectItem>
                    <SelectItem value="doing">Em Desenvolvimento</SelectItem>
                    <SelectItem value="done">Concluído</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prioridade</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Datas */}
        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Início</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent 
                    className="w-auto p-0 bg-[var(--color-background-primary)] border border-[var(--color-border)]"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      disabled={(date) => false}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Fim</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent 
                    className="w-auto p-0 bg-[var(--color-background-primary)] border border-[var(--color-border)]"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      disabled={(date) => false}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : feature ? 'Salvar' : 'Criar'}
          </Button>
        </div>
      </form>
    </Form>
  )
} 