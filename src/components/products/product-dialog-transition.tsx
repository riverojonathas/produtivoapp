'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent } from "@/components/ui/dialog"

const dialogAnimation = {
  initial: { opacity: 0, scale: 0.95, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 10 },
  transition: { duration: 0.2 }
}

interface ProductDialogTransitionProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

export function ProductDialogTransition({
  open,
  onOpenChange,
  children,
  className
}: ProductDialogTransitionProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogContent className={className} asChild>
            <motion.div {...dialogAnimation}>
              {children}
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  )
} 