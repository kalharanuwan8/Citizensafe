import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DisasterCard from '../disaster/DisasterCard';

// Snap states → height of scrollable content area
const SNAP = {
  peek: 'h-[100px]',
  half: 'h-[30dvh]',
  full: 'h-[calc(75dvh-150px)]',
};

const MapIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
    <line x1="9" y1="3" x2="9" y2="18"/>
    <line x1="15" y1="6" x2="15" y2="21"/>
  </svg>
);

const FILTERS = ['All', 'Verified', 'Unverified'];

const BottomPanel = ({ isOpen, onStateChange, onEnterFullMap, isHidden, disasters = [], homeDisasters = [], allSystemDisasters = [], loading }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');

  if (isHidden) return null;

  const snap = isOpen === 'full' ? 'full' : isOpen === 'half' ? 'half' : 'peek';

  const allDisasters = [
    ...disasters.map(d => ({ ...d, isHome: false })),
    ...homeDisasters.map(d => ({ ...d, isHome: true }))
  ];

  // Remove duplicates if any (e.g. if home is current location)
  const uniqueDisasters = Array.from(new Map(allDisasters.map(d => [d._id, d])).values());

  const filtered = !uniqueDisasters ? [] : filter === 'All'
    ? uniqueDisasters
    : uniqueDisasters.filter(d => {
        const s = (d.status || '').toLowerCase();
        if (filter === 'Verified')   return s === 'verified' || s === 'active';
        if (filter === 'Unverified') return s === 'unverified' || s === 'false';
        return true;
      });

  const otherDisasters = (allSystemDisasters || []).filter(d => !uniqueDisasters.some(ud => ud._id === d._id));

  const hasNearby = filtered && filtered.length > 0;
  const showOther = filter === 'All' && otherDisasters.length > 0;
  const isEmpty = !hasNearby && !showOther;

  return (
    <div
      className={`absolute bottom-0 inset-x-0 bg-white rounded-t-[28px]
                  shadow-[0_-8px_40px_rgba(0,0,0,0.12)]
                  transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] z-20
                  ${isOpen === 'closed' ? 'translate-y-full' : 'translate-y-0'}`}
    >
      {/* ── Drag handle ──────────────────────────────────────────────── */}
      <div
        className="relative w-full h-[36px] flex items-center justify-center cursor-pointer active:bg-gray-50/80 rounded-t-[28px] text-gray-400 hover:text-gray-600 transition-colors"
        onClick={() => onStateChange(snap === 'peek' ? 'half' : snap === 'half' ? 'full' : 'half')}
      >
        {/* Left Arrow */}
        <div className="absolute left-6">
          {snap === 'full' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          ) : snap === 'peek' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          ) : (
            <div className="flex flex-col items-center -space-y-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          )}
        </div>

        {/* Center Dash */}
        <div className={`h-1 rounded-full bg-gray-300 transition-all duration-300 ${snap === 'peek' ? 'w-16' : 'w-10'}`} />

        {/* Right Arrow */}
        <div className="absolute right-6">
          {snap === 'full' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          ) : snap === 'peek' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          ) : (
            <div className="flex flex-col items-center -space-y-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* ── Header row ───────────────────────────────────────────────── */}
      <div className="px-5 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-[17px] font-bold text-gray-900 leading-tight">Nearby Alerts</h2>
          {!loading && (
            <p className="text-[12px] text-gray-400 mt-0.5">
              {filtered.length} incident{filtered.length !== 1 ? 's' : ''} in your area
            </p>
          )}
        </div>
      </div>

      {/* ── Filter pills ──────────────────────────────────────────────── */}
      {snap !== 'peek' && (
        <div className="px-5 pb-3 flex gap-2">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1 rounded-full text-[12px] font-semibold transition-all duration-150 active:scale-95
                          ${filter === f
                            ? 'bg-gray-900 text-white shadow-sm'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      {/* ── Scrollable disaster list ─────────────────────────────────── */}
      <div className={`px-5 overflow-y-auto transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${SNAP[snap]}`}
           style={{ scrollbarWidth: 'none' }}>
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="w-8 h-8 rounded-full border-[3px] border-gray-100 border-t-red-500 animate-spin" />
          </div>
        ) : isEmpty ? (
          <div className="text-center py-8 px-4 rounded-2xl bg-gray-50 border border-dashed border-gray-200 mx-1">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-emerald-500" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 3L4 7v5c0 5 3.5 9.7 8 11 4.5-1.3 8-6 8-11V7l-8-4z" strokeLinejoin="round"/>
                <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="text-[14px] font-bold text-gray-900">All clear!</p>
            <p className="text-[12px] text-gray-400 mt-1">No {filter !== 'All' ? filter.toLowerCase() + ' ' : ''}reports found.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5 pb-4">
            {hasNearby && filtered.map(d => (
              <DisasterCard
                key={d._id || d.id}
                type={d.disasterType || d.type}
                title={(d.title || d.disasterType || d.type) + (d.isHome ? ' (Near Home)' : '')}
                distance={d.distance || ''}
                time={d.isHome ? 'Home Area' : d.time}
                status={d.status}
                onClick={() => navigate(`/disaster/${d._id || d.id}`)}
                showConfirm={d.status === 'Unverified'}
              />
            ))}

            {showOther && (
              <>
                <div className="mt-4 mb-2 flex items-center gap-2">
                  <div className="h-px bg-gray-200 flex-1"></div>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">All Disasters</span>
                  <div className="h-px bg-gray-200 flex-1"></div>
                </div>
                {otherDisasters.map(d => (
                  <DisasterCard
                    key={d._id || d.id}
                    type={d.disasterType || d.type}
                    title={(d.disasterType || d.type) + ' Report'}
                    distance=""
                    time="Global"
                    status={d.status}
                    onClick={() => navigate(`/disaster/${d._id || d.id}`)}
                    showConfirm={d.status === 'Unverified'}
                  />
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* ── CTA footer ───────────────────────────────────────────────── */}
      <div className="px-4 pt-3 pb-[env(safe-area-inset-bottom,16px)] border-t border-gray-100 bg-white flex gap-2">
        <button
          onClick={onEnterFullMap}
          className="flex-1 flex justify-center items-center gap-2 py-4
                     bg-gray-100 text-gray-700 rounded-2xl font-bold text-[15px]
                     border border-gray-200 hover:bg-gray-200
                     active:scale-[0.98] transition-all duration-150"
        >
          <MapIcon />
          View Map
        </button>
        <button
          onClick={() => navigate('/report')}
          className="flex-[2] flex justify-center items-center gap-2 py-4
                     bg-gradient-to-r from-red-500 to-rose-600
                     text-white rounded-2xl font-bold text-[15px]
                     shadow-[0_4px_18px_rgba(225,29,72,0.38)]
                     hover:from-red-600 hover:to-rose-700
                     active:scale-[0.98] transition-all duration-150
                     animate-intense-pulse"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          Report Emergency
        </button>
      </div>
    </div>
  );
};

export default BottomPanel;
