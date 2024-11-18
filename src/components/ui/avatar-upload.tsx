'use client'

import { useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ImagePlus, X } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface AvatarUploadProps {
  onChange: (file: File | null) => void
  defaultImage?: string | null
  className?: string
}

export function AvatarUpload({ onChange, defaultImage, className }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(defaultImage || null)

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      onChange(file)
    }
  }, [onChange])

  const handleRemove = useCallback(() => {
    setPreview(null)
    onChange(null)
  }, [onChange])

  return (
    <div className={cn("relative inline-block", className)}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="avatar-upload"
      />
      <label
        htmlFor="avatar-upload"
        className={cn(
          "flex items-center justify-center w-12 h-12 rounded-full cursor-pointer",
          "bg-[var(--color-background-subtle)] border border-dashed border-[var(--color-border)]",
          "hover:bg-[var(--color-background-hover)] transition-colors",
          preview && "border-none"
        )}
      >
        {preview ? (
          <div className="relative w-full h-full">
            <Image
              src={preview}
              alt="Avatar"
              fill
              className="object-cover rounded-full"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-1 -right-1 h-4 w-4 p-0 rounded-full"
              onClick={(e) => {
                e.preventDefault()
                handleRemove()
              }}
            >
              <X className="h-2 w-2" />
            </Button>
          </div>
        ) : (
          <ImagePlus className="w-4 h-4 text-[var(--color-text-secondary)]" />
        )}
      </label>
    </div>
  )
} 