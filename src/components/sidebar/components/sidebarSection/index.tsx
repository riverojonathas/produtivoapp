import React, { ReactNode,useRef, useEffect, useState } from 'react';
import styles from '../../styles/sidebar.module.css';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';


interface SidebarSectionProps {
  title: string;
  icon: ReactNode;
  isExpanded: boolean;
  isActive: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export const SidebarSection: React.FC<SidebarSectionProps> = ({
  title,
  icon,
  isExpanded,
  isActive,
  onToggle,
  children
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight;
      setContentHeight(height);
    }
  }, [children]);

  return (
    <div className={`${styles.section} ${isActive ? styles.active : ''}`}>
      <button
        className={styles.sectionHeader}
        onClick={onToggle}
      >
        <span className={styles.sectionIcon}>{icon}</span>
        {isExpanded && (
          <>
            <span className={styles.sectionTitle}>{title}</span>
            <span className={styles.sectionToggle}>
              {isActive ? <FiChevronUp /> : <FiChevronDown />}
            </span>
          </>
        )}
      </button>
      <div
        ref={contentRef}
        className={styles.sectionContent}
        style={{
          height: isActive ? `${contentHeight}px` : '0',
          opacity: isActive ? 1 : 0,
          visibility: isActive ? 'visible' : 'hidden'
        }}
      >
        {children}
      </div>
    </div>
  );
}; 