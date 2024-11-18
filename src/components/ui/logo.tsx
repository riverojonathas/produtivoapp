'use client'

import React from 'react'
import Image from 'next/image'

export const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={className}>
      <Image 
        src="/logo.svg" 
        alt="Produtivo" 
        width={32} 
        height={32} 
      />
    </div>
  )
}

export const LogoHorizontal: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={className}>
      <Image 
        src="/logo-horizontal.svg" 
        alt="Produtivo" 
        width={120} 
        height={32} 
      />
    </div>
  )
} 