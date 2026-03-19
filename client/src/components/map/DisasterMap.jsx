import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import { useEffect } from 'react';
import MapLegend from './MapLegend';

const TYPE_EMOJI = {
  'flood': '🌊',
  'Landslide': '⛰️',
  'Accident': '🚨',
  'Fire': '🔥',
  'earthquake': '🌍',
  'tsunami': '🌊',
  'power_outage': '⚡',
  'other': '⚠️',
};

const BORDER_COLORS = {
  'Active': 'border-red-500',
  'Verified': 'border-red-500',
  'Unverified': 'border-amber-500',
  'Solved': 'border-emerald-500',
  'Resolved': 'border-emerald-500',
};

const RING_COLORS = {
  'Active': 'bg-red-500/40',
  'Verified': 'bg-red-500/40',
  'Unverified': 'bg-amber-500/40',
  'Solved': 'bg-emerald-500/40',
  'Resolved': 'bg-emerald-500/40',
};

const MapController = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (map && center) {
      map.panTo(center);
    }
  }, [map, center]);
  return null;
};

const DisasterMap = ({ hideLegend = false, center, markers = [], onCenterChange }) => {

  return (
    <div className="relative h-full w-full overflow-hidden bg-gray-200">
      <Map
        defaultZoom={13}
        defaultCenter={center}
        onCenterChanged={e => onCenterChange && onCenterChange(e.detail.center)}
        mapId={import.meta.env.VITE_GOOGLE_MAP_ID || "DEMO_MAP_ID"}
        disableDefaultUI={true}
        gestureHandling="greedy"
      >
        <MapController center={center} />
        {markers.map((m, i) => {
          if (m.type === 'current_location') {
            return (
              <AdvancedMarker key={m.id || i} position={{ lat: m.lat, lng: m.lng }}>
                <div className="relative group flex items-center justify-center pointer-events-none">
                  <div className="absolute w-8 h-8 rounded-full bg-blue-500/40 animate-ping" />
                  <div className="relative z-10 w-4 h-4 bg-blue-500 border-[3px] border-white rounded-full shadow-md" />
                </div>
              </AdvancedMarker>
            );
          }
          if (m.type === 'home_location') {
            return (
              <AdvancedMarker key={m.id || i} position={{ lat: m.lat, lng: m.lng }}>
                <div className="relative group text-lg bg-white rounded-full p-1.5 border-2 border-indigo-500 shadow-xl scale-110 pointer-events-none flex items-center justify-center">
                  🏠
                </div>
              </AdvancedMarker>
            );
          }

          const ringClass = RING_COLORS[m.status] || 'bg-red-500/40';
          const borderClass = BORDER_COLORS[m.status] || 'border-red-500';

          return (
            <AdvancedMarker key={m.id || i} position={{ lat: m.lat, lng: m.lng }}>
                <div className="relative group">
                  {/* Pulsing ring for all disasters */}
                  <div className={`absolute inset-0 rounded-full animate-pulse-ring scale-150 ${ringClass}`} />
                  
                  <div className={`relative z-10 text-xl drop-shadow-md bg-white rounded-full p-1.5 leading-none shadow-xl border-2 scale-110 active:scale-125 transition-transform duration-150 ${borderClass}`}>
                    {TYPE_EMOJI[m.type] || '🚨'}
                  </div>
                </div>
            </AdvancedMarker>
          );
        })}
      </Map>

      {!hideLegend && (
        <div className="absolute bottom-36 right-4 md:bottom-6 z-20 pointer-events-none">
          <MapLegend className="pointer-events-auto" />
        </div>
      )}
    </div>
  );
};

export default DisasterMap;
