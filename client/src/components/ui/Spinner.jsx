import React from 'react';

const SIZES = {
  xs: 'w-3.5 h-3.5 border-[1.5px]',
  sm: 'w-4 h-4 border-2',
  md: 'w-7 h-7 border-[3px]',
  lg: 'w-11 h-11 border-4',
};

const COLORS = {
  indigo: 'border-indigo-200 border-t-indigo-600',
  white:  'border-white/25 border-t-white',
  gray:   'border-[var(--color-border-secondary)] border-t-[var(--color-text-secondary)]',
};

const Spinner = ({
  size  = 'md',   // 'xs' | 'sm' | 'md' | 'lg'
  color = 'indigo', // 'indigo' | 'white' | 'gray'
  label,            // optional accessible label
  className = '',
}) => (
  <span role="status" aria-label={label ?? 'Loading'} className="inline-flex items-center gap-2">
    <span
      className={[
        'rounded-full animate-spin shrink-0',
        SIZES[size]  ?? SIZES.md,
        COLORS[color] ?? COLORS.indigo,
        className,
      ].join(' ')}
    />
    {label && (
      <span className="text-sm font-medium text-(--color-text-secondary)">{label}</span>
    )}
  </span>
);

export default Spinner;