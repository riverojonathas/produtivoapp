import { ReactNode } from 'react';
import { IconType } from 'react-icons';

export interface MenuItem {
  readonly id: string;
  readonly label: string;
  readonly icon: ReactNode;
  readonly path: string;
  readonly onClick?: () => void;
}

export interface MenuSection {
  readonly key: string;
  readonly section: string;
  readonly icon: ReactNode;
  readonly items: readonly MenuItem[];
}

export type MenuSections = readonly MenuSection[];

export interface SidebarContextType {
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
  activeSection: string;
  setActiveSection: (value: string) => void;
  currentPage: string;
  setCurrentPage: (value: string) => void;
  showProfileMenu: boolean;
  setShowProfileMenu: (value: boolean) => void;
  handleLogout?: () => Promise<void>;
} 