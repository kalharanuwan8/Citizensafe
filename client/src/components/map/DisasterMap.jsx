import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import MapLegend from './MapLegend';

const TYPE_EMOJI = {
  'flood': '🌊',
  'Landslide': '⛰️',
  'Accident': '🚨',
  'Fire': '🔥',
  'earthquake': '🌍',
  'tsunami': '🌊',
  'other': '⚠️',
};


const DisasterMap = ({ hideLegend = false, center, markers = [], onCenterChange }) => {
  const mapCenter = center;

  return (
    <div className="relative h-full w-full overflow-hidden bg-gray-200">
      <Map
        defaultZoom={13}
        center={mapCenter}
        onCenterChanged={e => onCenterChange && onCenterChange(e.detail.center)}
        mapId={import.meta.env.VITE_GOOGLE_MAP_ID || "DEMO_MAP_ID"}
        disableDefaultUI={true}
      >
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

          return (
            <AdvancedMarker key={m.id || i} position={{ lat: m.lat, lng: m.lng }}>
                <div className="relative group">
                  {/* Pulsing ring for all disasters */}
                  <div className="absolute inset-0 rounded-full bg-red-500/40 animate-pulse-ring scale-150" />
                  
                  <div className="relative z-10 text-xl drop-shadow-md bg-white rounded-full p-1.5 leading-none shadow-xl border-2 border-red-500 scale-110 active:scale-125 transition-transform duration-150">
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
