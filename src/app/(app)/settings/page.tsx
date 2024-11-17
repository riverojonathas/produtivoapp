'use client'

import { 
  Palette,
  Maximize2,
  ChevronRight,
} from 'lucide-react'
import { useTheme } from '@/hooks/use-theme'
import { cn } from '@/lib/utils'
import { Switch } from '@/components/ui/switch'
import { useSettings, ACCENT_COLORS } from '@/hooks/use-settings'
import { toast } from 'sonner'

type AccentColor = keyof typeof ACCENT_COLORS

interface SettingItem {
  icon: React.ReactNode
  label: string
  value?: string
  action: 'switch' | 'color-picker' | 'navigate'
  onClick?: () => void
  isActive?: boolean
  colors?: typeof ACCENT_COLORS
  selectedColor?: AccentColor
  onColorChange?: (color: AccentColor) => void
}

interface SettingSection {
  title: string
  items: SettingItem[]
}

export default function Settings() {
  const { theme, toggleTheme } = useTheme()
  const { 
    accentColor,
    density,
    setAccentColor,
    setDensity,
  } = useSettings()

  const handleColorChange = async (color: AccentColor) => {
    try {
      await setAccentColor(color)
      toast.success('Cor atualizada com sucesso!')
      
      // Atualizar variáveis CSS
      const root = document.documentElement
      root.style.setProperty('--color-primary', ACCENT_COLORS[color].primary)
      root.style.setProperty('--color-primary-dark', ACCENT_COLORS[color].dark)
      root.style.setProperty('--color-primary-light', ACCENT_COLORS[color].light)
    } catch (error) {
      toast.error('Erro ao atualizar cor')
    }
  }

  const sections: SettingSection[] = [
    {
      title: 'Aparência',
      items: [
        {
          icon: <Palette className="w-4 h-4" />,
          label: 'Tema',
          value: theme === 'dark' ? 'Escuro' : 'Claro',
          action: 'switch',
          onClick: toggleTheme,
          isActive: theme === 'dark'
        },
        {
          icon: <Maximize2 className="w-4 h-4" />,
          label: 'Densidade',
          value: density === 'comfortable' ? 'Confortável' : 'Compacta',
          action: 'switch',
          onClick: () => setDensity(density === 'comfortable' ? 'compact' : 'comfortable'),
          isActive: density === 'compact'
        },
        {
          icon: <Palette className="w-4 h-4" />,
          label: 'Cor de Destaque',
          action: 'color-picker',
          colors: ACCENT_COLORS,
          selectedColor: accentColor as AccentColor,
          onColorChange: handleColorChange
        }
      ]
    }
  ]

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">
          Configurações
        </h1>
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
            <div className="bg-[var(--color-background-elevated)] rounded-lg border border-[var(--color-border)] overflow-hidden">
              {section.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 hover:bg-[var(--color-background-secondary)] transition-colors",
                    itemIndex !== 0 && "border-t border-[var(--color-border)]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-[var(--color-text-secondary)]">
                      {item.icon}
                    </div>
                    <span className="text-sm text-[var(--color-text-primary)]">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {item.action === 'switch' ? (
                      <>
                        {item.value && (
                          <span className="text-sm text-[var(--color-text-secondary)]">
                            {item.value}
                          </span>
                        )}
                        <Switch
                          checked={item.isActive}
                          onCheckedChange={item.onClick}
                          className="data-[state=checked]:bg-[var(--color-primary)]"
                        />
                      </>
                    ) : item.action === 'color-picker' && item.colors ? (
                      <div className="flex gap-2">
                        {Object.entries(item.colors).map(([key, color]) => (
                          <button
                            key={key}
                            onClick={() => item.onColorChange?.(key as AccentColor)}
                            className={cn(
                              "w-6 h-6 rounded-full transition-transform hover:scale-110",
                              item.selectedColor === key && "ring-2 ring-offset-2 ring-[var(--color-border)]"
                            )}
                            style={{ backgroundColor: color.primary }}
                            title={color.label}
                          />
                        ))}
                      </div>
                    ) : (
                      <>
                        {item.value && (
                          <span className="text-sm text-[var(--color-text-secondary)]">
                            {item.value}
                          </span>
                        )}
                        <ChevronRight className="w-4 h-4 text-[var(--color-text-secondary)]" />
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 