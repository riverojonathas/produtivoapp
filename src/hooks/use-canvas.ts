'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Canvas } from '@/types/canvas'
import { toast } from 'sonner'

export function useCanvas() {
  const [canvases, setCanvases] = useState<Canvas[]>([])
  const [loading, setLoading] = useState(true)

  // Transformado em useCallback para evitar recriações desnecessárias
  const loadCanvases = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('canvases')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) throw error
      setCanvases(data || [])
    } catch (error) {
      toast.error('Erro ao carregar canvas')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Carregar canvas inicialmente
  useEffect(() => {
    loadCanvases()
  }, [loadCanvases])

  // Deletar canvas
  const deleteCanvas = async (id: string) => {
    try {
      const { error } = await supabase
        .from('canvases')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Atualiza o estado local
      setCanvases(prev => prev.filter(canvas => canvas.id !== id))
      return true
    } catch (error) {
      console.error('Erro ao excluir canvas:', error)
      throw error
    }
  }

  // Atualizar canvas
  const updateCanvas = async (id: string, data: Partial<Canvas>) => {
    try {
      const { data: updatedCanvas, error } = await supabase
        .from('canvases')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Atualiza o estado local
      setCanvases(prev => prev.map(canvas => 
        canvas.id === id ? updatedCanvas : canvas
      ))
      return updatedCanvas
    } catch (error) {
      console.error('Erro ao atualizar canvas:', error)
      throw error
    }
  }

  return {
    canvases,
    loading,
    deleteCanvas,
    updateCanvas,
    refresh: loadCanvases // Expõe a função de refresh
  }
} 