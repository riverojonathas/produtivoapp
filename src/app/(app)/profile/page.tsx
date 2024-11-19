'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { 
  User2, 
  Mail, 
  Camera, 
  Phone, 
  Briefcase, 
  Package, 
  MapPin, 
  Building2,
  ChevronRight,
  LogOut,
  Monitor,
  LayoutDashboard,
  Sun,
  Moon
} from 'lucide-react'
import { countries, brazilianStates } from '@/data/locations'
import * as React from 'react'
import { debounce } from '@/utils/debounce'
import { Toast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { usePreferences } from '@/hooks/use-preferences'

// Tipos para os campos de seleção
const ROLES = [
  { value: 'product_manager', label: 'Product Manager' },
  { value: 'product_owner', label: 'Product Owner' },
  { value: 'product_designer', label: 'Product Designer' },
  { value: 'product_analyst', label: 'Product Analyst' },
  { value: 'product_marketing', label: 'Product Marketing Manager' },
  { value: 'tech_lead', label: 'Tech Lead' },
  { value: 'cto', label: 'CTO' },
  { value: 'founder', label: 'Founder' },
  { value: 'other', label: 'Outro' }
] as const

const PRODUCT_TYPES = [
  { value: 'saas', label: 'SaaS' },
  { value: 'mobile_app', label: 'Aplicativo Mobile' },
  { value: 'e_commerce', label: 'E-commerce' },
  { value: 'marketplace', label: 'Marketplace' },
  { value: 'fintech', label: 'Fintech' },
  { value: 'healthtech', label: 'Healthtech' },
  { value: 'edtech', label: 'Edtech' },
  { value: 'enterprise', label: 'Enterprise Software' },
  { value: 'b2b', label: 'B2B' },
  { value: 'b2c', label: 'B2C' },
  { value: 'other', label: 'Outro' }
] as const

interface ProfileFormData {
  name: string
  email: string
  avatar_url: string | null
  phone: string | null
  company: string | null
  role: typeof ROLES[number]['value'] | null
  product_type: typeof PRODUCT_TYPES[number]['value'] | null
  country: string | null
  state: string | null
  city: string | null
}

// Componente para formatar telefone
const formatPhone = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/g, '+55 ($1) $2')
    .replace(/(\d)(\d{4})$/, '$1-$2')
}

// Definir interface para os items da seção
interface ProfileSectionItem {
  type?: 'text' | 'select' | 'custom'
  icon?: React.ReactNode
  label: string
  value?: string | null
  placeholder?: string
  disabled?: boolean
  required?: boolean
  options?: Array<{ value: string, label: string }>
  onChange?: (value: string) => void
  action?: 'danger' | 'custom'
  customContent?: React.ReactNode
  onClick?: () => void
}

interface ProfileSection {
  title: string
  items: ProfileSectionItem[]
}

