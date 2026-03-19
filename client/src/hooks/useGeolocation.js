import { useState, useEffect } from 'react';

/**
 * Custom hook to get and watch user's geolocation.
 * @param {Object} options - PositionOptions for getCurrentPosition and watchPosition
 * @returns {Object} { location: { lat, lng }, error, loading }
 */
const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    const handleSuccess = (position) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      setLoading(false);
      setError(null);
    };

    const handleError = (error) => {
      setError(error.message);
      setLoading(false);
    };

    // Get initial position
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options);

    // Optional: watch position if needed, but for centering we might just need the first one or a manual refresh.
    // Fixed requirements say "the map center should be the current location", 
    // implying it might need to follow the user or just start there.
    // Usually starting there and allowing manual override is better for UX.
    
  }, []);

  return { location, error, loading };
};

export default useGeolocation;
