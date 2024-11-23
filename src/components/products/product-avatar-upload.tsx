'use client'

import { useState } from 'react'
import { useProducts } from '@/hooks/use-products'
import { toast } from 'sonner'
import { ProductAvatar } from './product-avatar'
import { Upload } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface ProductAvatarUploadProps {
  productId: string
  name: string
  currentUrl?: string | null
}

export function ProductAvatarUpload({ productId, name, currentUrl }: ProductAvatarUploadProps) {
  const [isHovering, setIsHovering] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const { updateProduct } = useProducts()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)

      // Remover avatar antigo se existir
      if (currentUrl) {
        const oldPath = currentUrl.split('/').pop()
        if (oldPath) {
          await supabase.storage
            .from('avatars')
            .remove([oldPath])
        }
      }

      // Upload do novo avatar
      const fileExt = file.name.split('.').pop()
      const fileName = `${productId}-${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) throw uploadError

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      // Atualizar produto
      await updateProduct.mutateAsync({
        id: productId,
        data: { avatar_url: publicUrl }
      })

      toast.success('Avatar atualizado com sucesso')
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      toast.error('Erro ao atualizar avatar')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <label
      className={`relative cursor-pointer group ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />
      <div className="relative">
        <ProductAvatar
          src={currentUrl}
          className={`w-8 h-8 rounded-lg border border-[var(--color-border)] transition-all duration-200 ${
            isHovering ? 'opacity-50 scale-105' : ''
          }`}
          fallbackClassName="bg-gradient-to-br from-blue-500 to-purple-500"
        >
          {name.substring(0, 2).toUpperCase()}
        </ProductAvatar>
        {isHovering && !isUploading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Upload className="w-4 h-4 text-white animate-bounce" />
          </div>
        )}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </label>
  )
} 