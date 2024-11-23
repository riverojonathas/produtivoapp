'use client'

import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { useProducts } from '@/hooks/use-products'
import { toast } from 'sonner'
import { Pencil } from 'lucide-react'

interface ProductNameEditProps {
  productId: string
  initialName: string
}

export function ProductNameEdit({ productId, initialName }: ProductNameEditProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(initialName)
  const inputRef = useRef<HTMLInputElement>(null)
  const { updateProduct } = useProducts()

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    
    if (!name.trim() || name === initialName) {
      setIsEditing(false)
      setName(initialName)
      return
    }

    try {
      await updateProduct.mutateAsync({
        id: productId,
        data: { name: name.trim() }
      })
      setIsEditing(false)
      toast.success('Nome atualizado com sucesso')
    } catch (error) {
      console.error(error)
      toast.error('Erro ao atualizar nome')
      setName(initialName)
    }
  }

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="flex-1">
        <Input
          ref={inputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleSubmit}
          className="h-6 text-sm font-medium"
        />
      </form>
    )
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className="flex items-center gap-2 group"
    >
      <h1 className="text-sm font-medium text-[var(--color-text-primary)]">
        {initialName}
      </h1>
      <Pencil className="w-3.5 h-3.5 text-[var(--color-text-secondary)] opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  )
} 