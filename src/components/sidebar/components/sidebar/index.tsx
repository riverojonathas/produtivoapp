import React from 'react';
import { useTheme } from '@/contexts/theme-context';
import styles from '../../styles/sidebar.module.css';
import { 
  FiSun, 
  FiMoon,
  FiChevronLeft,
  FiChevronRight,
  FiUser,
  FiBell
} from 'react-icons/fi';
import { SidebarSection } from '../sidebarSection';
import { SidebarItem } from '../sidebarItem';
import { menuSections } from '../../constants/menuItems';
import { Logo, LogoHorizontal } from '@/components/ui/logo';
import { useNotifications } from '@/hooks/useNotifications';
import { ErrorBoundary } from 'react-error-boundary';

const Sidebar: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [activeSection, setActiveSection] = React.useState<string>('home');
  const [currentPage, setCurrentPage] = React.useState<string>('dashboard');
  const [isThemeTransitioning, setIsThemeTransitioning] = React.useState(false);
  const { unreadCount, markAllAsRead } = useNotifications();

  const handlePageChange = (pageId: string) => {
    setCurrentPage(pageId);
  };

  const toggleSection = (sectionKey: string) => {
    setActiveSection(prevSection => 
      prevSection === sectionKey ? '' : sectionKey
    );
  };

  const handleThemeToggle = () => {
    setIsThemeTransitioning(true);
    toggleTheme();
    setTimeout(() => setIsThemeTransitioning(false), 400);
  };

  const handleNotificationClick = () => {
    markAllAsRead();
  };

  const handleError = (error: Error) => {
    console.error('Erro no sidebar:', error);
    // Você pode adicionar uma notificação de erro aqui
  };

  return (
    <ErrorBoundary
      fallback={<div>Erro ao carregar o menu</div>}
      onError={handleError}
    >
      <aside 
        className={`
          ${styles.sidebar} 
          ${!isExpanded ? styles.collapsed : ''} 
          ${isThemeTransitioning ? styles['theme-transitioning'] : ''}
        `}
        style={{
          transition: isThemeTransitioning 
            ? 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            : 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div className={styles.sidebarHeader}>
          {isExpanded ? <LogoHorizontal /> : <Logo />}
        </div>

        <nav className={styles.sidebarNav}>
          {menuSections.map((section) => (
            <SidebarSection
              key={section.key}
              isExpanded={isExpanded}
              isActive={activeSection === section.key}
              title={section.section}
              icon={section.icon}
              onToggle={() => toggleSection(section.key)}
            >
              {section.items.map((item) => (
                <SidebarItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  isActive={currentPage === item.id}
                  isExpanded={isExpanded}
                  onClick={() => handlePageChange(item.id)}
                />
              ))}
            </SidebarSection>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.footerButtons}>
            <button
              className={styles.footerButton}
              onClick={handleThemeToggle}
              title={!isExpanded ? 'Alternar Tema' : 'Alternar entre tema claro e escuro'}
            >
              {isDarkMode ? <FiSun /> : <FiMoon />}
            </button>

            <div className={styles.footerButtonWrapper}>
              <button
                className={`${styles.footerButton} ${unreadCount > 0 ? styles.hasNotifications : ''}`}
                onClick={handleNotificationClick}
                title={!isExpanded ? 'Notificações' : `${unreadCount} notificações não lidas`}
              >
                <FiBell />
                {unreadCount > 0 && (
                  <span className={styles.notificationBadge}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>
            </div>

            <button 
              className={styles.collapseButton}
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? 'Recolher menu' : 'Expandir menu'}
            >
              {isExpanded ? <FiChevronLeft /> : <FiChevronRight />}
            </button>
          </div>

          <button
            className={styles.footerButton}
            title={!isExpanded ? 'Perfil' : 'Acessar perfil'}
          >
            <FiUser />
          </button>
        </div>
      </aside>
    </ErrorBoundary>
  );
};

export default Sidebar; 