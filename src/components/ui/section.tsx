'use client';

import { ReactNode } from 'react';
import { Card } from './card';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';

interface SectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Section({ 
  title, 
  description, 
  children, 
  action,
  className = '',
  onClick
}: SectionProps) {
  return (
    <Card 
      className={`
        group relative p-6 bg-[var(--color-background-elevated)] 
        hover:shadow-lg transition-all duration-300 
        ${className}
      `}
      onClick={onClick}
    >
      {(title || description || action) && (
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            {title && (
              <h2 className="text-lg font-medium tracking-tight text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm text-[var(--color-text-secondary)]">
                {description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {action}
            <button 
              className="p-1.5 rounded-full text-[var(--color-text-secondary)] opacity-0 group-hover:opacity-100 hover:bg-[var(--color-background-hover)] transition-all duration-200"
              title="Mais opções"
            >
              <EllipsisHorizontalIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
      <div className="relative">
        {children}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-accent-light)] opacity-0 group-hover:opacity-100 transition-opacity rounded-b-lg" />
      </div>
    </Card>
  );
} 