export default function ProfilePage() {
  const { theme, setTheme, density, setDensity } = usePreferences()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    email: '',
    avatar_url: null,
    phone: null,
    company: null,
    role: null,
    product_type: null,
    country: null,
    state: null,
    city: null
  })
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const supabase = createClientComponentClient()
  const router = useRouter()

  // Carregar dados do perfil ao montar o componente
  useEffect(() => {
    loadProfile()
  }, [])

  // Atualizar estado quando o país mudar
  useEffect(() => {
    if (formData.country !== 'BR') {
      setFormData(prev => ({ ...prev, state: null }))
    }
  }, [formData.country])

  // Carregar dados do perfil
  const loadProfile = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error

      if (profile) {
        setFormData({
          name: profile.name || '',
          email: profile.email,
          avatar_url: profile.avatar_url,
          phone: profile.phone,
          company: profile.company,
          role: profile.role,
          product_type: profile.product_type,
          country: profile.country,
          state: profile.state,
          city: profile.city
        })
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
      setMessage({ type: 'error', text: 'Erro ao carregar dados do perfil.' })
    } finally {
      setLoading(false)
    }
  }

  // Função para salvar alterações com debounce
  const saveChanges = React.useCallback(
    async (data: Partial<ProfileFormData>) => {
      try {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Usuário não encontrado')

        const { error } = await supabase
          .from('profiles')
          .update({
            ...data,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id)

        if (error) throw error

        setMessage({ type: 'success', text: 'Alterações salvas com sucesso!' })
        
        // Limpar mensagem após 3 segundos
        setTimeout(() => {
          setMessage(null)
        }, 3000)
      } catch (error) {
        console.error('Erro ao salvar alterações:', error)
        setMessage({ type: 'error', text: 'Erro ao salvar alterações. Tente novamente.' })
      } finally {
        setLoading(false)
      }
    },
    [supabase]
  )

  // Debounce para salvar alterações
  const debouncedSave = React.useCallback(
    debounce((data: Partial<ProfileFormData>) => saveChanges(data), 1000),
    [saveChanges]
  )

  // Handler para alterações nos campos
  const handleFieldChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value }
      debouncedSave({ [field]: value })
      return newData
    })
  }

  // Upload de avatar
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setLoading(true)
      const file = e.target.files?.[0]
      if (!file) return

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Validar tamanho do arquivo (2MB)
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('Arquivo muito grande. Tamanho máximo: 2MB')
      }

      // Validar tipo do arquivo
      if (!file.type.startsWith('image/')) {
        throw new Error('Tipo de arquivo inválido. Envie apenas imagens.')
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      // Upload do arquivo
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Atualizar perfil com nova URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)

      if (updateError) throw updateError

      setFormData(prev => ({ ...prev, avatar_url: publicUrl }))
      setMessage({ type: 'success', text: 'Avatar atualizado com sucesso!' })
    } catch (error: unknown) {
      console.error('Erro ao fazer upload do avatar:', error)
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Erro ao atualizar avatar. Tente novamente.' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      // Redirecionar para a página de login
      router.push('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      setMessage({ type: 'error', text: 'Erro ao fazer logout. Tente novamente.' })
    }
  }

  // Funções para manipulação do tema
  const handleThemeChange = async (newTheme: 'light' | 'dark') => {
    try {
      setLoading(true)
      await setTheme(newTheme)
    } catch (error) {
      console.error('Erro ao alterar tema:', error)
      setMessage({ type: 'error', text: 'Erro ao alterar tema' })
    } finally {
      setLoading(false)
    }
  }

  const handleDensityChange = async (newDensity: 'compact' | 'comfortable' | 'spacious') => {
    try {
      setLoading(true)
      await setDensity(newDensity)
    } catch (error) {
      console.error('Erro ao alterar densidade:', error)
      setMessage({ type: 'error', text: 'Erro ao alterar densidade' })
    } finally {
      setLoading(false)
    }
  }

  const sections: ProfileSection[] = [
    {
      title: 'Foto do Perfil',
      items: [
        {
          type: 'custom',
          label: 'Alterar foto do perfil',
          customContent: (
            <div className="flex items-center gap-4 px-4 py-3">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-[var(--color-background-secondary)] flex items-center justify-center overflow-hidden">
                  {formData.avatar_url ? (
                    <img 
                      src={formData.avatar_url} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User2 className="w-8 h-8 text-[var(--color-text-secondary)]" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[var(--color-primary)] text-white cursor-pointer hover:bg-[var(--color-primary-dark)] transition-colors">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    id="avatar-upload"
                    aria-label="Upload de foto de perfil"
                  />
                </label>
              </div>
              <div>
                <h3 className="font-medium text-[var(--color-text-primary)]">{formData.name || 'Seu Nome'}</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">Alterar foto do perfil</p>
              </div>
            </div>
          )
        }
      ]
    },
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
                disabled={loading}
                className="flex items-center gap-2"
              >
                <Sun className="w-4 h-4" />
                Claro
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleThemeChange('dark')}
                disabled={loading}
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
      ]
    },
    {
      title: 'Informações Básicas',
      items: [
        {
          type: 'text',
          icon: <User2 className="w-5 h-5" />,
          label: 'Nome',
          value: formData.name || '',
          placeholder: 'Seu nome completo',
          required: true,
          onChange: (value: string) => handleFieldChange('name', value)
        },
        {
          type: 'text',
          icon: <Mail className="w-5 h-5" />,
          label: 'Email',
          value: formData.email,
          disabled: true
        },
        {
          type: 'text',
          icon: <Phone className="w-5 h-5" />,
          label: 'Telefone',
          value: formData.phone || '',
          placeholder: '+55 (00) 00000-0000',
          onChange: (value: string) => handleFieldChange('phone', formatPhone(value))
        }
      ]
    },
    {
      title: 'Informações Profissionais',
      items: [
        {
          type: 'select',
          icon: <Briefcase className="w-4 h-4" />,
          label: 'Cargo',
          value: formData.role || '',
          options: Array.from(ROLES).map(role => ({
            value: role.value,
            label: role.label
          })),
          onChange: (value: string) => handleFieldChange('role', value)
        },
        {
          type: 'select',
          icon: <Package className="w-4 h-4" />,
          label: 'Tipo de Produto',
          value: formData.product_type || '',
          options: Array.from(PRODUCT_TYPES).map(type => ({
            value: type.value,
            label: type.label
          })),
          onChange: (value: string) => handleFieldChange('product_type', value)
        }
      ]
    },
    {
      title: 'Localização',
      items: [
        {
          type: 'select',
          icon: <MapPin className="w-4 h-4" />,
          label: 'País',
          value: formData.country || '',
          options: countries,
          required: true,
          onChange: (value) => handleFieldChange('country', value)
        },
        ...(formData.country === 'BR' ? [{
          type: 'select' as const,
          icon: <Building2 className="w-4 h-4" />,
          label: 'Estado',
          value: formData.state || '',
          options: brazilianStates,
          required: true,
          onChange: (value: string) => handleFieldChange('state', value)
        }] : []),
        {
          type: 'text',
          icon: <Building2 className="w-4 h-4" />,
          label: 'Cidade',
          value: formData.city || '',
          placeholder: 'Sua cidade',
          required: true,
          onChange: (value) => handleFieldChange('city', value)
        }
      ]
    },
    {
      title: 'Conta',
      items: [
        {
          type: 'custom',
          icon: <LogOut className="w-4 h-4" />,
          label: 'Sair da conta',
          customContent: (
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 flex items-center gap-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Sair da conta</span>
              <span className="ml-auto text-sm">Fazer logout</span>
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
            </button>
          )
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-[var(--color-background-secondary)] pb-16">
      <div className="max-w-2xl mx-auto">
        <div className="bg-[var(--color-background)] rounded-2xl border border-[var(--color-border)] divide-y divide-[var(--color-border)] mb-6">
          {sections.map((section, index) => (
            <div key={index} className="px-4 py-3">
              <h2 className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-secondary)] mb-3">
                {section.title}
              </h2>
              
              <div className="bg-[var(--color-background-elevated)] rounded-xl border border-[var(--color-border)] overflow-hidden divide-y divide-[var(--color-border)]">
                {section.items.map((item, itemIndex) => (
                  <div 
                    key={itemIndex}
                    className={cn(
                      "relative"
                    )}
                  >
                    {item.type === 'custom' ? (
                      item.customContent
                    ) : (
                      <div className={cn(
                        "flex items-center px-4 py-3 gap-3",
                        item.action === 'danger' && "text-red-500",
                        !item.disabled && "cursor-pointer hover:bg-[var(--color-background-secondary)]"
                      )}>
                        {item.icon && (
                          <div className="flex-shrink-0 text-[var(--color-text-secondary)]">
                            {item.icon}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-medium text-[var(--color-text-primary)]">
                              {item.label}
                            </span>
                            {item.type === 'text' ? (
                              <div className="flex-1 min-w-0">
                                <input
                                  type="text"
                                  value={item.value || ''}
                                  onChange={(e) => item.onChange?.(e.target.value)}
                                  placeholder={item.placeholder}
                                  disabled={item.disabled}
                                  className={cn(
                                    "w-full px-3 py-1.5 text-sm rounded-lg",
                                    "bg-[var(--color-background-secondary)]",
                                    "border border-[var(--color-border)]",
                                    "text-[var(--color-text-primary)]",
                                    "placeholder-[var(--color-text-tertiary)]",
                                    "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent",
                                    "disabled:opacity-50 disabled:bg-transparent disabled:border-none disabled:text-right",
                                    item.disabled ? "text-right" : "text-left"
                                  )}
                                />
                              </div>
                            ) : item.type === 'select' ? (
                              <button
                                onClick={() => {
                                  // Aqui você pode implementar um modal ou dropdown
                                  const selectedOption = item.options?.find(opt => opt.value === item.value)
                                  const newValue = window.prompt(
                                    `Selecione ${item.label}`,
                                    selectedOption?.label || ''
                                  )
                                  if (newValue) {
                                    const option = item.options?.find(opt => opt.label === newValue)
                                    if (option) {
                                      item.onChange?.(option.value)
                                    }
                                  }
                                }}
                                className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-[var(--color-background-secondary)] transition-colors"
                              >
                                <span className="text-sm text-[var(--color-text-secondary)]">
                                  {item.options?.find(opt => opt.value === item.value)?.label || 'Selecione...'}
                                </span>
                                <ChevronRight className="w-4 h-4 text-[var(--color-text-tertiary)] flex-shrink-0" />
                              </button>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-[var(--color-text-secondary)] truncate">
                                  {item.value}
                                </span>
                                {!item.disabled && (
                                  <ChevronRight className="w-4 h-4 text-[var(--color-text-tertiary)] flex-shrink-0" />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Toast 
          message={message} 
          onClose={() => setMessage(null)} 
        />
      </div>
    </div>
  )
} 