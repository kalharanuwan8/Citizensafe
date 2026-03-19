import React from 'react';

// ── StatusBadge ───────────────────────────────────────────────────────────────
// Color-coded badge specifically for disaster status values.
//
// Props:
//   status  — 'Verified' | 'Unverified' | 'Resolved'
//   dot     — boolean, show animated pulse dot
//   size    — 'sm' | 'md'
//   className — extra Tailwind classes

const STATUS_MAP = {
  Verified: {
    classes: 'bg-red-50 text-red-800 border-red-200',
    dot: 'bg-red-500',
    label: 'Verified',
  },
  Active: {
    classes: 'bg-red-50 text-red-800 border-red-200',
    dot: 'bg-red-500',
    label: 'Verified',
  },
  Unverified: {
    classes: 'bg-amber-50 text-amber-800 border-amber-200',
    dot: 'bg-amber-500',
    label: 'Unverified',
  },
  Resolved: {
    classes: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dot: 'bg-emerald-500',
    label: 'Resolved',
  },
  Solved: {
    classes: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dot: 'bg-emerald-500',
    label: 'Resolved',
  },
};

const SIZE_MAP = {
  sm: 'text-[10px] px-2 py-0.5',
  md: 'text-xs px-2.5 py-0.75',
};

const StatusBadge = ({ status = 'Unverified', dot = false, size = 'md', className = '' }) => {
  const cfg = STATUS_MAP[status] ?? STATUS_MAP.Unverified;
  const sz  = SIZE_MAP[size]   ?? SIZE_MAP.md;

  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-full font-semibold tracking-[.01em] border-[.5px]',
        cfg.classes,
        sz,
        className,
      ].join(' ')}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${cfg.dot}`} />
          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${cfg.dot}`} />
        </span>
      )}
      {cfg.label}
    </span>
  );
};

export default StatusBadge;
