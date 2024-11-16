'use client';

import { ReactNode } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
}

export function PageHeader({ 
  title, 
  subtitle, 
  action,
  breadcrumbs 
}: PageHeaderProps) {
  return (
    <div className="space-y-2">
      {breadcrumbs && (
        <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
          {breadcrumbs.map((item, index) => (
            <div key={item.label} className="flex items-center gap-2">
              {index > 0 && <ChevronRightIcon className="w-4 h-4" />}
              {item.href ? (
                <a 
                  href={item.href}
                  className="hover:text-[var(--color-text-primary)] transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <span>{item.label}</span>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-text-primary)]">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
              {subtitle}
            </p>
          )}
        </div>

        {action && (
          <div className="flex items-center gap-3 ml-6">
            {action}
          </div>
        )}
      </div>

      <div className="h-px bg-gradient-to-r from-[var(--color-border)] via-transparent to-transparent opacity-50 mt-6" />
    </div>
  );
} 