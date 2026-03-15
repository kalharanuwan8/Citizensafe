import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

const DisasterMap = () => {
  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY}>
      <div className="h-125 w-full rounded-2xl overflow-hidden shadow-lg">
        <Map
          defaultCenter={{ lat: 6.9271, lng: 79.8612 }} // Colombo
          defaultZoom={13}
          mapId={import.meta.env.VITE_GOOGLE_MAP_ID} // 👈 ESSENTIAL for Advanced Markers
          gestureHandling={'greedy'}
          disableDefaultUI={false}
        >
          {/* This is the modern replacement for google.maps.Marker */}
          <AdvancedMarker position={{ lat: 6.9271, lng: 79.8612 }}>
            <Pin background={'#4f46e5'} glyphColor={'#ffffff'} borderColor={'#3730a3'} />
          </AdvancedMarker>
        </Map>
      </div>
    </APIProvider>
  );
};
export default DisasterMap