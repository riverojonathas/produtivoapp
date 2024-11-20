'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Canvas } from '@/types/canvas'
import { toast } from 'sonner'
import { PostgrestError } from '@supabase/supabase-js'

export function useCanvas() {
  const [canvases, setCanvases] = useState<Canvas[]>([])
  const [loading, setLoading] = useState(true)

  const loadCanvases = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('canvases')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) throw error
      setCanvases(data || [])
    } catch (error: any) {
      const pgError = error as PostgrestError
      console.error('Erro ao carregar canvas:', {
        message: pgError.message,
        details: pgError.details,
        hint: pgError.hint,
        code: pgError.code
      })
      toast.error('Erro ao carregar canvas')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCanvases()
  }, [loadCanvases])

  const createCanvas = useCallback(async (data: Partial<Canvas>) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('Usuário não autenticado')

      const canvasData = {
        title: data.title?.trim() || 'Novo Canvas',
        description: data.description?.trim() || null,
        product_id: data.product_id || null,
        sections: data.sections || {
          problem: [],
          solution: [],
          metrics: [],
          proposition: [],
          advantage: [],
          channels: [],
          segments: [],
          costs: [],
          revenue: []
        },
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      console.log('Tentando criar canvas com dados:', canvasData)

      const { data: newCanvas, error } = await supabase
        .from('canvases')
        .insert([canvasData])
        .select('*')
        .single()

      if (error) {
        console.error('Erro Supabase detalhado:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw error
      }

      if (!newCanvas) {
        throw new Error('Canvas não foi criado - resposta vazia do Supabase')
      }

      setCanvases(prev => [newCanvas, ...prev])
      return newCanvas
    } catch (error: any) {
      const pgError = error as PostgrestError
      console.error('Erro detalhado ao criar canvas:', {
        message: pgError.message,
        details: pgError.details,
        hint: pgError.hint,
        code: pgError.code
      })
      throw new Error(pgError.message || 'Erro ao criar canvas')
    }
  }, [])

  const deleteCanvas = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('canvases')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Erro ao excluir:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw error
      }

      setCanvases(prev => prev.filter(canvas => canvas.id !== id))
      return true
    } catch (error: any) {
      const pgError = error as PostgrestError
      console.error('Erro detalhado ao excluir canvas:', {
        message: pgError.message,
        details: pgError.details,
        hint: pgError.hint,
        code: pgError.code
      })
      throw new Error(pgError.message || 'Erro ao excluir canvas')
    }
  }, [])

  const updateCanvas = useCallback(async (id: string, data: Partial<Canvas>) => {
    try {
      const updateData = {
        ...data,
        updated_at: new Date().toISOString()
      }

      const { data: updatedCanvas, error } = await supabase
        .from('canvases')
        .update(updateData)
        .eq('id', id)
        .select('*')
        .single()

      if (error) {
        console.error('Erro ao atualizar:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw error
      }

      setCanvases(prev => prev.map(canvas => 
        canvas.id === id ? updatedCanvas : canvas
      ))
      return updatedCanvas
    } catch (error: any) {
      const pgError = error as PostgrestError
      console.error('Erro detalhado ao atualizar canvas:', {
        message: pgError.message,
        details: pgError.details,
        hint: pgError.hint,
        code: pgError.code
      })
      throw new Error(pgError.message || 'Erro ao atualizar canvas')
    }
  }, [])

  return {
    canvases,
    loading,
    createCanvas,
    deleteCanvas,
    updateCanvas,
    refresh: loadCanvases
  }
} 