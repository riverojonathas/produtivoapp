'use client';

import { Card } from "@/components/ui/card";
import { 
  ChatBubbleLeftIcon,
  TagIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";

const feedbacks = [
  {
    id: '1',
    content: 'Seria útil ter uma visualização em timeline das atividades',
    type: 'feature',
    status: 'new',
    createdAt: '2024-03-15',
    user: 'Maria Silva',
    votes: 12
  },
  {
    id: '2',
    content: 'O carregamento do dashboard está muito lento',
    type: 'bug',
    status: 'in_review',
    createdAt: '2024-03-14',
    user: 'João Santos',
    votes: 8
  },
  {
    id: '3',
    content: 'A interface do kanban poderia ser mais intuitiva',
    type: 'improvement',
    status: 'accepted',
    createdAt: '2024-03-13',
    user: 'Ana Costa',
    votes: 15
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'new':
      return <ChatBubbleLeftIcon className="w-5 h-5 text-blue-500" />;
    case 'in_review':
      return <ArrowPathIcon className="w-5 h-5 text-yellow-500" />;
    case 'accepted':
      return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
    case 'rejected':
      return <XCircleIcon className="w-5 h-5 text-red-500" />;
    default:
      return null;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'feature':
      return 'text-purple-500 bg-purple-500/10';
    case 'bug':
      return 'text-red-500 bg-red-500/10';
    case 'improvement':
      return 'text-blue-500 bg-blue-500/10';
    default:
      return 'text-gray-500 bg-gray-500/10';
  }
};

export default function FeedbackPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
          Feedback dos Usuários
        </h1>
      </div>

      <div className="grid gap-4">
        {feedbacks.map((feedback) => (
          <Card 
            key={feedback.id}
            className="p-6 bg-[var(--color-background-elevated)]"
          >
            <div className="flex items-start gap-4">
              <div className="p-2 bg-[var(--color-accent-light)] rounded-lg">
                {getStatusIcon(feedback.status)}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-[var(--color-text-primary)] mb-2">
                      {feedback.content}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                      <span className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        {new Date(feedback.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                      <span>•</span>
                      <span>{feedback.user}</span>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-[var(--color-primary)]">
                    {feedback.votes} votos
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span 
                    className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full ${getTypeColor(feedback.type)}`}
                  >
                    <TagIcon className="w-3 h-3" />
                    {feedback.type}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 