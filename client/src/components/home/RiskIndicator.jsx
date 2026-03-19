import React from 'react';

const RiskIndicator = ({ level = 'safe', areaName = 'Unknown Area' }) => {
  const isSafe     = level === 'safe';
  const isHigh     = level === 'high';
  const isModerate = !isSafe && !isHigh;

  const palette = isHigh
    ? { bg: 'bg-red-50',    border: 'border-red-100',    accent: 'bg-red-500',    ring: 'bg-red-400/30',    text: 'text-red-700',    label: 'High Risk',     badge: 'bg-red-100 text-red-800 border-red-200' }
    : isSafe
    ? { bg: 'bg-emerald-50',border: 'border-emerald-100',accent: 'bg-emerald-500',ring: 'bg-emerald-400/30',text: 'text-emerald-700',label: 'Low Risk',      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200' }
    : { bg: 'bg-amber-50',  border: 'border-amber-100',  accent: 'bg-amber-500',  ring: 'bg-amber-400/30',  text: 'text-amber-700',  label: 'Moderate Risk', badge: 'bg-amber-100 text-amber-800 border-amber-200' };

  return (
    <div className={`relative overflow-hidden rounded-2xl border ${palette.border} ${palette.bg} p-4 flex items-start gap-3`}>
      {/* Coloured left accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${palette.accent} rounded-l-2xl`} />

      {/* Icon with pulse ring */}
      <div className="relative shrink-0 mt-0.5">
        <div className={`absolute inset-0 rounded-full ${palette.ring} animate-pulse-ring`} />
        <div className={`relative w-9 h-9 rounded-full flex items-center justify-center ${palette.bg} border ${palette.border} shadow-sm`}>
          {/* Shield icon changes based on risk */}
          {isSafe ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={palette.text}>
              <path d="M12 3L4 7v5c0 5 3.5 9.7 8 11 4.5-1.3 8-6 8-11V7l-8-4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : isHigh ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={palette.text}>
              <path d="M12 3L4 7v5c0 5 3.5 9.7 8 11 4.5-1.3 8-6 8-11V7l-8-4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M12 9v4M12 15.5v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={palette.text}>
              <path d="M12 3L4 7v5c0 5 3.5 9.7 8 11 4.5-1.3 8-6 8-11V7l-8-4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M12 9v3M12 14.5v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
        </div>
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0 pl-1">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-black/40 mb-0.5">Area Status</p>
            <h2 className="text-[16px] font-bold text-gray-900 leading-tight truncate">{areaName}</h2>
          </div>
          <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold shadow-sm shrink-0 ${palette.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${palette.accent}`} />
            {palette.label}
          </span>
        </div>
        <p className={`text-[12px] mt-2 font-medium leading-relaxed ${palette.text}`}>
          {isSafe
            ? 'No active emergencies nearby. Stay alert and safe.'
            : isHigh
            ? 'High-risk situation in your area. Follow emergency instructions.'
            : 'Active reports in your vicinity. Please stay cautious.'}
        </p>
      </div>
    </div>
  );
};

export default RiskIndicator;
