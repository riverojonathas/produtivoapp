'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useProducts } from '@/hooks/use-products'
import { toast } from 'sonner'
import { ITeamMember, TeamMemberRole } from '@/types/product'
import { Shield, Star, Users } from 'lucide-react'

interface ProductTeamDialogProps {
  productId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  member?: ITeamMember // Se fornecido, está editando um membro existente
}

const roleOptions = [
  { 
    value: 'manager', 
    label: 'Product Manager',
    icon: Star,
    description: 'Gerencia o desenvolvimento e estratégia do produto'
  },
  { 
    value: 'member', 
    label: 'Team Member',
    icon: Users,
    description: 'Contribui com o desenvolvimento e evolução do produto'
  }
]

export function ProductTeamDialog({
  productId,
  open,
  onOpenChange,
  member
}: ProductTeamDialogProps) {
  const { updateTeamMember, addTeamMember } = useProducts()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Partial<ITeamMember>>(
    member || {
      name: '',
      email: '',
      role: 'member' as TeamMemberRole
    }
  )

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      if (!formData.name?.trim() || !formData.email?.trim() || !formData.role) {
        toast.error('Preencha todos os campos obrigatórios')
        return
      }

      if (member) {
        await updateTeamMember.mutateAsync({
          productId,
          memberId: member.id,
          data: formData
        })
        toast.success('Membro atualizado com sucesso')
      } else {
        await addTeamMember.mutateAsync({
          productId,
          data: formData
        })
        toast.success('Membro adicionado com sucesso')
      }

      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao salvar membro:', error)
      toast.error('Erro ao salvar membro')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {member ? 'Editar Membro' : 'Adicionar Membro'}
          </DialogTitle>
          <DialogDescription>
            {member 
              ? 'Atualize as informações do membro do time'
              : 'Adicione um novo membro ao time do produto'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nome do membro"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">E-mail</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="E-mail do membro"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Função</label>
            <Select
              value={formData.role}
              onValueChange={(value: TeamMemberRole) => 
                setFormData(prev => ({ ...prev, role: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma função" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map(role => (
                  <SelectItem 
                    key={role.value} 
                    value={role.value}
                    className="flex items-center gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <role.icon className="w-4 h-4" />
                      <span>{role.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Salvando...' : member ? 'Salvar' : 'Adicionar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 