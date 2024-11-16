'use client';

import { ReactNode } from 'react';
import { Card } from './card';
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  EllipsisHorizontalIcon
} from '@heroicons/react/24/outline';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  change?: {
    value: string | number;
    trend: 'up' | 'down' | 'neutral';
    description?: string;
  };
  className?: string;
  onClick?: () => void;
}

export function MetricCard({ 
  title, 
  value, 
  icon, 
  change,
  className = '',
  onClick
}: MetricCardProps) {
  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-[var(--color-text-secondary)]';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowTrendingUpIcon className="w-4 h-4" />;
      case 'down':
        return <ArrowTrendingDownIcon className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <Card 
      className={`
        group relative p-6 bg-[var(--color-background-elevated)] 
        hover:shadow-lg transition-all duration-300 
        hover:translate-y-[-2px] cursor-pointer
        ${className}
      `}
      onClick={onClick}
    >
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-1 rounded-full hover:bg-[var(--color-background-hover)]">
          <EllipsisHorizontalIcon className="w-5 h-5 text-[var(--color-text-secondary)]" />
        </button>
      </div>

      <div className="flex items-start space-y-4 flex-col">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="p-2 rounded-xl bg-[var(--color-accent-light)] text-[var(--color-primary)]">
              {icon}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-[var(--color-text-secondary)]">
              {title}
            </p>
            <p className="mt-1 text-2xl font-semibold text-[var(--color-text-primary)]">
              {value}
            </p>
          </div>
        </div>

        {change && (
          <div className="flex items-center gap-2 mt-4">
            <span className={`flex items-center gap-1 text-sm font-medium ${getTrendColor(change.trend)}`}>
              {getTrendIcon(change.trend)}
              {change.value}
            </span>
            {change.description && (
              <span className="text-sm text-[var(--color-text-secondary)]">
                {change.description}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-accent-light)] opacity-0 group-hover:opacity-100 transition-opacity rounded-b-lg" />
    </Card>
  );
} 