'use client'

import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface PersonaAvatarProps extends React.ComponentProps<typeof Avatar> {
  name: string
}

export function PersonaAvatar({ name, ...props }: PersonaAvatarProps) {
  // Função para gerar uma cor baseada no nome
  const getColorFromName = (name: string) => {
    const colors = [
      'bg-red-100 text-red-700',
      'bg-blue-100 text-blue-700',
      'bg-green-100 text-green-700',
      'bg-yellow-100 text-yellow-700',
      'bg-purple-100 text-purple-700',
      'bg-pink-100 text-pink-700',
      'bg-indigo-100 text-indigo-700'
    ]
    
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    
    return colors[Math.abs(hash) % colors.length]
  }

  // Função para gerar as iniciais
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <Avatar {...props}>
      <AvatarFallback 
        className={`rounded-lg ${getColorFromName(name)}`}
      >
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  )
} 