// DesktopPanel.jsx
import React from 'react';

const AlertIcon = () => (
  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
    <path d="M7 1L13 13H1L7 1Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    <path d="M7 6v3M7 10.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

const FloodIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M2 10c1.5-1.5 3.5-1.5 5 0s3.5 1.5 5 0" stroke="#1d4ed8" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M2 12.5c1.5-1.5 3.5-1.5 5 0s3.5 1.5 5 0" stroke="#1d4ed8" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M5 7.5V3l3-1.5L11 3v4.5" stroke="#1d4ed8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LandslideIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M1 13L5 6l3 3 2.5-4L14 13H1Z" stroke="#c2410c" strokeWidth="1.4" strokeLinejoin="round"/>
  </svg>
);

const PowerIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M9 2L5 9h5l-3 5 6-7H8l1-5Z" stroke="#047857" strokeWidth="1.4" strokeLinejoin="round"/>
  </svg>
);

const DISASTER_ICONS = {
  flood:    { icon: <FloodIcon />,     bg: 'bg-blue-100' },
  landslide:{ icon: <LandslideIcon />, bg: 'bg-orange-100' },
  power:    { icon: <PowerIcon />,     bg: 'bg-emerald-100' },
};

const STATUS_STYLES = {
  Verified:   'bg-blue-100 text-blue-800',
  Unverified: 'bg-amber-100 text-amber-800',
  Resolved:   'bg-emerald-100 text-emerald-800',
};
const DisasterCard = ({ type, iconKey, distance, time, status }) => {
  const { icon, bg } = DISASTER_ICONS[iconKey] ?? DISASTER_ICONS.flood;

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-black/[.06]
                    hover:border-black/[.12] hover:bg-gray-50 cursor-pointer
                    transition-colors duration-150">

      {/* Icon cell */}
      <div className={`w-[34px] h-[34px] rounded-lg flex items-center
                       justify-center shrink-0 ${bg}`}>
        {icon}
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <p className="text-[13.5px] font-semibold text-gray-900
                      truncate leading-snug">
          {type}
        </p>
        <p className="text-[11.5px] text-gray-400 mt-0.5">
          {distance} away · {time}
        </p>
      </div>

      {/* Status badge */}
      <span className={`text-[10px] font-semibold px-2 py-0.5
                        rounded-full shrink-0 mt-0.5 self-start
                        ${STATUS_STYLES[status] ?? STATUS_STYLES.Unverified}`}>
        {status}
      </span>

    </div>
  );
};
const MapPlaceholder = () => (
  <div className="flex-1 relative overflow-hidden bg-[#dde8d4] min-h-[400px]">

    {/* Grid overlay */}
    <div className="absolute inset-0"
         style={{
           backgroundImage: `
             linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px),
             linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)
           `,
           backgroundSize: '36px 36px',
         }}
    />

    {/* Road lines */}
    <svg className="absolute inset-0 w-full h-full"
         viewBox="0 0 100 100"
         preserveAspectRatio="xMidYMid slice">
      <path d="M10 30 Q30 20 50 35 T90 25"
            stroke="rgba(255,255,255,0.55)" strokeWidth="2.5" fill="none"/>
      <path d="M15 60 Q40 50 60 65 T95 58"
            stroke="rgba(255,255,255,0.45)" strokeWidth="2" fill="none"/>
      <path d="M35 5 Q40 40 38 95"
            stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none"/>
      <path d="M65 0 Q68 45 62 100"
            stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" fill="none"/>
      <path d="M0 48 Q50 44 100 50"
            stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none"/>
      <rect x="40" y="38" width="18" height="12" rx="2" fill="rgba(255,255,255,0.18)"/>
      <rect x="20" y="62" width="12" height="8"  rx="2" fill="rgba(255,255,255,0.15)"/>
      <rect x="68" y="28" width="14" height="9"  rx="2" fill="rgba(255,255,255,0.15)"/>
    </svg>

    {/* Pins */}
    <MapPin color="#2b6cb0" pulseColor="rgba(43,108,176,0.3)"  style={{ top:'38%', left:'42%' }} />
    <MapPin color="#c05621" pulseColor="rgba(192,86,33,0.3)"   style={{ top:'54%', left:'63%' }} />
    <MapPin color="#276749" pulseColor="rgba(39,103,73,0.2)"   style={{ top:'26%', left:'28%' }} pulse={false} />

    {/* Location label */}
    <div className="absolute bottom-5 left-5 text-[11px] font-medium
                    tracking-widest uppercase text-black/40
                    bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full">
      Nugegoda, LK
    </div>

  </div>
);
const MapPin = ({ color, pulseColor, style, pulse = true }) => (
  <div className="absolute flex flex-col items-center" style={style}>
    {pulse && (
      <span className="absolute -top-[7px] -left-[7px] w-6 h-6 rounded-full animate-ping"
            style={{ background: pulseColor }} />
    )}
    <span className="w-2.5 h-2.5 rounded-full border-2 border-white shadow-md"
          style={{ background: color }} />
  </div>
);
const DesktopPanel = () => {
  return (
    <div className="flex overflow-hidden rounded-xl border border-black/[.06]
                    min-h-[580px] bg-gray-100">

      {/* ── Left: Map ── */}
      <MapPlaceholder />

      {/* ── Right: Sidebar ── */}
      <div className="w-[320px] min-w-[300px] flex flex-col
                      bg-white border-l border-black/[.06]">

        {/* Title bar */}
        <div className="flex items-center justify-between px-5 pt-4 pb-0">
          <p className="text-[11px] font-semibold tracking-widest
                        uppercase text-gray-400">
            Current Updates
          </p>
          <span className="flex items-center gap-1.5 text-[11px]
                           font-medium text-red-600">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
            Live
          </span>
        </div>

        {/* Area header */}
        <div className="px-5 pt-4 pb-4 border-b border-black/[.06]">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="text-[10px] font-semibold tracking-widest
                             uppercase text-gray-400 mb-1">
                Area Status
              </p>
              <h2 className="text-[17px] font-semibold text-gray-900 leading-tight">
                Nugegoda, LK
              </h2>
            </div>
            {/* Badge */}
            <span className="flex items-center gap-1.5 text-[11px] font-semibold
                             bg-amber-100 text-amber-800 px-2.5 py-1
                             rounded-full mt-1 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Medium Risk
            </span>
          </div>
          <p className="text-[12.5px] text-gray-500 leading-relaxed">
            <span className="text-amber-700 font-semibold">2 reports</span>
            {' '}within 3 km of your location.
          </p>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5
                        [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

          {/* Nearby section */}
          <section className="space-y-2">
            <h3 className="text-[10px] font-semibold tracking-widest
                            uppercase text-gray-400">
              Nearby
            </h3>
            <DisasterCard
              type="Flash Flood"
              iconKey="flood"
              distance="1.2 km"
              time="20 mins ago"
              status="Verified"
            />
            <DisasterCard
              type="Landslide"
              iconKey="landslide"
              distance="2.5 km"
              time="1 hour ago"
              status="Unverified"
            />
          </section>

          {/* Recent section */}
          <section className="space-y-2">
            <h3 className="text-[10px] font-semibold tracking-widest
                            uppercase text-gray-400">
              Recent · 24h
            </h3>
            <DisasterCard
              type="Power Outage"
              iconKey="power"
              distance="4.0 km"
              time="12 hours ago"
              status="Resolved"
            />
          </section>

        </div>

        {/* Footer actions */}
        <div className="px-5 pb-5 pt-3 border-t border-black/[.06] flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-2
                             h-[38px] rounded-lg bg-red-600 hover:bg-red-700
                             text-white text-[13px] font-semibold
                             transition-colors duration-150 active:scale-[.97]">
            <AlertIcon />
            Report Disaster
          </button>
          <button className="px-4 h-[38px] rounded-lg border border-black/[.10]
                             bg-gray-50 hover:bg-gray-100 text-gray-800
                             text-[13px] font-semibold
                             transition-colors duration-150 active:scale-[.97]">
            Map View
          </button>
        </div>

      </div>
    </div>
  );
};

export default DesktopPanel;