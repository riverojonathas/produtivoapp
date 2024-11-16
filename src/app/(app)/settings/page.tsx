'use client'

import { useEffect } from 'react'
import { 
  Monitor,
  Moon,
  SunMedium,
  Palette,
  Laptop,
  Maximize2,
  Minimize2,
  ChevronRight,
  Bell,
  Languages,
  Clock,
  Shield,
  KeyRound,
  HelpCircle,
  Info
} from 'lucide-react'
import { useTheme } from '@/hooks/use-theme'
import { cn } from '@/lib/utils'
import { Switch } from '@/components/ui/switch'
import { useSettings, ACCENT_COLORS } from '@/hooks/use-settings'

// Tipos de densidade da interface
type Density = 'comfortable' | 'compact'

interface SettingItem {
  icon: React.ReactNode
  label: string
  value?: string
  action: 'switch' | 'navigate' | 'color-picker'
  onClick?: () => void
  isActive?: boolean
  colors?: Record<string, { value: string, label: string, primary: string, light: string, dark: string }>
  selectedColor?: string
  onColorChange?: (color: string) => void
}

interface SettingSection {
  title: string
  items: SettingItem[]
}

const Settings = () => {
  const { theme, toggleTheme } = useTheme()
  const { 
    density, 
    language, 
    timezone,
    accentColor,
    setDensity,
    setLanguage,
    setTimezone,
    setAccentColor,
    loadSettings
  } = useSettings()

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  const languages = [
    { value: 'pt-BR', label: 'Português (Brasil)' },
    { value: 'en-US', label: 'English (US)' },
    { value: 'es-ES', label: 'Español' }
  ]

  const timezones = Intl.supportedValuesOf('timeZone').map(tz => ({
    value: tz,
    label: tz.replace(/_/g, ' ')
  }))

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
          onClick: () => {
            setDensity(density === 'comfortable' ? 'compact' : 'comfortable')
          },
          isActive: density === 'compact'
        },
        {
          icon: <Palette className="w-4 h-4" />,
          label: 'Cor de Destaque',
          action: 'color-picker',
          colors: Object.values(ACCENT_COLORS),
          selectedColor: accentColor,
          onColorChange: (color) => setAccentColor(color as any)
        }
      ]
    },
    {
      title: 'Preferências',
      items: [
        {
          icon: <Languages className="w-4 h-4" />,
          label: 'Idioma',
          value: 'Português',
          action: 'navigate'
        },
        {
          icon: <Clock className="w-4 h-4" />,
          label: 'Fuso Horário',
          value: 'São Paulo (GMT-3)',
          action: 'navigate'
        },
        {
          icon: <Bell className="w-4 h-4" />,
          label: 'Notificações',
          action: 'navigate'
        }
      ]
    },
    {
      title: 'Segurança',
      items: [
        {
          icon: <Shield className="w-4 h-4" />,
          label: 'Privacidade',
          action: 'navigate'
        },
        {
          icon: <KeyRound className="w-4 h-4" />,
          label: 'Senha e Autenticação',
          action: 'navigate'
        }
      ]
    },
    {
      title: 'Suporte',
      items: [
        {
          icon: <HelpCircle className="w-4 h-4" />,
          label: 'Central de Ajuda',
          action: 'navigate'
        },
        {
          icon: <Info className="w-4 h-4" />,
          label: 'Sobre',
          value: 'Versão 1.0.0',
          action: 'navigate'
        }
      ]
    }
  ]

  return (
    <div className="max-w-2xl mx-auto">
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
            <div className="bg-[var(--color-background-elevated)] rounded-lg border border-[var(--color-border)] overflow-hidden">
              {section.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 hover:bg-[var(--color-background-secondary)] transition-colors",
                    itemIndex !== 0 && "border-t border-[var(--color-border)]",
                    item.action === 'navigate' && "cursor-pointer"
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
                    ) : item.action === 'color-picker' ? (
                      <div className="flex gap-2">
                        {Object.values(ACCENT_COLORS).map((color) => (
                          <button
                            key={color.value}
                            onClick={() => item.onColorChange?.(color.value)}
                            className={cn(
                              "w-6 h-6 rounded-full transition-transform hover:scale-110",
                              item.selectedColor === color.value && "ring-2 ring-offset-2 ring-[var(--color-border)]"
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

export default Settings 