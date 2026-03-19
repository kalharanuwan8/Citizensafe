import { useState, useEffect } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import DisasterMap   from '../components/map/DisasterMap';
import Header        from '../components/home/Header';
import BottomPanel   from '../components/home/BottomPanel';
import DesktopLayout from '../layouts/DesktopLayout';
import { getNearbyDisasters, getAllDisasters } from '../services/disasterService';
import { useAuth } from '../context/AuthContext';
import Chatbot from '../components/ui/Chatbot';
import useGeolocation from '../hooks/useGeolocation';

const DEFAULT_CENTER = { lat: 6.9271, lng: 79.8612 };

const formatTime = (isoString) => {
  if (!isoString) return '';
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins || 1} min${mins !== 1 ? 's' : ''} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs !== 1 ? 's' : ''} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days !== 1 ? 's' : ''} ago`;
};

const TYPE_LABEL = {
  flood:     'Flash Flood',
  Landslide: 'Landslide',
  Accident:  'Accident',
  Fire:      'Wildfire',
  other:     'Other',
};

const STATUS_MAP = {
  Active: 'Verified',
  Solved: 'Resolved',
  False:  'False',
  Unverified: 'Unverified',
};

const mapDisaster = (d, isHome = false) => ({
  id:           d._id,
  type:         TYPE_LABEL[d.disasterType] ?? d.disasterType,
  location:     'Sri Lanka',           
  distance:     '',
  title:        (TYPE_LABEL[d.disasterType] ?? d.disasterType) + ' Report' + (isHome ? ' (Near Home)' : ''),
  time:         isHome ? 'Home Area' : formatTime(d.createdAt),
  status:       STATUS_MAP[d.status] ?? d.status,
  confirmCount: d.confirmationCount ?? 0,
  isHome
});

const HomePage = () => {
  const { user } = useAuth();
  const [panelState, setPanelState] = useState('half');
  const [isFullMap, setIsFullMap] = useState(false);

  const [disasters, setDisasters] = useState([]);
  const [homeDisasters, setHomeDisasters] = useState([]);
  const [allDisastersList, setAllDisastersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { location: userLocation } = useGeolocation();
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [hasCentered, setHasCentered] = useState(false);

  useEffect(() => {
    if (hasCentered) return;

    if (userLocation) {
      setCenter(userLocation);
      setHasCentered(true);
    } else if (user?.currentLocation?.coordinates?.length >= 2) {
      setCenter({
        lat: user.currentLocation.coordinates[1],
        lng: user.currentLocation.coordinates[0]
      });
      setHasCentered(true);
    } else if (user?.homeLocation?.coordinates?.length >= 2) {
      setCenter({
        lat: user.homeLocation.coordinates[1],
        lng: user.homeLocation.coordinates[0]
      });
      setHasCentered(true);
    }
  }, [userLocation, user, hasCentered]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    
    const fetchAll = async () => {
      try {
        const radius = user?.alertRadius || 5;
        const livePromise = getNearbyDisasters(center.lat, center.lng, radius);
        const homePromise = (user?.homeLocation?.coordinates && user.homeLocation.coordinates.length > 0) 
          ? getNearbyDisasters(null, null, radius, true) // uses server-side homeLocation
          : Promise.resolve([]);
        const allPromise = getAllDisasters();
          
        const [liveData, homeData, allData] = await Promise.all([livePromise, homePromise, allPromise]);
        
        if (!cancelled) {
          setDisasters(liveData);
          setHomeDisasters(homeData);
          setAllDisastersList(allData);
        }
      } catch (err) {
        console.error('Failed to fetch disasters:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAll();
    return () => { cancelled = true; };
  }, [center, user?.homeLocation]);

  const rawMarkers = [
    ...(userLocation || user?.currentLocation?.coordinates ? [{
      id: 'current_loc',
      lat: userLocation ? userLocation.lat : user.currentLocation.coordinates[1],
      lng: userLocation ? userLocation.lng : user.currentLocation.coordinates[0],
      type: 'current_location',
      isHome: false
    }] : []),
    ...(user?.homeLocation?.coordinates?.length >= 2 ? [{
      id: 'home_loc',
      lat: user.homeLocation.coordinates[1],
      lng: user.homeLocation.coordinates[0],
      type: 'home_location',
      isHome: true
    }] : []),
    ...disasters.map(d => ({
      id: d._id,
      lat: d.location?.coordinates[1] || 0,
      lng: d.location?.coordinates[0] || 0,
      type: d.disasterType,
      status: d.status,
      isHome: false
    })),
    ...homeDisasters.map(d => ({
      id: d._id,
      lat: d.location?.coordinates[1] || 0,
      lng: d.location?.coordinates[0] || 0,
      type: d.disasterType,
      status: d.status,
      isHome: true
    }))
  ];

  // Map keyed by id to deduplicate. If duplicate, isHome: true will override if it comes second.
  const mapMarkers = Array.from(new Map(rawMarkers.map(m => [m.id, m])).values());

  const mapSlot = <DisasterMap center={center} markers={mapMarkers} />;

  const mapped = disasters.map(d => mapDisaster(d, false));
  const mappedHome = homeDisasters.map(d => mapDisaster(d, true));
  
  const allMapped = [...mapped, ...mappedHome];
  // Deduplicate
  const uniqueMapped = Array.from(new Map(allMapped.map(d => [d.id, d])).values());

  const now = Date.now();
  const cutoff = 24 * 60 * 60 * 1000;
  const nearby = uniqueMapped.filter(d => d.status !== 'Resolved');
  const recent = uniqueMapped.filter(d => {
    const orig = [...disasters, ...homeDisasters].find(x => x._id === d.id);
    return orig && (now - new Date(orig.createdAt).getTime() < cutoff) && d.status === 'Resolved';
  });

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY}>
      {/* ── Mobile layout (visible below md breakpoint) ─────────────────── */}
      <div className="relative w-full h-dvh overflow-hidden bg-gray-100 md:hidden">

        {/* Full-screen map base layer */}
        <div className="absolute inset-0 z-0">
          {mapSlot}
        </div>

        {/* Floating full-width header with logo (hidden in full map mode) */}
        {!isFullMap && (
          <div className="absolute top-0 inset-x-0 z-10 px-3 pt-3 transition-opacity duration-300">
            <Header variant="mobile-full" />
          </div>
        )}

        {/* Floating Back Button (visible in full map mode) */}
        {isFullMap && (
          <div className="absolute top-0 inset-x-0 z-10 px-4 pb-4 pt-[calc(16px+env(safe-area-inset-top,0px))] transition-opacity duration-300">
            <button
              onClick={() => setIsFullMap(false)}
              className="flex items-center gap-2 px-4 py-3 
                         bg-white shadow-[0_4px_12px_rgba(15,23,42,0.15)]
                         border border-(--color-border-tertiary)
                         rounded-xl text-[14px] font-semibold text-(--color-text-primary)
                         transition-[background,transform] duration-150
                         hover:bg-(--color-background-secondary) active:scale-95"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10.5 3.5L5.5 8.5L10.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to Overview
            </button>
          </div>
        )}

        {/* Sliding bottom sheet */}
        <BottomPanel 
          isOpen={panelState} 
          onStateChange={setPanelState} 
          onEnterFullMap={() => setIsFullMap(true)}
          isHidden={isFullMap}
          disasters={disasters}
          homeDisasters={homeDisasters}
          allSystemDisasters={allDisastersList}
          loading={loading}
        />
      </div>

      {/* ── Desktop layout (visible from md breakpoint up) ──────────────── */}
      <div className="hidden md:block w-full h-dvh">
        <DesktopLayout
          mapSlot={mapSlot}
          riskLevel={nearby.length > 0 ? "moderate" : "safe"}
          areaName="Your area"
          nearbyDisasters={nearby}
          recentDisasters={recent}
        />
      </div>
      <Chatbot />
    </APIProvider>
  );
};

export default HomePage;