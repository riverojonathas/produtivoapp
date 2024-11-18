'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Moon, Sun, Monitor, LayoutDashboard } from "lucide-react"
import { usePreferences } from "@/hooks/use-preferences"
import { useEffect } from "react"
import { Toast } from '@/components/ui/toast'

interface SettingsItem {
  type: 'custom' | 'select'
  icon: React.ReactNode
  label: string
  value?: string
  options?: Array<{ value: string, label: string }>
  onChange?: (value: string) => void | Promise<void>
  customContent?: React.ReactNode
}

export default function SettingsPage() {
  const { theme, setTheme, density, setDensity, syncPreferences } = usePreferences()
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    syncPreferences().catch(console.error)
  }, [syncPreferences])

  const handleThemeChange = async (newTheme: 'light' | 'dark') => {
    try {
      setIsLoading(true)
      await setTheme(newTheme)
      setMessage({ type: 'success', text: 'Tema atualizado com sucesso!' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao atualizar tema' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDensityChange = async (newDensity: 'compact' | 'comfortable' | 'spacious') => {
    try {
      setIsLoading(true)
      await setDensity(newDensity)
      setMessage({ type: 'success', text: 'Densidade atualizada com sucesso!' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao atualizar densidade' })
    } finally {
      setIsLoading(false)
    }
  }

  const sections = [
    {
      title: 'Aparência',
      items: [
        {
          type: 'custom',
          icon: <Monitor className="w-4 h-4" />,
          label: 'Tema',
          customContent: (
            <div className="flex gap-2">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleThemeChange('light')}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Sun className="w-4 h-4" />
                Claro
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleThemeChange('dark')}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Moon className="w-4 h-4" />
                Escuro
              </Button>
            </div>
          )
        },
        {
          type: 'select',
          icon: <LayoutDashboard className="w-4 h-4" />,
          label: 'Densidade',
          value: density || 'comfortable',
          options: [
            { value: 'compact', label: 'Compacta' },
            { value: 'comfortable', label: 'Confortável' },
            { value: 'spacious', label: 'Espaçada' }
          ],
          onChange: (value) => handleDensityChange(value as 'compact' | 'comfortable' | 'spacious')
        }
      ] as SettingsItem[]
    }
  ]

  return (
    <div className="max-w-2xl mx-auto">
      {message && (
        <Toast 
          message={message} 
          onClose={() => setMessage(null)} 
        />
      )}

      <div className="mb-8">
        <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">Configurações</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Personalize sua experiência
        </p>
      </div>

      <div className="space-y-6">
        {sections.map((section, index) => (
          <div key={index} className="space-y-2">
            <h2 className="text-sm font-medium text-[var(--color-text-secondary)] px-4">
              {section.title}
            </h2>
            <div className="bg-[var(--color-background-elevated)] rounded-lg border border-[var(--color-border)] overflow-hidden divide-y divide-[var(--color-border)]">
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-[var(--color-text-secondary)]">
                      {item.icon}
                    </div>
                    <span className="text-sm font-medium">
                      {item.label}
                    </span>
                  </div>
                  {item.type === 'custom' ? item.customContent : (
                    <select
                      value={item.value}
                      onChange={(e) => item.onChange?.(e.target.value)}
                      className="h-9 rounded-md border border-[var(--color-border)] bg-[var(--color-background-primary)] px-3 text-sm"
                    >
                      {item.options?.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 