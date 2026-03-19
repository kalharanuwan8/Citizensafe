import React from 'react';
import Header from '../components/home/Header';
import RiskIndicator from '../components/home/RiskIndicator';
import NearbyDisastersSection from '../components/home/NearbyDisastersSection';
import RecentDisastersSection from '../components/home/RecentDisastersSection';
import QuickActions from '../components/home/QuickActions';

// ── DesktopLayout ─────────────────────────────────────────────────────────────
// Desktop split view:
//   Left: full-height map
//   Right: fixed sidebar panel with header, risk indicator, disaster lists,
//          quick actions
//
// Props:
//   mapSlot          — React element for the full-screen map area
//   riskLevel        — 'safe' | 'moderate' | 'high'
//   areaName         — e.g. 'Nugegoda, LK'
//   nearbyDisasters  — array of disaster objects
//   recentDisasters  — array of disaster objects
//   onCardClick      — fn(disaster)
//   onConfirm        — fn(disaster)
//   onReport         — fn()
//   onViewAll        — fn()
//   onEmergency      — fn()

const DesktopLayout = ({
  mapSlot,
  riskLevel = 'moderate',
  areaName  = 'Nugegoda, LK',
  nearbyDisasters,
  recentDisasters,
  onCardClick,
  onConfirm,
  onReport,
  onViewAll,
  onEmergency,
}) => (
  <div className="hidden md:flex w-full h-dvh overflow-hidden bg-gray-100">

    {/* ── Left: sidebar panel ─────────────────────────────────────────── */}
    <aside
      className="flex flex-col w-[340px] xl:w-[380px] h-full shrink-0
                 bg-[var(--color-background-primary)]
                 border-r border-black/[.06]
                 shadow-[8px_0_40px_rgba(0,0,0,0.07)]
                 z-10"
    >
      {/* Sidebar header (greeting + actions) */}
      <Header variant="sidebar" />

      {/* Current updates label + live badge */}
      <div className="flex items-center justify-between px-5 pt-3 pb-3
                      border-b border-black/[.06] shrink-0">
        <p className="text-sm font-semibold text-[var(--color-text-primary)]">
          Current Updates
        </p>
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-red-500">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          Live
        </span>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5
                      [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

        {/* Risk indicator */}
        <RiskIndicator level={riskLevel} areaName={areaName} />

        {/* Nearby disasters */}
        <NearbyDisastersSection
          disasters={nearbyDisasters}
          onCardClick={onCardClick}
          onConfirm={onConfirm}
        />

        {/* Recent disasters */}
        <RecentDisastersSection
          disasters={recentDisasters}
          onCardClick={onCardClick}
        />

        {/* Quick actions */}
        <QuickActions
          onReport={onReport}
          onViewAll={onViewAll}
          onEmergency={onEmergency}
        />

        {/* Bottom spacer for scroll breathing room */}
        <div className="h-4" />
      </div>
    </aside>

    {/* ── Right: map fills remaining space ───────────────────────────── */}
    <div className="flex-1 relative">
      {mapSlot}
    </div>

  </div>
);

export default DesktopLayout;
