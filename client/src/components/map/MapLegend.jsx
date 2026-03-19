import React from 'react';

// ── MapLegend ─────────────────────────────────────────────────────────────────
// Floating map legend explaining marker colors.
//
// Props:
//   className — extra Tailwind classes
//   style     — inline style overrides (e.g. positioning)

const LEGEND_ITEMS = [
  { color: '#EF4444', label: 'Verified Disaster'   },
  { color: '#F59E0B', label: 'Unverified Disaster' },
  { color: '#10B981', label: 'Resolved'             },
  { color: '#3B82F6', label: 'Your Location'        },
];

const MapLegend = ({ className = '', style = {} }) => (
  <div
    className={[
      'flex flex-col gap-2 px-3.5 py-3 rounded-[14px]',
      'backdrop-blur-xl',
      className,
    ].join(' ')}
    style={{
      background:         'rgba(255, 255, 255, 0.82)',
      border:             '1px solid rgba(255, 255, 255, 0.55)',
      boxShadow:          '0 4px 24px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.7)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      backdropFilter:     'blur(20px) saturate(180%)',
      ...style,
    }}
    aria-label="Map legend"
  >
    <p className="text-[9.5px] font-bold tracking-[.12em] uppercase text-gray-400 leading-none mb-0.5">
      Legend
    </p>

    {LEGEND_ITEMS.map(({ color, label }) => (
      <div key={label} className="flex items-center gap-2.5">
        {/* Marker dot */}
        <span
          className="w-3 h-3 rounded-full shrink-0 ring-2"
          style={{
            background:  color,
            ringColor:   `${color}40`,
            boxShadow:   `0 0 0 2px ${color}30`,
          }}
        />
        <span className="text-[11.5px] font-medium text-gray-700 whitespace-nowrap">
          {label}
        </span>
      </div>
    ))}
  </div>
);

export default MapLegend;
