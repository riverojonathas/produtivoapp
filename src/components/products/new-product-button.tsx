'use client'

import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { motion } from 'framer-motion'

interface NewProductButtonProps {
  variant?: 'default' | 'empty-state'
}

export function NewProductButton({ variant = 'default' }: NewProductButtonProps) {
  const router = useRouter()

  if (variant === 'empty-state') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
        className="flex flex-col items-center justify-center p-8"
      >
        <motion.div 
          className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mb-4"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-6 h-6 text-[var(--color-primary)]" />
        </motion.div>
        <h3 className="text-sm font-medium mb-2">Nenhum produto ainda</h3>
        <p className="text-sm text-[var(--color-text-secondary)] text-center mb-4">
          Comece criando seu primeiro produto para gerenciar suas iniciativas.
        </p>
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={() => router.push('/products/new')}
            className="bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Primeiro Produto
          </Button>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={() => router.push('/products/new')}
              className="relative group bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90"
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <Plus className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium">Novo</span>
              </div>
              <motion.div
                className="absolute inset-0 rounded-md bg-white/0"
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                transition={{ duration: 0.2 }}
              />
            </Button>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">Criar novo produto</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
} 