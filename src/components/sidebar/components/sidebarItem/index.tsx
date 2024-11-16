import React, { ReactNode } from 'react';
import styles from '../../styles/sidebar.module.css';

interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  isActive: boolean;
  isExpanded: boolean;
  onClick: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  isActive,
  isExpanded,
  onClick

}) => {
  return (
    <button
      className={`${styles.item} ${isActive ? styles.active : ''}`}
      onClick={onClick}
      title={!isExpanded ? label : ''}
    >
      <span className={styles.itemIcon}>{icon}</span>
      {isExpanded && <span className={styles.itemLabel}>{label}</span>}
    </button>
  );
};