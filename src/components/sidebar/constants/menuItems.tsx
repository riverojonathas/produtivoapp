import { ReactNode } from 'react';
import { IconType } from 'react-icons';
import type { MenuSection } from '../types/sidebar.types';
import {
  FiHome,
  FiGrid,
  FiActivity,
  FiStar,
  FiEye,
  FiBriefcase,
  FiUsers,
  FiUserCheck,
  FiPieChart,
  FiTarget,
  FiPlus,
  FiTrendingUp,
  FiBarChart2,
  FiList,
  FiTrello,
  FiMap,
  FiColumns,
  FiCalendar,
  FiCheckSquare,
  FiFileText,
  FiBook,
  FiBookOpen,
  FiLink
} from 'react-icons/fi';

const createIcon = (Icon: IconType): ReactNode => {
  return <Icon />;
};

export const menuSections: MenuSection[] = [
  {
    key: 'home',
    section: 'Início',
    icon: createIcon(FiHome),
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: createIcon(FiGrid),
        path: '/dashboard'
      },
      {
        id: 'overview',
        label: 'Visão Geral',
        icon: createIcon(FiActivity),
        path: '/overview'
      },
      {
        id: 'favorites',
        label: 'Favoritos',
        icon: createIcon(FiStar),
        path: '/favorites'
      }
    ]
  },
  {
    key: 'vision',
    section: 'Visão',
    icon: createIcon(FiEye),
    items: [
      {
        id: 'product-vision',
        label: 'Definição de Visão',
        icon: createIcon(FiBriefcase),
        path: '/product-vision'
      },
      {
        id: 'user-research',
        label: 'Pesquisa de Usuário',
        icon: createIcon(FiUsers),
        path: '/user-research'
      },
      {
        id: 'personas',
        label: 'Personas',
        icon: createIcon(FiUserCheck),
        path: '/personas'
      },
      {
        id: 'value-proposition',
        label: 'Value Proposition',
        icon: createIcon(FiPieChart),
        path: '/value-proposition'
      }
    ]
  },
  {
    key: 'strategy',
    section: 'Estratégia',
    icon: createIcon(FiTarget),
    items: [
      {
        id: 'matrix',
        label: 'Matriz de Priorização',
        icon: createIcon(FiGrid),
        path: '/matrix'
      },
      {
        id: 'addFeature',
        label: 'Nova Feature',
        icon: createIcon(FiPlus),
        path: '/add-feature'
      },
      {
        id: 'market-analysis',
        label: 'Análise de Mercado',
        icon: createIcon(FiTrendingUp),
        path: '/market-analysis'
      },
      {
        id: 'metrics',
        label: 'Métricas de Sucesso',
        icon: createIcon(FiBarChart2),
        path: '/metrics'
      },
      {
        id: 'backlog',
        label: 'Backlog do Produto',
        icon: createIcon(FiList),
        path: '/backlog'
      }
    ]
  },
  {
    key: 'tactical',
    section: 'Tático',
    icon: createIcon(FiTrello),
    items: [
      {
        id: 'story-mapping',
        label: 'Story Mapping',
        icon: createIcon(FiMap),
        path: '/story-mapping'
      },
      {
        id: 'kanban',
        label: 'Kanban Board',
        icon: createIcon(FiColumns),
        path: '/kanban'
      },
      {
        id: 'sprint-planning',
        label: 'Sprint Planning',
        icon: createIcon(FiCalendar),
        path: '/sprint-planning'
      },
      {
        id: 'tests',
        label: 'Testes e Validação',
        icon: createIcon(FiCheckSquare),
        path: '/tests'
      },
      {
        id: 'reports',
        label: 'Relatórios',
        icon: createIcon(FiFileText),
        path: '/reports'
      }
    ]
  },
  {
    key: 'resources',
    section: 'Recursos',
    icon: createIcon(FiBook),
    items: [
      {
        id: 'documentation',
        label: 'Documentação',
        icon: createIcon(FiBookOpen),
        path: '/documentation'
      },
      {
        id: 'community',
        label: 'Comunidade',
        icon: createIcon(FiUsers),
        path: '/community'
      },
      {
        id: 'integrations',
        label: 'Integrações',
        icon: createIcon(FiLink),
        path: '/integrations'
      }
    ]
  }
];

