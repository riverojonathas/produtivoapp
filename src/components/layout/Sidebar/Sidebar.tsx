'use client';

import { FC, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { 
  ChevronDownIcon,
  ChevronLeftIcon,
  SunIcon,
  MoonIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import styles from './sidebar.module.css';
import { Logo } from '../components/Logo';
import { menuSections } from '../constants/menuItems';
import type { MenuSection } from '../types';

interface ISidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: FC<ISidebarProps> = ({ isOpen, onToggle }) => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    // Encontrar e expandir a seção ativa inicialmente
    const activeSection = menuSections.find(section =>
      section.items.some(item => item.path === pathname)
    );
    if (activeSection) {
      setExpandedSection(activeSection.key);
    }
  }, [pathname]);

  const toggleSection = (sectionKey: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    setExpandedSection(currentSection => 
      currentSection === sectionKey ? null : sectionKey
    );
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const isActive = (path: string) => pathname === path;
  const isSectionExpanded = (sectionKey: string) => expandedSection === sectionKey;
  const isSectionActive = (section: MenuSection) => 
    section.items.some(item => isActive(item.path));

  if (!mounted) {
    return null;
  }

  return (
    <aside 
      className={`${styles.sidebar} ${isOpen ? styles.open : styles.collapsed}`}
      onMouseEnter={() => !isOpen && setExpandedSection(null)}
    >
      <div className={styles.sidebarContent}>
        <Logo collapsed={!isOpen} />
        <nav className={styles.navigation}>
          {menuSections.map((section: MenuSection) => (
            <div 
              key={section.key} 
              className={`${styles.section} ${
                isSectionExpanded(section.key) ? styles.expanded : ''
              }`}
            >
              <button
                onClick={(e) => toggleSection(section.key, e)}
                className={`${styles.sectionButton} ${
                  isSectionActive(section) ? styles.active : ''
                }`}
              >
                <span className={styles.sectionIcon}>{section.icon}</span>
                <span className={styles.sectionText}>{section.section}</span>
                <ChevronDownIcon className={styles.chevron} />
              </button>

              <ul className={styles.submenu}>
                {section.items.map(item => (
                  <li key={item.id}>
                    <Link
                      href={item.path}
                      className={`${styles.menuItem} ${
                        isActive(item.path) ? styles.active : ''
                      }`}
                    >
                      <span className={styles.menuItemIcon}>{item.icon}</span>
                      <span className={styles.menuItemText}>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className={styles.controlBar}>
          <button
            onClick={toggleTheme}
            className={styles.controlButton}
            aria-label="Alternar tema"
            title="Alternar tema"
          >
            {theme === 'dark' ? (
              <SunIcon className="w-5 h-5" />
            ) : (
              <MoonIcon className="w-5 h-5" />
            )}
          </button>

          <button
            onClick={onToggle}
            className={styles.controlButton}
            aria-label="Colapsar menu"
            title="Colapsar menu"
          >
            <ChevronLeftIcon className={`w-5 h-5 transition-transform duration-200 ${!isOpen ? 'rotate-180' : ''}`} />
          </button>

          <button
            className={styles.controlButton}
            aria-label="Perfil do usuário"
            title="Perfil do usuário"
          >
            <UserCircleIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}; 