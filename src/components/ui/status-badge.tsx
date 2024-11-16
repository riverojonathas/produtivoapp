'use client';

interface StatusBadgeProps {
  status: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ 
  status, 
  variant = 'neutral',
  size = 'md'
}: StatusBadgeProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'warning':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'error':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'info':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default:
        return 'bg-[var(--color-background-subtle)] text-[var(--color-text-secondary)] border-[var(--color-border)]';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-0.5 gap-1';
      case 'lg':
        return 'text-sm px-3 py-1.5 gap-2';
      default:
        return 'text-sm px-2.5 py-1 gap-1.5';
    }
  };

  return (
    <span className={`
      inline-flex items-center justify-center
      font-medium border rounded-full
      transition-all duration-200
      hover:opacity-80
      ${getVariantStyles()}
      ${getSizeStyles()}
    `}>
      <span className="relative">
        <span className="relative z-10">
          {status}
        </span>
        <span className="absolute inset-0 rounded-full bg-current opacity-[0.08] blur-[2px]" />
      </span>
    </span>
  );
} 