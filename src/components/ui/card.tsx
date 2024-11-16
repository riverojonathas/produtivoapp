'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'elevated' | 'outline' | 'ghost';
  hover?: boolean;
  animation?: boolean;
}

export function Card({ 
  children, 
  className = '',
  onClick,
  variant = 'default',
  hover = true,
  animation = true
}: CardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return 'bg-[var(--color-background-elevated)] shadow-md hover:shadow-lg';
      case 'outline':
        return 'border border-[var(--color-border)] bg-transparent';
      case 'ghost':
        return 'bg-transparent hover:bg-[var(--color-background-hover)]';
      default:
        return 'bg-[var(--color-background-elevated)] border border-[var(--color-border)]';
    }
  };

  const getHoverStyles = () => {
    if (!hover) return '';
    return `
      hover:border-[var(--color-primary)]
      hover:shadow-[0_0_0_1px_var(--color-primary)]
      hover:translate-y-[-2px]
    `;
  };

  const getAnimationStyles = () => {
    if (!animation) return '';
    return 'transition-all duration-200';
  };

  return (
    <div
      className={`
        rounded-xl
        ${getVariantStyles()}
        ${getHoverStyles()}
        ${getAnimationStyles()}
        ${className}
      `}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
} 