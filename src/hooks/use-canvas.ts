'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Canvas } from '@/types/canvas'
import { toast } from 'sonner'

export function useCanvas() {
  const [canvases, setCanvases] = useState<Canvas[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  // Carregar canvas
  const loadCanvases = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('Não autenticado')
      }

      const { data, error } = await supabase
        .from('canvases')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setCanvases(data || [])
    } catch (error) {
      console.error('Erro ao carregar canvas:', error)
      toast.error('Erro ao carregar os canvas')
    } finally {
      setLoading(false)
    }
  }

  // Criar novo canvas
  const createCanvas = async (canvasData: Partial<Canvas>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('Não autenticado')
      }

      const newCanvas = {
        ...canvasData,
        user_id: session.user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('canvases')
        .insert([newCanvas])
        .select('*')
        .single()

      if (error) {
        console.error('Erro Supabase:', error)
        throw error
      }

      if (!data) {
        throw new Error('Nenhum dado retornado')
      }

      setCanvases(prev => [data, ...prev])
      return data
    } catch (error) {
      console.error('Erro ao criar canvas:', error)
      if (error instanceof Error) {
        toast.error(`Erro ao criar canvas: ${error.message}`)
      } else {
        toast.error('Erro ao criar canvas')
      }
      return null
    }
  }

  // Atualizar canvas
  const updateCanvas = async (id: string, updates: Partial<Canvas>) => {
    try {
      const { data, error } = await supabase
        .from('canvases')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select('*')
        .single()

      if (error) throw error

      setCanvases(prev => prev.map(c => c.id === id ? data : c))
      return data
    } catch (error) {
      console.error('Erro ao atualizar canvas:', error)
      toast.error('Erro ao atualizar o canvas')
      return null
    }
  }

  // Excluir canvas
  const deleteCanvas = async (id: string) => {
    try {
      const { error } = await supabase
        .from('canvases')
        .delete()
        .eq('id', id)

      if (error) throw error

      setCanvases(prev => prev.filter(c => c.id !== id))
      return true
    } catch (error) {
      console.error('Erro ao excluir canvas:', error)
      toast.error('Erro ao excluir o canvas')
      return false
    }
  }

  useEffect(() => {
    loadCanvases()
  }, [])

  return {
    canvases,
    loading,
    createCanvas,
    updateCanvas,
    deleteCanvas,
    refresh: loadCanvases
  }
} 