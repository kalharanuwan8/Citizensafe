import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile } from '../services/userService';
import MapSearchBox from '../components/map/MapSearchBox';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const CompleteProfilePage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [alertRadius, setAlertRadius] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Default to a central point in Sri Lanka if no geolocation
  const [mapCenter, setMapCenter] = useState({ lat: 6.9271, lng: 79.8612 });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setMapCenter(coords);
          setLocation(coords);
        },
        (err) => console.log('Geolocation error:', err)
      );
    }
  }, []);

  const handlePlaceSelect = (place) => {
    setMapCenter(place);
    setLocation(place);
  };

  const handleSubmit = async () => {
    if (!location) {
      setError('Please select your home location on the map');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const updatedUser = await updateUserProfile({
        homeLocation: {
          type: 'Point',
          coordinates: [location.lng, location.lat]
        },
        alertRadius: alertRadius
      });
      updateUser(updatedUser);
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY}>
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl animate-slide-up">
          <Card className="glass shadow-2xl rounded-3xl overflow-hidden border border-white/60" padding="p-0">
            <div className="p-8 pb-4">
              <h1 className="text-2xl font-bold text-gray-900">Welcome to CitizenSafe! 🏠</h1>
              <p className="text-gray-500 mt-2 text-sm">
                To provide you with accurate alerts, please set your home location. 
                We'll monitor disasters near both your home and your current live location.
              </p>
            </div>

            {error && (
              <div className="mx-8 mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            <div className="relative h-[400px] w-full bg-gray-100 border-y border-gray-100">
              <MapSearchBox onPlaceSelect={handlePlaceSelect} />
              
              <Map
                defaultZoom={13}
                center={mapCenter}
                onCenterChanged={(e) => setMapCenter(e.detail.center)}
                mapId="DEMO_MAP_ID"
                disableDefaultUI={true}
                onClick={(e) => setLocation(e.detail.latLng)}
              >
                {location && (
                  <AdvancedMarker position={location}>
                    <div className="text-2xl drop-shadow-lg">🏠</div>
                  </AdvancedMarker>
                )}
              </Map>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-black/5 text-[12px] font-semibold text-gray-600 z-10 pointer-events-none">
                Tap the map to set your home marker
              </div>
            </div>

            <div className="p-8 pt-6 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-800">Alert Radius</label>
                  <span className="text-[13px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                    {alertRadius} km
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  How far from your locations should we monitor for disasters? (Recommended: 5-10 km)
                </p>
                <input 
                  type="range" 
                  min="5" 
                  max="20" 
                  step="1"
                  value={alertRadius}
                  onChange={(e) => setAlertRadius(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <span>5 km</span>
                  <span>10 km</span>
                  <span>15 km</span>
                  <span>20 km</span>
                </div>
              </div>
              <Button 
                onClick={handleSubmit} 
                disabled={!location || submitting}
                loading={submitting}
                fullWidth
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-xl shadow-indigo-200"
              >
                Set Home Location & Continue
              </Button>
              
              <button 
                onClick={() => navigate('/home')}
                className="text-gray-400 text-xs font-medium hover:text-gray-600 transition-colors"
                disabled={submitting}
              >
                Skip for now (Some features will be limited)
              </button>
            </div>
          </Card>
        </div>
      </div>
    </APIProvider>
  );
};

export default CompleteProfilePage;
