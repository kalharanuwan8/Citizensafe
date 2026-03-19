import React from 'react';
import StatusBadge from '../ui/StatusBadge';

// ── Disaster type config with SVG paths ───────────────────────────────────────
const TYPE_CONFIG = {
  'flood': {
    bg: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)', color: '#ffffff',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 17c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0"/>
      <path d="M2 12c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0"/>
      <path d="M12 3v5"/><path d="M9 6l3-3 3 3"/>
    </svg>,
    animation: 'animate-pulse'
  },
  'Landslide': {
    bg: 'linear-gradient(135deg, #d97706 0%, #92400e 100%)', color: '#ffffff',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 20l7-7 4 4 7-7"/><circle cx="18" cy="6" r="2"/>
    </svg>,
    animation: 'animate-shake'
  },
  'Fire': {
    bg: 'linear-gradient(135deg, #f97316 0%, #dc2626 100%)', color: '#ffffff',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A4.5 4.5 0 0012 19a4.5 4.5 0 003.5-7.5C14 10 13 8 12 6c0 3-2.5 5-3.5 8.5z"/>
      <path d="M12 6c-1 2-3 4-3 7"/>
    </svg>,
    animation: 'animate-heat'
  },
  'earthquake': {
    bg: 'linear-gradient(135deg, #ef4444 0%, #7f1d1d 100%)', color: '#ffffff',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2 12 6 3 10 12 14 7 18 14 22 12"/>
    </svg>,
    animation: 'animate-shake'
  },
  'Accident': {
    bg: 'linear-gradient(135deg, #a855f7 0%, #6b21a8 100%)', color: '#ffffff',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>,
    animation: 'animate-intense-pulse'
  },
  'tsunami': {
    bg: 'linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%)', color: '#ffffff',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0"/>
      <path d="M4 12l4-8 4 5 3-3 4 4"/>
    </svg>,
    animation: 'animate-pulse'
  },
};

const DEFAULT_CONFIG = {
  bg: '#f1f5f9', color: '#64748b',
  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>,
};

const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DisasterCard = ({
  type        = 'Unknown',
  title,
  distance    = '',
  time        = '',
  status      = 'Unverified',
  icon        = null,
  showConfirm = true,
  onConfirm,
  onClick,
}) => {
  const config = TYPE_CONFIG[type] ?? DEFAULT_CONFIG;
  const label  = title ?? type;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      className={`relative flex items-center gap-3 px-3.5 py-3.5 bg-white
                  border border-gray-100 rounded-2xl cursor-pointer overflow-hidden
                  transition-all duration-150
                  hover:shadow-[0_2px_12px_rgba(15,23,42,0.08)]
                  hover:border-gray-200 hover:-translate-y-px
                  active:scale-[.98] active:translate-y-0
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/40`}
    >
      {/* Left colour accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl"
        style={{ background: config.color }}
      />

      {/* Icon bubble */}
      <div
        className={`w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0 ml-1
                   relative overflow-hidden group-hover:shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-all
                   ${config.animation || ''}`}
        style={{ background: config.bg, color: config.color }}
      >
        {/* Subtle logo background */}
        <img src="/logo.png" alt="" className="absolute inset-0 w-full h-full object-contain opacity-20 grayscale scale-125 pointer-events-none" />
        <div className="relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
          {icon ?? config.icon}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[13.5px] font-semibold text-gray-900 truncate leading-snug">
            {label}
          </span>
          <StatusBadge status={status} size="sm" className="shrink-0" />
        </div>
        <div className="flex items-center gap-2 mt-1">
          {distance && (
            <span className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.2"/>
                <circle cx="5" cy="5" r="1.5" fill="currentColor"/>
              </svg>
              {distance}
            </span>
          )}
          {distance && time && <span className="text-gray-300 text-[10px]">·</span>}
          {time && <span className="text-[11px] text-gray-400 font-medium">{time}</span>}
        </div>
      </div>

      {/* Confirm / Chevron */}
      {showConfirm && status === 'Unverified' ? (
        <button
          aria-label="Confirm this disaster report"
          onClick={(e) => { e.stopPropagation(); onConfirm?.(); }}
          className="shrink-0 flex items-center gap-1 px-2.5 py-1.5
                     rounded-xl text-[11px] font-bold
                     bg-amber-50 text-amber-700 border border-amber-200
                     hover:bg-amber-100 active:scale-95
                     transition-all duration-150"
        >
          <CheckIcon />
          Confirm
        </button>
      ) : (
        <span className="text-gray-300 shrink-0 ml-0.5">
          <ChevronRight />
        </span>
      )}
    </div>
  );
};

export default DisasterCard;
