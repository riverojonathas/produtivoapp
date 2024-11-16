import { ReactNode } from 'react';

export interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: ReactNode;
}

export interface MenuSection {
  key: string;
  section: string;
  icon: ReactNode;
  items: MenuItem[];
} 