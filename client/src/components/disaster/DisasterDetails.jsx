import React from 'react';
import StatusBadge from '../ui/StatusBadge';
import Button from '../ui/Button';

// ── Icons ─────────────────────────────────────────────────────────────────────
const ArrowLeft = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.6"
          strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LocationIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 1.5C4.79 1.5 3 3.29 3 5.5c0 3.18 4 7 4 7s4-3.82 4-7c0-2.21-1.79-4-4-4Z"
      stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    <circle cx="7" cy="5.5" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M7 4.5V7l2 1.5" stroke="currentColor" strokeWidth="1.4"
          strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ShareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="13" cy="3" r="1.5" stroke="currentColor" strokeWidth="1.4"/>
    <circle cx="13" cy="13" r="1.5" stroke="currentColor" strokeWidth="1.4"/>
    <circle cx="3" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M4.5 7.1L11.5 3.9M4.5 8.9L11.5 12.1"
          stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

const TYPE_CONFIG = {
  'flood':         { bg: 'linear-gradient(135deg, #075985 0%, #1e40af 100%)', color: '#ffffff', icon: '🌊', animation: 'animate-pulse' },
  'Landslide':     { bg: 'linear-gradient(135deg, #92400e 0%, #4527a0 100%)', color: '#ffffff', icon: '⛰️', animation: 'animate-shake' },
  'power_outage':  { bg: 'linear-gradient(135deg, #374151 0%, #111827 100%)', color: '#ffffff', icon: '⚡', animation: '' },
  'earthquake':    { bg: 'linear-gradient(135deg, #991b1b 0%, #450a0a 100%)', color: '#ffffff', icon: '🌍', animation: 'animate-shake' },
  'Fire':          { bg: 'linear-gradient(135deg, #ea580c 0%, #991b1b 100%)', color: '#ffffff', icon: '🔥', animation: 'animate-heat' },
  'tsunami':       { bg: 'linear-gradient(135deg, #1e3a8a 0%, #172554 100%)', color: '#ffffff', icon: '🌊', animation: 'animate-pulse' },
  'hurricane':     { bg: 'linear-gradient(135deg, #5b21b6 0%, #2e1065 100%)', color: '#ffffff', icon: '🌀', animation: 'animate-pulse' },
  'Accident':      { bg: 'linear-gradient(135deg, #7e22ce 0%, #4c1d95 100%)', color: '#ffffff', icon: '🚨', animation: 'animate-intense-pulse' },
  'other':         { bg: 'linear-gradient(135deg, #475569 0%, #1e293b 100%)', color: '#ffffff', icon: '⚠️', animation: '' },
};
// Mapping aliases
TYPE_CONFIG['Flash Flood'] = TYPE_CONFIG['flood'];
TYPE_CONFIG['Wildfire'] = TYPE_CONFIG['Fire'];

// ── Placeholder detail data ───────────────────────────────────────────────────
const PLACEHOLDER = {
  type: 'Flash Flood',
  title: 'Flash Flood Warning',
  status: 'Verified',
  distance: '1.2 km',
  time: '20 mins ago',
  location: 'Nugegoda, Western Province',
  description:
    'Heavy rainfall has caused severe flash flooding in low-lying areas. Residents near the riverbanks are advised to evacuate immediately. Avoid all contact with floodwater.',
  reportedBy: 'Civil Defense Authority',
  affectedZones: ['Zone A – Nugegoda Town', 'Zone B – Peradeniya Rd', 'Zone C – Nawala'],
  emergencyContacts: [
    { label: 'Emergency Hotline', number: '1926' },
    { label: 'Police', number: '119' },
    { label: 'Fire & Rescue', number: '110' },
  ],
};

// ── DisasterDetails ───────────────────────────────────────────────────────────
// Props:
//   disaster  — object with disaster data (falls back to PLACEHOLDER)
//   onBack    — callback to navigate back
//   onConfirm — callback to confirm (unverified)
//   onShare   — callback to share

