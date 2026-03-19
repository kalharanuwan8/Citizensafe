import React from 'react';
import BottomPanel from '../components/home/BottomPanel';

// ── MobileLayout ───────────────────────────────────────────────────────────────
// Full-screen container for the mobile experience:
//   - Map fills the entire background
//   - Full-width floating header with logo sits at the top
//   - BottomPanel slides in from the bottom
//
// Props:
//   mapSlot    — React element rendered as the full-screen base map
//   headerSlot — React element for the floating top bar
//   panelState — 'collapsed' | 'half' | 'full'
//   onPanelStateChange — fn(state)
//   children   — extra overlays rendered above the map

const MobileLayout = ({
  mapSlot,
  headerSlot,
  panelState = 'half',
  onPanelStateChange,
  children,
}) => (
  <div className="relative w-full h-dvh overflow-hidden bg-gray-100 md:hidden">

    {/* ── Map base layer ────────────────────────────────────────────── */}
    <div className="absolute inset-0 z-0">
      {mapSlot}
    </div>

    {/* ── Full-width floating header ───────────────────────────────── */}
    {headerSlot && (
      <div className="absolute top-0 inset-x-0 z-10 px-3 pt-3">
        {headerSlot}
      </div>
    )}

    {/* ── Extra overlay slots (e.g. MapLegend) ────────────────────── */}
    {children}

    {/* ── Sliding bottom sheet ─────────────────────────────────────── */}
    <BottomPanel isOpen={panelState} onStateChange={onPanelStateChange} />

  </div>
);

export default MobileLayout;
