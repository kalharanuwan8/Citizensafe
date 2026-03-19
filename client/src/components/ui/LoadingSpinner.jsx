import React from 'react';

// ── LoadingSpinner ────────────────────────────────────────────────────────────
// Standalone loading spinner with optional label.
//
// Props:
//   size    — 'sm' | 'md' | 'lg'
//   label   — optional text shown below the spinner
//   color   — 'indigo' | 'white' | 'gray'
//   className — extra Tailwind classes

const SIZE_MAP = {
  sm: { ring: 'w-5 h-5 border-2',  gap: 'gap-2',   text: 'text-xs' },
  md: { ring: 'w-8 h-8 border-3',  gap: 'gap-2.5', text: 'text-sm' },
  lg: { ring: 'w-12 h-12 border-4', gap: 'gap-3',   text: 'text-base' },
};

const COLOR_MAP = {
  indigo: 'border-indigo-200 border-t-indigo-600',
  white:  'border-white/25 border-t-white',
  gray:   'border-gray-200 border-t-gray-500',
};

const LoadingSpinner = ({
  size      = 'md',
  label     = '',
  color     = 'indigo',
  className = '',
}) => {
  const sz  = SIZE_MAP[size]   ?? SIZE_MAP.md;
  const clr = COLOR_MAP[color] ?? COLOR_MAP.indigo;

  return (
    <div
      role="status"
      aria-label={label || 'Loading'}
      className={['flex flex-col items-center justify-center', sz.gap, className].join(' ')}
    >
      <span
        className={[
          'rounded-full animate-spin inline-block shrink-0',
          sz.ring,
          clr,
        ].join(' ')}
      />
      {label && (
        <p className={['font-medium text-[var(--color-text-secondary)]', sz.text].join(' ')}>
          {label}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
