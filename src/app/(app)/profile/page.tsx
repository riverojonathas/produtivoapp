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
  Image as ImageIcon,
  LogOut
} from 'lucide-react'
import { Combobox } from '@/components/ui/combobox'
import { countries, brazilianStates } from '@/data/locations'
import * as React from 'react'
import { debounce } from '@/utils/debounce'
import { Toast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'
import { ProfileField } from '@/components/ui/profile-field'

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

export default function ProfilePage() {
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
  const [showStates, setShowStates] = useState(false)
  
  const supabase = createClientComponentClient()
  const router = useRouter()

  // Carregar dados do perfil ao montar o componente
  useEffect(() => {
    loadProfile()
  }, [])

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
  const handleFieldChange = (field: keyof ProfileFormData, value: any) => {
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
    } catch (error: any) {
      console.error('Erro ao fazer upload do avatar:', error)
      setMessage({ 
        type: 'error', 
        text: error.message || 'Erro ao atualizar avatar. Tente novamente.' 
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (formData.country === 'BR') {
      setShowStates(true)
    } else {
      setShowStates(false)
      setFormData(prev => ({ ...prev, state: null }))
    }
  }, [formData.country])

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

  const sections = [
    {
      title: 'Foto do Perfil',
      items: [
        {
          icon: <ImageIcon className="w-4 h-4" />,
          label: 'Alterar foto',
          value: 'JPG, GIF ou PNG. Máx 2MB',
          action: 'custom',
          customContent: (
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-[var(--color-background-secondary)] flex items-center justify-center overflow-hidden">
                {formData.avatar_url ? (
                  <img 
                    src={formData.avatar_url} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User2 className="w-6 h-6 text-[var(--color-text-secondary)]" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-1 rounded-full bg-[var(--color-primary)] text-white cursor-pointer hover:bg-[var(--color-primary-dark)] transition-colors">
                <Camera className="w-3 h-3" />
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
          )
        }
      ]
    },
    {
      title: 'Informações Básicas',
      items: [
        {
          type: 'text',
          icon: <User2 className="w-4 h-4" />,
          label: 'Nome',
          value: formData.name || '',
          placeholder: 'Seu nome completo',
          required: true,
          onChange: (value) => handleFieldChange('name', value)
        },
        {
          type: 'text',
          icon: <Mail className="w-4 h-4" />,
          label: 'Email',
          value: formData.email,
          disabled: true
        },
        {
          type: 'text',
          icon: <Phone className="w-4 h-4" />,
          label: 'Telefone',
          value: formData.phone || '',
          placeholder: 'Seu telefone',
          onChange: (value) => handleFieldChange('phone', formatPhone(value))
        },
        {
          type: 'text',
          icon: <Building2 className="w-4 h-4" />,
          label: 'Empresa',
          value: formData.company || '',
          placeholder: 'Nome da empresa',
          onChange: (value) => handleFieldChange('company', value)
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
          options: ROLES,
          onChange: (value) => handleFieldChange('role', value)
        },
        {
          type: 'select',
          icon: <Package className="w-4 h-4" />,
          label: 'Tipo de Produto',
          value: formData.product_type || '',
          options: PRODUCT_TYPES,
          onChange: (value) => handleFieldChange('product_type', value)
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
          type: 'select',
          icon: <Building2 className="w-4 h-4" />,
          label: 'Estado',
          value: formData.state || '',
          options: brazilianStates,
          required: true,
          onChange: (value) => handleFieldChange('state', value)
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
          icon: <LogOut className="w-4 h-4" />,
          label: 'Sair da conta',
          value: 'Fazer logout',
          action: 'danger',
          onClick: handleLogout
        }
      ]
    }
  ]

  return (
    <div className="max-w-2xl mx-auto">
      <Toast 
        message={message} 
        onClose={() => setMessage(null)} 
      />

      <div className="mb-8">
        <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">Seu Perfil</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Gerencie suas informações pessoais
        </p>
      </div>

      <div className="space-y-6">
        {sections.map((section, index) => (
          <div key={index} className="space-y-2">
            <h2 className="text-sm font-medium text-[var(--color-text-secondary)] px-4">
              {section.title}
            </h2>
            <div className="bg-[var(--color-background-elevated)] rounded-lg border border-[var(--color-border)] overflow-hidden divide-y divide-[var(--color-border)]">
              {section.items.map((item, itemIndex) => {
                if (item.action === 'custom') {
                  return (
                    <div key={itemIndex} className="px-4 py-3">
                      {item.customContent}
                    </div>
                  )
                }

                if (item.action === 'danger') {
                  return (
                    <div
                      key={itemIndex}
                      onClick={item.onClick}
                      className="flex items-center justify-between px-4 py-3 hover:bg-red-50 dark:hover:bg-red-950 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-red-500">
                          {item.icon}
                        </div>
                        <span className="text-sm text-red-500 font-medium">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-sm text-red-500">
                        {item.value}
                      </span>
                    </div>
                  )
                }

                return (
                  <ProfileField
                    key={itemIndex}
                    {...item}
                  />
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 