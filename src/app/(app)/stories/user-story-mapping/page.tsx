'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { 
  Plus,
  Search,
  Download,
  History,
  Users,
  Target,
  ArrowRight,
  Map,
  Lightbulb
} from 'lucide-react'
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent
} from '@dnd-kit/core'
import {
  sortableKeyboardCoordinates,
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { InteractiveGuide } from './components/interactive-guide'
import { toast } from 'sonner'

interface StoryActivity {
  id: string
  title: string
  tasks: StoryTask[]
}

interface StoryTask {
  id: string
  title: string
  userStories: UserStory[]
}

interface UserStory {
  id: string
  title: string
  priority: 'must' | 'should' | 'could' | 'wont'
  sprint?: number
}

interface MapData {
  personas?: { id: string }[]
  outcomes?: { id: string }[]
  activities: StoryActivity[]
  stories: UserStory[]
}

export default function UserStoryMappingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [activities, setActivities] = useState<StoryActivity[]>([])
  const [showTutorial, setShowTutorial] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)

  // Configurar sensores para drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  // Formatar dados para o guia
  const mapData: MapData = {
    personas: [{ id: '1' }],
    outcomes: [{ id: '1' }],
    activities,
    stories: activities.flatMap(activity => 
      activity.tasks.flatMap(task => task.userStories)
    )
  }

  const handleStepComplete = () => {
    setCurrentStep(prev => Math.min(prev + 1, 6))
    toast.success('Passo concluído!')
  }

  const handleStepHint = (hint: string) => {
    toast.info(hint, {
      duration: 5000,
      action: {
        label: 'Entendi',
        onClick: () => toast.dismiss()
      }
    })
  }

  return (
    <div className="h-full flex flex-col -m-6">
      {/* Cabeçalho */}
      <div className="bg-[var(--color-background-primary)] border-b border-[var(--color-border)]">
        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-medium text-[var(--color-text-primary)]">
                  User Story Mapping
                </h1>
                <span className="text-xs text-[var(--color-text-secondary)]">
                  {activities.length}
                </span>
              </div>

              <Button 
                size="sm"
                className="h-8 w-8 p-0 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
                title="Nova Atividade"
              >
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>

            {/* Separador Vertical */}
            <div className="h-4 w-px bg-[var(--color-border)]" />

            {/* Métricas Compactas */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 border-r border-[var(--color-border)] pr-4">
                <div className="p-1 rounded bg-emerald-500/8">
                  <Target className="w-3 h-3 text-emerald-500" />
                </div>
                <p className="text-sm font-medium">12</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-blue-500/8">
                  <Users className="w-3 h-3 text-blue-500" />
                </div>
                <p className="text-sm font-medium">3</p>
              </div>
            </div>
          </div>

          {/* Lado Direito */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
              <Input
                placeholder="Buscar histórias..."
                className="pl-8 h-8 text-sm bg-[var(--color-background-elevated)] border-[var(--color-border)] w-[200px]"
              />
            </div>

            <div className="flex items-center gap-2 border-l border-[var(--color-border)] pl-3">
              <Button variant="outline" size="sm" className="h-8">
                <History className="w-3.5 h-3.5 mr-2" />
                Histórico
              </Button>
              <Button variant="outline" size="sm" className="h-8">
                <Download className="w-3.5 h-3.5 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo com DnD */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={(event: DragStartEvent) => setActiveId(event.active.id as string)}
        onDragEnd={() => setActiveId(null)}
      >
        <div className="flex-1 p-6 overflow-auto">
          <div className="space-y-6">
            <SortableContext
              items={activities.map(a => a.id)}
              strategy={verticalListSortingStrategy}
            >
              {activities.map((activity) => (
                <Card key={activity.id} className="p-4">
                  {/* ... conteúdo do card ... */}
                </Card>
              ))}
            </SortableContext>
          </div>
        </div>

        <DragOverlay>
          {activeId ? (
            <Card className="p-3 shadow-xl border-l-4 border-l-blue-500">
              <div className="text-sm text-[var(--color-text-primary)]">
                Movendo história...
              </div>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Tutorial e Guia Interativo */}
      <InteractiveGuide
        currentStep={currentStep}
        onStepComplete={handleStepComplete}
        onStepHint={handleStepHint}
        data={mapData}
        onClose={() => setCurrentStep(1)}
      />
    </div>
  )
} 