const DisasterDetails = ({
  disaster    = PLACEHOLDER,
  onBack,
  onConfirm,
  onShare,
  onImageSelect,
}) => {
  const d      = { ...PLACEHOLDER, ...disaster };
  const config = TYPE_CONFIG[d.type] ?? { bg: '#F3F4F6', emoji: '⚠️', color: '#6B7280' };

  return (
    <div className="flex flex-col h-full bg-[var(--color-background-primary)] overflow-y-auto
                    [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

      {/* ── Hero band ─────────────────────────────────────────────────────── */}
      <div
        className="relative px-5 pt-14 pb-8 shrink-0 overflow-hidden"
        style={{ background: config.bg }}
      >
        {/* Intense Overlay for readability */}
        <div className="absolute inset-0 bg-black/30 pointer-events-none z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-[1]" />
        <div className="vignette z-[2]" />
        <div className="noise z-[2]" />
        <div className="scanline z-[2]" />
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-15 pointer-events-none z-[1]" 
             style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '16px 16px' }} />
        {/* Back button */}
        <button
          aria-label="Go back"
          onClick={onBack}
          className="absolute top-4 left-4 w-9 h-9 flex items-center justify-center z-[20]
                     rounded-xl bg-white/20 backdrop-blur-md border border-white/40
                     text-white hover:bg-white/30
                     transition-[background,transform] duration-150
                     hover:-translate-y-px active:scale-95"
        >
          <ArrowLeft />
        </button>

        {/* Share button */}
        <button
          aria-label="Share"
          onClick={onShare}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center z-[20]
                     rounded-xl bg-white/20 backdrop-blur-md border border-white/40
                     text-white hover:bg-white/30
                     transition-[background,transform] duration-150
                     hover:-translate-y-px active:scale-95"
        >
          <ShareIcon />
        </button>

        {/* Icon Container */}
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl
                     shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-white/40 mb-4
                     bg-white/95 relative overflow-hidden ${config.animation || ''}`}
        >
          {/* Subtle logo background */}
          <img src="/logo.png" alt="" className="absolute inset-0 w-full h-full object-contain opacity-20 scale-150 grayscale" />
          <span className="relative z-10 drop-shadow-md">{config.icon || '⚠️'}</span>
        </div>

        {/* Title row */}
        <div className="relative z-[10] flex items-start justify-between gap-3">
          <h1 className="text-[24px] font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] leading-tight uppercase tracking-tight">
            {d.title ?? d.type}
          </h1>
          <StatusBadge status={d.status} dot={d.status === 'Verified'} className="mt-1 shrink-0 shadow-[0_4px_12px_rgba(0,0,0,0.3)]" />
        </div>

        {/* Meta row */}
        <div className="relative z-[10] flex flex-wrap items-center gap-x-4 gap-y-1 mt-3">
          <span className="flex items-center gap-1.5 text-[13px] text-white font-bold drop-shadow-md whitespace-nowrap">
            <LocationIcon /> {d.location}
          </span>
          <span className="flex items-center gap-1.5 text-[13px] text-white font-bold drop-shadow-md whitespace-nowrap">
            <ClockIcon /> {d.time}
          </span>
          <span className="text-[12px] bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md text-white font-black tracking-widest uppercase border border-white/30">{d.distance} away</span>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      <div className="flex-1 px-5 py-6 space-y-6">

        {/* Photos */}
        <section>
          <h2 className="text-[10px] font-semibold tracking-widest uppercase
                         text-[var(--color-text-tertiary)] mb-3">
            Photos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="w-full h-56 sm:h-72 rounded-2xl overflow-hidden border border-black/[.05] shadow-md bg-gray-50 flex items-center justify-center relative group">
              {d.image?.url ? (
                <img 
                  src={d.image.url} 
                  alt="Disaster Observation" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <img src="/logo.png" alt="CitizenSafe" className="w-16 h-16 opacity-20 grayscale" />
                  <p className="text-[11px] font-bold text-gray-300 uppercase tracking-widest">No Photos provided</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Description */}
        <section>
          <h2 className="text-[10px] font-semibold tracking-widest uppercase
                         text-[var(--color-text-tertiary)] mb-2">
            What's Happening
          </h2>
          <p className="text-[13.5px] text-[var(--color-text-secondary)] leading-relaxed">
            {d.description}
          </p>
        </section>

        {/* Reported by */}
        <section className="flex items-center gap-3 px-4 py-3
                            bg-[var(--color-background-secondary)]
                            border-[.5px] border-[var(--color-border-tertiary)]
                            rounded-[14px]">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-base shrink-0">
            🏛️
          </div>
          <div>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-[var(--color-text-tertiary)]">
              Reported by
            </p>
            <p className="text-[13px] font-semibold text-[var(--color-text-primary)]">
              {d.reportedBy}
            </p>
          </div>
        </section>

        {/* Affected zones */}
        {d.affectedZones?.length > 0 && (
          <section>
            <h2 className="text-[10px] font-semibold tracking-widest uppercase
                           text-[var(--color-text-tertiary)] mb-2">
              Affected Zones
            </h2>
            <ul className="space-y-1.5">
              {d.affectedZones.map((zone) => (
                <li
                  key={zone}
                  className="flex items-center gap-2 text-[13px] text-[var(--color-text-secondary)]"
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: config.color }}
                  />
                  {zone}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Emergency contacts */}
        {d.emergencyContacts?.length > 0 && (
          <section>
            <h2 className="text-[10px] font-semibold tracking-widest uppercase
                           text-[var(--color-text-tertiary)] mb-2">
              Emergency Contacts
            </h2>
            <div className="space-y-2">
              {d.emergencyContacts.map((c) => (
                <a
                  key={c.number}
                  href={`tel:${c.number}`}
                  className="flex items-center justify-between px-4 py-3
                             bg-[var(--color-background-secondary)]
                             border-[.5px] border-[var(--color-border-tertiary)]
                             rounded-[14px]
                             hover:bg-[var(--color-background-tertiary)]
                             transition-colors duration-150"
                >
                  <span className="text-[13px] font-medium text-[var(--color-text-primary)]">
                    {c.label}
                  </span>
                  <span className="text-[13px] font-bold text-red-600 tracking-wide">
                    {c.number}
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ── Footer CTA ───────────────────────────────────────────────────────── */}
      <div className="px-5 pb-8 pt-3 border-t border-[var(--color-border-tertiary)] shrink-0">
        {d.status === 'Unverified' && (
          <div className="space-y-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-gray-700">Attach Proof Photo (Required)</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={e => onImageSelect?.(e.target.files[0])} 
                className="text-[12px] text-gray-500 
                           file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 
                           file:text-[11px] file:font-semibold 
                           file:bg-emerald-50 file:text-emerald-700 
                           hover:file:bg-emerald-100 transition-colors"
              />
            </div>
            <Button variant="success" size="lg" fullWidth onClick={onConfirm}>
              ✓ Confirm This Report
            </Button>
          </div>
        )}
      </div>

    </div>
  );
};

export default DisasterDetails;
