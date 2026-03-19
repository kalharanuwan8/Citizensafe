import React from 'react';
import { useNavigate } from 'react-router-dom';

const TILES = [
  {
    id: 'report',
    label: 'Report',
    route: '/report',
    bg: 'bg-red-500',
    shadow: 'shadow-[0_4px_14px_rgba(225,29,72,0.35)]',
    hoverBg: 'hover:bg-red-600',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
  {
    id: 'alerts',
    label: 'Alerts',
    route: '/alerts',
    bg: 'bg-indigo-500',
    shadow: 'shadow-[0_4px_14px_rgba(99,102,241,0.30)]',
    hoverBg: 'hover:bg-indigo-600',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 01-3.46 0"/>
      </svg>
    ),
  },
  {
    id: 'contacts',
    label: 'SOS',
    route: '/contacts',
    bg: 'bg-emerald-500',
    shadow: 'shadow-[0_4px_14px_rgba(16,185,129,0.30)]',
    hoverBg: 'hover:bg-emerald-600',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
      </svg>
    ),
  },
];

const QuickActions = ({ onReport, onViewAll, onEmergency }) => {
  const navigate = useNavigate();

  const handlers = {
    report:   () => (onReport   ? onReport()   : navigate('/report')),
    alerts:   () => (onViewAll  ? onViewAll()  : navigate('/alerts')),
    contacts: () => (onEmergency? onEmergency(): navigate('/contacts')),
  };

  return (
    <div className="space-y-2.5">
      <p className="text-[11px] font-bold tracking-widest uppercase text-gray-400 px-1">Quick Actions</p>
      <div className="grid grid-cols-3 gap-2.5">
        {TILES.map((tile) => (
          <button
            key={tile.id}
            onClick={handlers[tile.id]}
            className={`flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-2xl
                       ${tile.bg} ${tile.hoverBg} ${tile.shadow}
                       active:scale-[0.94] transition-all duration-150`}
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              {tile.icon}
            </div>
            <span className="text-[12px] font-bold text-white tracking-wide">{tile.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
