import { ReactNode } from 'react';
import {
  HomeIcon,
  RectangleGroupIcon,
  BeakerIcon,
  ChartBarSquareIcon,
  SparklesIcon,
  CommandLineIcon,
  UserGroupIcon,
  RocketLaunchIcon,
  PresentationChartLineIcon,
  PuzzlePieceIcon,
  QueueListIcon,
  Square3Stack3DIcon,
  ChatBubbleBottomCenterTextIcon,
  Cog6ToothIcon,
  ArrowTrendingUpIcon,
  ScaleIcon
} from '@heroicons/react/24/outline';

import type { MenuSection } from '../types';

const createIcon = (icon: ReactNode): ReactNode => icon;

export const menuSections: MenuSection[] = [
  {
    key: 'home',
    section: 'Dashboard',
    icon: createIcon(<HomeIcon className="w-5 h-5" />),
    items: [
      {
        id: 'overview',
        label: 'Visão Geral',
        icon: createIcon(<RectangleGroupIcon className="w-5 h-5" />),
        path: '/'
      }
    ]
  },
  {
    key: 'products',
    section: 'Produtos',
    icon: createIcon(<SparklesIcon className="w-5 h-5" />),
    items: [
      {
        id: 'product-list',
        label: 'Lista de Produtos',
        icon: createIcon(<QueueListIcon className="w-5 h-5" />),
        path: '/products'
      },
      {
        id: 'backlog',
        label: 'Backlog',
        icon: createIcon(<PuzzlePieceIcon className="w-5 h-5" />),
        path: '/backlog'
      }
    ]
  },
  {
    key: 'prioritization',
    section: 'Priorização',
    icon: createIcon(<ScaleIcon className="w-5 h-5" />),
    items: [
      {
        id: 'scoring',
        label: 'Matriz de Priorização',
        icon: createIcon(<BeakerIcon className="w-5 h-5" />),
        path: '/prioritization/scoring'
      },
      {
        id: 'roadmap',
        label: 'Roadmap',
        icon: createIcon(<RocketLaunchIcon className="w-5 h-5" />),
        path: '/prioritization/roadmap'
      },
      {
        id: 'impact-analysis',
        label: 'Análise de Impacto',
        icon: createIcon(<ArrowTrendingUpIcon className="w-5 h-5" />),
        path: '/prioritization/impact'
      },
      {
        id: 'value-metrics',
        label: 'Métricas de Valor',
        icon: createIcon(<PresentationChartLineIcon className="w-5 h-5" />),
        path: '/prioritization/metrics'
      },
      {
        id: 'feature-ranking',
        label: 'Ranking de Features',
        icon: createIcon(<ChartBarSquareIcon className="w-5 h-5" />),
        path: '/prioritization/ranking'
      },
      {
        id: 'dependencies',
        label: 'Dependências',
        icon: createIcon(<CommandLineIcon className="w-5 h-5" />),
        path: '/prioritization/dependencies'
      }
    ]
  },
  {
    key: 'sprints',
    section: 'Sprints',
    icon: createIcon(<Square3Stack3DIcon className="w-5 h-5" />),
    items: [
      {
        id: 'sprint-planning',
        label: 'Planejamento',
        icon: createIcon(<UserGroupIcon className="w-5 h-5" />),
        path: '/sprints/planning'
      },
      {
        id: 'kanban',
        label: 'Kanban',
        icon: createIcon(<RectangleGroupIcon className="w-5 h-5" />),
        path: '/sprints/kanban'
      }
    ]
  },
  {
    key: 'feedback',
    section: 'Feedback',
    icon: createIcon(<ChatBubbleBottomCenterTextIcon className="w-5 h-5" />),
    items: [
      {
        id: 'user-feedback',
        label: 'Feedback dos Usuários',
        icon: createIcon(<ChatBubbleBottomCenterTextIcon className="w-5 h-5" />),
        path: '/feedback'
      }
    ]
  },
  {
    key: 'settings',
    section: 'Configurações',
    icon: createIcon(<Cog6ToothIcon className="w-5 h-5" />),
    items: [
      {
        id: 'integrations',
        label: 'Integrações',
        icon: createIcon(<PuzzlePieceIcon className="w-5 h-5" />),
        path: '/settings/integrations'
      }
    ]
  }
]; 