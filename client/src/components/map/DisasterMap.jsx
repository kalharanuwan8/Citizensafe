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
        {markers.map((m, i) => (
          <AdvancedMarker key={m.id || i} position={{ lat: m.lat, lng: m.lng }}>
              <div className="relative group">
                {/* Pulsing ring for all disasters */}
                <div className="absolute inset-0 rounded-full bg-red-500/40 animate-pulse-ring scale-150" />
                
                <div className="relative z-10 text-xl drop-shadow-md bg-white rounded-full p-1.5 leading-none shadow-xl border-2 border-red-500 scale-110 active:scale-125 transition-transform duration-150">
                  {TYPE_EMOJI[m.type] || '🚨'}
                </div>
              </div>
          </AdvancedMarker>
        ))}
 Broadway: ... // Ensuring no syntax errors here
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
