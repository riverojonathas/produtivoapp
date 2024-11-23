'use client'

import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface ProductAvatarProps {
  children: React.ReactNode
  src?: string | null
  className?: string
  fallbackClassName?: string
}

export function ProductAvatar({ 
  children, 
  src, 
  className = '', 
  fallbackClassName = '' 
}: ProductAvatarProps) {
  return (
    <div className={`${className} flex items-center justify-center ${!src ? fallbackClassName : ''}`}>
      {src ? (
        <img src={src} alt="" className="w-full h-full object-cover rounded-lg" />
      ) : (
        <span className="text-white font-medium">{children}</span>
      )}
    </div>
  )
} 