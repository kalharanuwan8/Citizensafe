import React, { useEffect, useRef, useState } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';

const MapSearchBox = ({ onPlaceSelect }) => {
  const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
  const inputRef = useRef(null);
  const places = useMapsLibrary('places');

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ['geometry', 'name', 'formatted_address'],
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener('place_changed', () => {
      const place = placeAutocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        onPlaceSelect({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        });
      }
    });

  }, [onPlaceSelect, placeAutocomplete]);

  return (
    <div className="absolute top-4 inset-x-4 z-20">
      <div className="relative w-full max-w-sm mx-auto shadow-[0_4px_12px_rgba(0,0,0,0.15)] rounded-2xl">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for a location..."
          className="w-full h-12 pl-10 pr-4 rounded-2xl bg-white/95 backdrop-blur-md 
                     text-[15px] font-medium text-gray-900 placeholder:text-gray-400
                     outline-none border border-black/[.06] focus:border-red-400 
                     focus:ring-2 focus:ring-red-400/20 transition-all duration-200"
        />
      </div>
    </div>
  );
};

export default MapSearchBox;
