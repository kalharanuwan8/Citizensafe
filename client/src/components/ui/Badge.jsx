import React from 'react';

const VARIANTS = {
  default: 'bg-[var(--color-background-secondary)] text-[var(--color-text-secondary)] border-[var(--color-border-secondary)]',
  primary: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  danger:  'bg-red-50 text-red-800 border-red-200',
  warning: 'bg-amber-50 text-amber-800 border-amber-200',
  info:    'bg-blue-50 text-blue-800 border-blue-200',
};

const DOT_COLORS = {
  primary: 'bg-indigo-500',
  success: 'bg-emerald-500',
  danger:  'bg-red-500',
  warning: 'bg-amber-500',
  info:    'bg-blue-500',
};

const Badge = ({
  children,
  variant  = 'default',
  dot      = false,       // show animated pulse dot
  icon     = null,        // optional leading icon element
  className = '',
}) => (
  <span
    className={[
      'inline-flex items-center gap-1.5 px-2.5 py-0.75',
      'rounded-full text-xs font-semibold tracking-[.01em]',
      'border-[.5px]',
      VARIANTS[variant] ?? VARIANTS.default,
      className,
    ].join(' ')}
  >
    {dot && (
      <span className="relative flex h-1.5 w-1.5">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${DOT_COLORS[variant] ?? 'bg-gray-400'}`} />
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${DOT_COLORS[variant] ?? 'bg-gray-400'}`} />
      </span>
    )}
    {!dot && icon && <span className="w-3 h-3 shrink-0">{icon}</span>}
    {children}
  </span>
);

export default Badge;