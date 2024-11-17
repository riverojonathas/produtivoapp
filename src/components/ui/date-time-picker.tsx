'use client'

import * as React from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { Input } from './input'

interface DateTimePickerProps {
  value?: Date | null
  onChange?: (date: Date | null) => void
  placeholder?: string
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = 'Selecione a data e hora'
}: DateTimePickerProps) {
  const [date, setDate] = React.useState<Date | null>(value || null)
  const [timeInput, setTimeInput] = React.useState(
    value ? format(value, 'HH:mm') : ''
  )

  const handleDateSelect = (newDate: Date | null) => {
    setDate(newDate)
    if (newDate && timeInput) {
      const [hours, minutes] = timeInput.split(':')
      newDate.setHours(parseInt(hours), parseInt(minutes))
      onChange?.(newDate)
    }
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeInput(e.target.value)
    if (date && e.target.value) {
      const [hours, minutes] = e.target.value.split(':')
      const newDate = new Date(date)
      newDate.setHours(parseInt(hours), parseInt(minutes))
      onChange?.(newDate)
    }
  }

  return (
    <div className="flex gap-2">
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
            {date ? format(date, "dd 'de' MMM',' yyyy", { locale: ptBR }) : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <Input
        type="time"
        value={timeInput}
        onChange={handleTimeChange}
        className="w-[120px]"
      />
    </div>
  )
} 