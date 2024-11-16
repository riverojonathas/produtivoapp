import React from 'react';

import {
  LayoutDashboard,
  Activity,
  Star,
  Eye,
  Briefcase,
  Users,
  UserCheck,
  PieChart,
  Target,
  Plus,
  TrendingUp,
  BarChart2,
  List,
  Trello,
  Map,
  Columns,
  Calendar,
  CheckSquare,
  FileText,
  Book,
  BookOpen,
  Link2,
  Home
} from 'lucide-react';

export type MenuItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
};

export type MenuSection = {
  key: string;
  section: string;
  icon: React.ReactNode;
  items?: MenuItem[];
  path?: string;
};

export const menuSections: MenuSection[] = [
  {
    key: 'home',
    section: 'Início',
    icon: <Home className="w-4 h-4" />,
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: <LayoutDashboard className="w-4 h-4" />,
        path: '/dashboard'
      },
      {
        id: 'overview',
        label: 'Visão Geral',
        icon: <Activity className="w-4 h-4" />,
        path: '/overview'
      },
      {
        id: 'favorites',
        label: 'Favoritos',
        icon: <Star className="w-4 h-4" />,
        path: '/favorites'
      }
    ]
  },
  {
    key: 'vision',
    section: 'Visão',
    icon: <Eye className="w-4 h-4" />,
    items: [
      {
        id: 'product-vision',
        label: 'Definição de Visão',
        icon: <Briefcase className="w-4 h-4" />,
        path: '/product-vision'
      },
      {
        id: 'user-research',
        label: 'Pesquisa de Usuário',
        icon: <Users className="w-4 h-4" />,
        path: '/user-research'
      },
      {
        id: 'personas',
        label: 'Personas',
        icon: <UserCheck className="w-4 h-4" />,
        path: '/personas'
      },
      {
        id: 'value-proposition',
        label: 'Value Proposition',
        icon: <PieChart className="w-4 h-4" />,
        path: '/value-proposition'
      }
    ]
  },
  // ... resto das seções do menu que você compartilhou ...
]; 