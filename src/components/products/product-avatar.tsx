'use client'

import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface ProductAvatarProps extends React.ComponentProps<typeof Avatar> {
  src?: string | null
  children: React.ReactNode
}

export function ProductAvatar({ src, children, ...props }: ProductAvatarProps) {
  return (
    <Avatar {...props}>
      <AvatarFallback className="rounded-lg bg-[var(--color-background-elevated)]">
        {children}
      </AvatarFallback>
    </Avatar>
  )
} 