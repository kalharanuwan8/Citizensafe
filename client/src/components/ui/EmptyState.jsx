import React from 'react';

// ── EmptyState ────────────────────────────────────────────────────────────────
// Shown when a list has no items. Accepts custom icon, title, and message.
//
// Props:
//   icon      — React element (SVG or emoji string)
//   title     — heading text
//   message   — subtext
//   action    — optional { label, onClick } for a CTA button
//   className — extra Tailwind classes

const DefaultIcon = () => (
  <svg
    width="48" height="48" viewBox="0 0 48 48" fill="none"
    className="text-emerald-400"
    aria-hidden="true"
  >
    <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" />
    <path
      d="M16 24l5.5 5.5L32 18"
      stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

const EmptyState = ({
  icon      = null,
  title     = "You're safe",
  message   = "No disasters reported nearby. Stay alert and stay safe.",
  action    = null,
  className = '',
}) => (
  <div
    className={[
      'flex flex-col items-center justify-center gap-4 py-10 px-6 text-center',
      className,
    ].join(' ')}
  >
    {/* Icon bubble */}
    <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center
                    border border-emerald-100 shadow-sm">
      {icon ?? <DefaultIcon />}
    </div>

    {/* Copy */}
    <div className="space-y-1.5 max-w-[220px]">
      <h3 className="text-[15px] font-semibold text-[var(--color-text-primary)]">
        {title}
      </h3>
      <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed">
        {message}
      </p>
    </div>

    {/* Optional CTA */}
    {action && (
      <button
        onClick={action.onClick}
        className="mt-1 h-9 px-5 rounded-lg text-sm font-semibold
                   bg-emerald-600 text-white
                   hover:bg-emerald-700
                   transition-[background,transform] duration-150
                   hover:-translate-y-px active:scale-[.97]"
      >
        {action.label}
      </button>
    )}
  </div>
);

export default EmptyState;
