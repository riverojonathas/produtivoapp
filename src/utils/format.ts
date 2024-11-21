import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
};

export const formatDate = (date: string | undefined): string => {
  if (!date) return '-'
  return format(new Date(date), "dd MMM, yy", { locale: ptBR })
} 