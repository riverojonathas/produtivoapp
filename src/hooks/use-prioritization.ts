import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

interface RICEScore {
  reach: number    // 1-10: Quantas pessoas serão impactadas
  impact: number   // 1-10: Qual o impacto para cada pessoa
  confidence: number // 1-10: Quão confiante estamos (em %)
  effort: number   // 1-10: Quanto esforço será necessário
}

export function calculateRICEScore(scores: RICEScore) {
  // Normaliza os valores para escalas apropriadas
  const reach = scores.reach * 1000 // Converte para milhares de usuários
  const impact = scores.impact / 10  // Converte para decimal (0.1 - 1.0)
  const confidence = scores.confidence / 10 // Converte para decimal (0.1 - 1.0)
  const effort = scores.effort // Mantém a escala original (1-10 semanas)

  // Fórmula RICE: (Reach × Impact × Confidence) ÷ Effort
  const riceScore = (reach * impact * confidence) / effort

  return Math.round(riceScore * 100) / 100 // Arredonda para 2 casas decimais
}

export function usePrioritization() {
  const queryClient = useQueryClient()

  const updateRICEScore = useMutation({
    mutationFn: async ({ featureId, scores }: { featureId: string; scores: RICEScore }) => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('Não autenticado')
      }

      // Calcula o RICE Score
      const riceScore = calculateRICEScore(scores)

      // Atualiza a feature com os novos scores
      const { error } = await supabase
        .from('features')
        .update({
          rice_reach: scores.reach,
          rice_impact: scores.impact,
          rice_confidence: scores.confidence,
          rice_effort: scores.effort,
          rice_score: riceScore
        })
        .eq('id', featureId)

      if (error) {
        console.error('Erro ao atualizar RICE score:', error)
        throw error
      }

      // Registra o histórico de priorização
      const { error: historyError } = await supabase
        .from('feature_prioritizations')
        .insert([{
          feature_id: featureId,
          method: 'rice',
          score: riceScore,
          reach: scores.reach,
          impact: scores.impact,
          confidence: scores.confidence,
          effort: scores.effort,
          created_by: session.user.id,
          notes: `RICE Score calculado: ${riceScore}`
        }])

      if (historyError) {
        console.error('Erro ao registrar histórico:', historyError)
        throw historyError
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] })
    }
  })

  return {
    updateRICEScore,
    calculateRICEScore
  }
} 