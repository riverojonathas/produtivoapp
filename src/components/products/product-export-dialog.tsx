'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileJson, FileText, Table, FileDown } from "lucide-react"
import { toast } from "sonner"

interface Product {
  id: string
  name: string
  description: string
  status: string
  team?: string[]
  created_at: string
  vision?: string
  target_audience?: string
  risks_count?: number
  metrics_count?: number
}

interface ProductExportDialogProps {
  products: Product[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductExportDialog({ products, open, onOpenChange }: ProductExportDialogProps) {
  const [isExporting, setIsExporting] = useState(false)

  const exportToCSV = () => {
    try {
      setIsExporting(true)
      const headers = ['Nome', 'Descrição', 'Status', 'Time', 'Criado em', 'Público-alvo', 'Riscos', 'Métricas']
      const rows = products.map(p => [
        p.name,
        p.description,
        p.status,
        p.team?.join(', ') || '',
        new Date(p.created_at).toLocaleDateString(),
        p.target_audience || '',
        p.risks_count || '0',
        p.metrics_count || '0'
      ])

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `produtos_${new Date().toISOString().split('T')[0]}.csv`
      link.click()
      
      toast.success('Produtos exportados com sucesso')
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao exportar CSV:', error)
      toast.error('Erro ao exportar produtos')
    } finally {
      setIsExporting(false)
    }
  }

  const exportToJSON = () => {
    try {
      setIsExporting(true)
      const jsonContent = JSON.stringify(products, null, 2)
      const blob = new Blob([jsonContent], { type: 'application/json' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `produtos_${new Date().toISOString().split('T')[0]}.json`
      link.click()
      
      toast.success('Produtos exportados com sucesso')
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao exportar JSON:', error)
      toast.error('Erro ao exportar produtos')
    } finally {
      setIsExporting(false)
    }
  }

  const exportToReport = () => {
    try {
      setIsExporting(true)
      let report = `RELATÓRIO DE PRODUTOS\n`
      report += `Gerado em: ${new Date().toLocaleString()}\n\n`
      report += `Total de Produtos: ${products.length}\n`
      report += `Produtos Ativos: ${products.filter(p => p.status === 'active').length}\n`
      report += `Produtos Arquivados: ${products.filter(p => p.status === 'archived').length}\n\n`

      products.forEach((p, index) => {
        report += `${index + 1}. ${p.name}\n`
        report += `   Status: ${p.status}\n`
        report += `   Descrição: ${p.description}\n`
        if (p.target_audience) report += `   Público-alvo: ${p.target_audience}\n`
        if (p.vision) report += `   Visão: ${p.vision}\n`
        if (p.team?.length) report += `   Time: ${p.team.join(', ')}\n`
        if (p.risks_count) report += `   Riscos: ${p.risks_count}\n`
        if (p.metrics_count) report += `   Métricas: ${p.metrics_count}\n`
        report += '\n'
      })

      const blob = new Blob([report], { type: 'text/plain;charset=utf-8' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `relatorio_produtos_${new Date().toISOString().split('T')[0]}.txt`
      link.click()
      
      toast.success('Relatório gerado com sucesso')
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao gerar relatório:', error)
      toast.error('Erro ao gerar relatório')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileDown className="w-4 h-4" />
            Exportar Produtos
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Button
            variant="outline"
            className="justify-start h-auto py-4"
            onClick={exportToCSV}
            disabled={isExporting}
          >
            <div className="flex items-start gap-4">
              <Table className="w-6 h-6 text-[var(--color-primary)]" />
              <div className="text-left">
                <div className="font-medium">CSV</div>
                <div className="text-sm text-[var(--color-text-secondary)]">
                  Exportar para planilha
                </div>
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="justify-start h-auto py-4"
            onClick={exportToJSON}
            disabled={isExporting}
          >
            <div className="flex items-start gap-4">
              <FileJson className="w-6 h-6 text-[var(--color-primary)]" />
              <div className="text-left">
                <div className="font-medium">JSON</div>
                <div className="text-sm text-[var(--color-text-secondary)]">
                  Exportar dados brutos
                </div>
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="justify-start h-auto py-4"
            onClick={exportToReport}
            disabled={isExporting}
          >
            <div className="flex items-start gap-4">
              <FileText className="w-6 h-6 text-[var(--color-primary)]" />
              <div className="text-left">
                <div className="font-medium">Relatório Detalhado</div>
                <div className="text-sm text-[var(--color-text-secondary)]">
                  Exportar relatório completo
                </div>
              </div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 