'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, ArrowRight } from 'lucide-react'

interface Article {
  title: string
  description: string
  link: string
  tags: string[]
  date: string
}

export function ProductInsights() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  // Simular fetch de artigos do Product Oversee
  useEffect(() => {
    // Aqui implementaríamos a integração real
    setArticles([
      {
        title: "Como Se Tornar Ágil - Sem o 'Estigma' da Agilidade",
        description: "A verdadeira agilidade é sobre adotar uma mentalidade que priorize a adaptabilidade",
        link: "https://productoversee.com/como-se-tornar-agil",
        tags: ["Agilidade", "Processos"],
        date: "13 Nov 2024"
      },
      {
        title: "A lógica da Restrição Tripla",
        description: "O velho tripé de tempo, escopo e orçamento",
        link: "https://productoversee.com/restricao-tripla",
        tags: ["Gestão", "Processos"],
        date: "8 Nov 2024"
      }
    ])
    setLoading(false)
  }, [])

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-500" />
          <h3 className="font-medium">Insights do Dia</h3>
        </div>
        <Badge variant="secondary">Product Oversee</Badge>
      </div>

      <div className="space-y-6">
        {articles.map((article) => (
          <a
            key={article.title}
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h4 className="font-medium group-hover:text-blue-500 transition-colors">
                  {article.title}
                </h4>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                  {article.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  {article.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    {article.date}
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </a>
        ))}
      </div>
    </Card>
  )
} 