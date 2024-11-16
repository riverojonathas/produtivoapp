import { Feature } from '@/types/product'

export const mockFeatures: Feature[] = [
  {
    id: '1',
    title: 'Integração com Stripe',
    description: {
      what: 'Implementar pagamentos via Stripe para assinaturas e cobranças recorrentes',
      why: 'Permitir monetização do produto através de assinaturas',
      who: 'Usuários que desejam acessar recursos premium',
      metrics: 'Taxa de conversão de assinaturas'
    },
    status: 'in-progress',
    priority: 'high',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-03-15'),
    dependencies: [],
    assignees: [],
    tags: ['payment', 'stripe'],
    stories: [
      {
        id: '1-1',
        featureId: '1',
        title: 'Configuração do Stripe',
        description: {
          asA: 'desenvolvedor',
          iWant: 'configurar a integração com o Stripe',
          soThat: 'possamos processar pagamentos'
        },
        acceptanceCriteria: [
          'Chaves de API configuradas',
          'Webhook configurado',
          'Ambiente de teste funcional'
        ],
        status: 'completed',
        points: 3,
        assignees: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // ... mais stories
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    productId: '1'
  },
  // ... mais features
] 