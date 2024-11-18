'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { addDays } from 'date-fns'

interface SprintConfig {
  startDate: Date
  duration: number
}

interface SprintStore {
  config: SprintConfig
  setConfig: (config: SprintConfig) => void
  getCurrentSprint: () => number
  getSprintDates: (sprintNumber: number) => { start: Date; end: Date }
}

export const useSprintConfig = create<SprintStore>()(
  persist(
    (set, get) => ({
      config: {
        startDate: new Date(),
        duration: 14
      },
      setConfig: (config) => set({ config }),
      getCurrentSprint: () => {
        const { startDate, duration } = get().config
        const today = new Date()
        const diffTime = Math.abs(today.getTime() - startDate.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return Math.floor(diffDays / duration) + 1
      },
      getSprintDates: (sprintNumber) => {
        const { startDate, duration } = get().config
        const sprintStart = addDays(startDate, (sprintNumber - 1) * duration)
        const sprintEnd = addDays(sprintStart, duration - 1)
        return { start: sprintStart, end: sprintEnd }
      }
    }),
    {
      name: 'sprint-config'
    }
  )
) 