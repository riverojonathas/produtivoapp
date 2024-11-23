import { ArrowUp, ArrowDown, Minus } from 'lucide-react'

interface TrendIndicatorProps {
  value: string | number
}

export function TrendIndicator({ value }: TrendIndicatorProps) {
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  
  if (isNaN(numValue)) return null
  
  if (numValue > 0) {
    return (
      <div className="flex items-center gap-1 text-green-500">
        <ArrowUp className="w-4 h-4" />
        <span className="text-xs">{numValue}%</span>
      </div>
    )
  }
  
  if (numValue < 0) {
    return (
      <div className="flex items-center gap-1 text-red-500">
        <ArrowDown className="w-4 h-4" />
        <span className="text-xs">{Math.abs(numValue)}%</span>
      </div>
    )
  }
  
  return (
    <div className="flex items-center gap-1 text-gray-400">
      <Minus className="w-4 h-4" />
      <span className="text-xs">0%</span>
    </div>
  )
} 