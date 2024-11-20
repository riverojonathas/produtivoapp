'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Settings2 } from 'lucide-react'
import { useCallback } from 'react'
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip"

export interface TableColumn {
  id: string
  label: string
  visible: boolean
}

interface TableColumnsConfigProps {
  columns: TableColumn[]
  onChange: (columns: TableColumn[]) => void
}

export function TableColumnsConfig({ columns, onChange }: TableColumnsConfigProps) {
  const handleColumnToggle = useCallback((columnId: string) => {
    const updatedColumns = columns.map(col => 
      col.id === columnId ? { ...col, visible: !col.visible } : col
    )
    onChange(updatedColumns)
  }, [columns, onChange])

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Settings2 className="w-3.5 h-3.5 mr-2" />
                Colunas
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <div className="px-2 py-1.5 text-sm font-medium">
                Colunas Visíveis
              </div>
              <DropdownMenuSeparator />
              {columns.map(column => (
                <DropdownMenuItem
                  key={column.id}
                  onClick={() => handleColumnToggle(column.id)}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded border ${
                        column.visible 
                          ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' 
                          : 'border-[var(--color-border)]'
                      } flex items-center justify-center`}
                    >
                      {column.visible && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-3 h-3 text-white"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <span>{column.label}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipTrigger>
        <TooltipContent 
          side="bottom"
          className="bg-[var(--color-background-primary)] border border-[var(--color-border)]"
        >
          <p className="text-xs">Configurar colunas visíveis</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
} 