'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Feature } from "@/types/product"
import { toast } from "sonner"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Download, FileJson, FileText, Table } from "lucide-react"
import { cn } from "@/lib/utils"

interface RoadmapExportDialogProps {
  features: Feature[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

type ExportFormat = 'csv' | 'json' | 'text'

export function RoadmapExportDialog({ features, open, onOpenChange }: RoadmapExportDialogProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('csv')
  const [isExporting, setIsExporting] = useState(false)

  const formatOptions = [
    {
      id: 'csv' as const,
      label: 'CSV',
      description: 'Planilha compatível com Excel',
      icon: Table
    },
    {
      id: 'json' as const,
      label: 'JSON',
      description: 'Formato para integração',
      icon: FileJson
    },
    {
      id: 'text' as const,
      label: 'Texto',
      description: 'Documento de texto simples',
      icon: FileText
    }
  ]

  const exportRoadmap = async () => {
    try {
      setIsExporting(true)

      let content = ''
      const fileName = `roadmap-${format(new Date(), 'yyyy-MM-dd')}`

      switch (selectedFormat) {
        case 'csv':
          content = 'Feature,Status,Início,Término,Prioridade,RICE Score,MoSCoW\n'
          content += features.map(feature => [
            `"${feature.title}"`,
            feature.status,
            feature.start_date ? format(new Date(feature.start_date), 'dd/MM/yyyy') : '',
            feature.end_date ? format(new Date(feature.end_date), 'dd/MM/yyyy') : '',
            feature.priority,
            feature.rice_score || '',
            feature.moscow_priority || ''
          ].join(',')).join('\n')
          break

        case 'json':
          content = JSON.stringify(features.map(feature => ({
            title: feature.title,
            status: feature.status,
            start_date: feature.start_date,
            end_date: feature.end_date,
            priority: feature.priority,
            rice_score: feature.rice_score,
            moscow_priority: feature.moscow_priority
          })), null, 2)
          break

        case 'text':
          content = features.map(feature => (
            `Feature: ${feature.title}\n` +
            `Status: ${feature.status}\n` +
            `Início: ${feature.start_date ? format(new Date(feature.start_date), 'dd/MM/yyyy') : 'Não definido'}\n` +
            `Término: ${feature.end_date ? format(new Date(feature.end_date), 'dd/MM/yyyy') : 'Não definido'}\n` +
            `Prioridade: ${feature.priority}\n` +
            `RICE Score: ${feature.rice_score || 'Não calculado'}\n` +
            `MoSCoW: ${feature.moscow_priority || 'Não definido'}\n\n`
          )).join('---\n\n')
          break
      }

      // Criar blob e download
      const blob = new Blob([content], { 
        type: selectedFormat === 'json' 
          ? 'application/json' 
          : selectedFormat === 'csv'
          ? 'text/csv'
          : 'text/plain'
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${fileName}.${selectedFormat}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success('Roadmap exportado com sucesso')
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao exportar roadmap:', error)
      toast.error('Erro ao exportar roadmap')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar Roadmap
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {formatOptions.map((format) => (
            <Button
              key={format.id}
              variant="outline"
              className={cn(
                "justify-start h-auto py-4",
                format.id === selectedFormat && "border-[var(--color-primary)] bg-[var(--color-primary-subtle)]"
              )}
              onClick={() => setSelectedFormat(format.id)}
            >
              <div className="flex items-center gap-3">
                <format.icon className="w-4 h-4 text-[var(--color-text-secondary)]" />
                <div className="flex flex-col items-start">
                  <span className="font-medium">{format.label}</span>
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    {format.description}
                  </span>
                </div>
              </div>
            </Button>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isExporting}
          >
            Cancelar
          </Button>
          <Button
            onClick={exportRoadmap}
            disabled={isExporting}
          >
            {isExporting ? 'Exportando...' : 'Exportar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 