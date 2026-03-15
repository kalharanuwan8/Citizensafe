import React from 'react';

// ── Spinner (inline, no external dep) ────────────────────────────────────────
const SPINNER_SIZES = {
  sm: 'w-3 h-3 border-[1.5px]',
  md: 'w-3.5 h-3.5 border-2',
  lg: 'w-4 h-4 border-2',
};

const Spinner = ({ size = 'md', dark = false }) => (
  <span
    role="status"
    aria-label="Loading"
    className={[
      'rounded-full animate-spin shrink-0 inline-block',
      SPINNER_SIZES[size] ?? SPINNER_SIZES.md,
      dark
        ? 'border-black/10 border-t-(--color-text-secondary)'
        : 'border-white/25 border-t-white',
    ].join(' ')}
  />
);

// ── Sizes ─────────────────────────────────────────────────────────────────────
const SIZES = {
  sm: 'h-[34px] px-[14px] text-[13px] rounded-lg',
  md: 'h-[42px] px-5   text-sm      rounded-[10px]',
  lg: 'h-[52px] px-7   text-[15px]  rounded-xl',
};

// ── Variants ──────────────────────────────────────────────────────────────────
const VARIANTS = {
  primary:
    'bg-indigo-600 text-white ' +
    'shadow-[0_1px_2px_rgba(79,70,229,.3),inset_0_1px_0_rgba(255,255,255,.15)] ' +
    'hover:bg-indigo-700 hover:shadow-[0_4px_12px_rgba(79,70,229,.4)]',

  secondary:
    'bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] ' +
    'border-[.5px] border-[var(--color-border-secondary)] ' +
    'hover:bg-[var(--color-background-tertiary)] hover:border-[var(--color-border-primary)]',

  danger:
    'bg-red-600 text-white ' +
    'shadow-[0_1px_2px_rgba(220,38,38,.3),inset_0_1px_0_rgba(255,255,255,.12)] ' +
    'hover:bg-red-700 hover:shadow-[0_4px_12px_rgba(220,38,38,.35)]',

  ghost:
    'bg-transparent text-[var(--color-text-primary)] ' +
    'border-[1.5px] border-[var(--color-border-secondary)] ' +
    'hover:border-[var(--color-border-primary)] hover:bg-[var(--color-background-secondary)]',

  success:
    'bg-emerald-600 text-white ' +
    'shadow-[0_1px_2px_rgba(5,150,105,.3),inset_0_1px_0_rgba(255,255,255,.12)] ' +
    'hover:bg-emerald-700 hover:shadow-[0_4px_12px_rgba(5,150,105,.35)]',
};

// Whether the spinner should use the dark (visible-on-light) track
const DARK_SPINNER_VARIANTS = new Set(['secondary', 'ghost']);

// ── Button ────────────────────────────────────────────────────────────────────
const Button = ({
  children,
  onClick,
  type       = 'button',
  variant    = 'primary',
  size       = 'md',
  fullWidth  = false,
  loading    = false,
  disabled   = false,
  iconLeft   = null,
  iconRight  = null,
  loadingText,           // optional label shown while loading, e.g. "Saving…"
  className  = '',
}) => {
  const isDisabled   = disabled || loading;
  const useDarkSpinner = DARK_SPINNER_VARIANTS.has(variant);

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={loading}
      className={[
        // layout
        'inline-flex items-center justify-center gap-2',
        // typography
        'font-semibold tracking-[.01em]',
        // transitions — transform uses spring easing, rest are linear-ish
        'transition-[transform,box-shadow,background,opacity]',
        'duration-[120ms,150ms,150ms,150ms]',
        'ease-[cubic-bezier(.34,1.56,.64,1)]',
        // interaction
        'outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50',
        'hover:-translate-y-px active:translate-y-0 active:scale-[.96]',
        // overflow (keeps ripple contained)
        'relative overflow-hidden',
        // size + variant
        SIZES[size]    ?? SIZES.md,
        VARIANTS[variant] ?? VARIANTS.primary,
        // conditional
        fullWidth  ? 'w-full'                                    : '',
        isDisabled ? 'opacity-45 pointer-events-none cursor-not-allowed' : '',
        className,
      ].filter(Boolean).join(' ')}
    >
      {/* Leading slot: spinner (when loading) OR iconLeft */}
      {loading
        ? <Spinner size={size} dark={useDarkSpinner} />
        : iconLeft}

      {/* Label — swaps to loadingText when loading, if provided */}
      <span>{loading && loadingText ? loadingText : children}</span>

      {/* Trailing icon — hidden while loading so layout stays stable */}
      {!loading && iconRight}
    </button>
  );
};

export default Button;