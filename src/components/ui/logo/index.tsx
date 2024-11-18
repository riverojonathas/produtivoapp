'use client'

import React from 'react'
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <svg 
        width="32" 
        height="32" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="text-[var(--color-primary)]"
      >
        <path 
          d="M12 2L2 7L12 12L22 7L12 2Z" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M2 17L12 22L22 17" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M2 12L12 17L22 12" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

export function LogoHorizontal({ className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Logo className="w-8 h-8" />
      <div className="flex flex-col">
        <span className="font-semibold text-lg leading-none text-white">
          Produtivo
        </span>
        <span className="text-[10px] leading-tight text-gray-400">
          Product Management
        </span>
      </div>
    </div>
  )
} 