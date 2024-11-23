export const animations = {
  spring: {
    type: "spring",
    stiffness: 500,
    damping: 30,
    mass: 1
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  }
}

export const colors = {
  primary: 'var(--color-primary)',
  primaryHover: 'var(--color-primary-hover)',
  background: 'var(--color-background-primary)',
  backgroundSubtle: 'var(--color-background-subtle)',
  border: 'var(--color-border)',
  text: 'var(--color-text-primary)',
  textSecondary: 'var(--color-text-secondary)'
}

export const layout = {
  headerHeight: '3.5rem',
  sidebarWidth: '16rem',
  contentPadding: '1.5rem',
  borderRadius: '0.5rem',
  maxWidth: '72rem'
} 