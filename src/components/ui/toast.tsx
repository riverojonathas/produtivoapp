'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { CheckCircle, XCircle, X } from 'lucide-react'

interface ToastProps {
  message: { type: 'success' | 'error', text: string } | null
  onClose: () => void
}

export function Toast({ message, onClose }: ToastProps) {
  if (!message) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div
        className={cn(
          "flex items-center gap-2 p-4 rounded-lg shadow-lg border",
          message.type === 'success' 
            ? "bg-green-50 border-green-200 text-green-700" 
            : "bg-red-50 border-red-200 text-red-700"
        )}
      >
        {message.type === 'success' ? (
          <CheckCircle className="w-5 h-5" />
        ) : (
          <XCircle className="w-5 h-5" />
        )}
        <p className="text-sm font-medium">{message.text}</p>
        <button
          onClick={onClose}
          className="ml-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
} 