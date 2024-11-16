import { Feature, FeatureValidation } from '@/types/product'

const defaultValidation: FeatureValidation = {
  title: {
    minLength: 3,
    maxLength: 100,
    unique: true
  },
  description: {
    minLength: 10,
    maxLength: 1000
  },
  dates: {
    allowPast: false,
    maxDuration: 365 // 1 ano
  }
}

export function useFeatureValidation(existingFeatures: Feature[]) {
  const validateTitle = (title: string, currentFeatureId?: string): string | null => {
    if (title.length < defaultValidation.title.minLength) {
      return `Título deve ter pelo menos ${defaultValidation.title.minLength} caracteres`
    }
    if (title.length > defaultValidation.title.maxLength) {
      return `Título deve ter no máximo ${defaultValidation.title.maxLength} caracteres`
    }
    if (defaultValidation.title.unique) {
      const duplicate = existingFeatures.find(f => 
        f.title.toLowerCase() === title.toLowerCase() && f.id !== currentFeatureId
      )
      if (duplicate) {
        return 'Já existe uma feature com este título'
      }
    }
    return null
  }

  const validateDescription = (description: string): string | null => {
    if (description.length < defaultValidation.description.minLength) {
      return `Descrição deve ter pelo menos ${defaultValidation.description.minLength} caracteres`
    }
    if (description.length > defaultValidation.description.maxLength) {
      return `Descrição deve ter no máximo ${defaultValidation.description.maxLength} caracteres`
    }
    return null
  }

  const validateDates = (startDate: Date, endDate: Date): string | null => {
    const now = new Date()
    if (!defaultValidation.dates.allowPast && startDate < now) {
      return 'Data de início não pode ser no passado'
    }
    if (endDate < startDate) {
      return 'Data de fim deve ser posterior à data de início'
    }
    const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    if (duration > defaultValidation.dates.maxDuration) {
      return `Duração máxima permitida é de ${defaultValidation.dates.maxDuration} dias`
    }
    return null
  }

  const validateDependencies = (dependencies: string[], feature: Feature): string | null => {
    // Verificar dependências cíclicas
    const visited = new Set<string>()
    const checkCycle = (featureId: string): boolean => {
      if (visited.has(featureId)) return true
      visited.add(featureId)
      const deps = existingFeatures.find(f => f.id === featureId)?.dependencies || []
      return deps.some(dep => checkCycle(dep))
    }

    if (dependencies.some(dep => checkCycle(dep))) {
      return 'Dependência cíclica detectada'
    }

    // Verificar datas das dependências
    for (const depId of dependencies) {
      const dep = existingFeatures.find(f => f.id === depId)
      if (dep && new Date(feature.startDate) < new Date(dep.endDate)) {
        return `Feature não pode começar antes do fim da dependência "${dep.title}"`
      }
    }

    return null
  }

  return {
    validateTitle,
    validateDescription,
    validateDates,
    validateDependencies
  }
} 