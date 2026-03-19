import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateUserProfile } from '../services/userService';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import MapSearchBox from '../components/map/MapSearchBox';
import Input from '../components/ui/Input';
import { uploadImage } from '../services/uploadService';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import ConfirmationModal from '../components/ui/ConfirmationModal';

const BackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M11.5 4.5L6.5 9.5L11.5 14.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CameraIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);

const STAT_ITEMS = (user) => [
  {
    label: 'Reports', value: user.reportCount ?? 0,
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
    </svg>,
    bg: 'bg-red-50', color: 'text-red-600',
  },
  {
    label: 'Points', value: user.points ?? 0,
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>,
    bg: 'bg-amber-50', color: 'text-amber-600',
  },
];

const INFO_ROWS = (user) => [
  {
    label: 'Email', value: user.email,
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M1 5.5l7 4.5 7-4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  },
  {
    label: 'Role', value: (user.role ?? 'user').charAt(0).toUpperCase() + (user.role ?? 'user').slice(1),
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.3"/><path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  },
  {
    label: 'Member since', value: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Unknown',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="2" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M1 6h14M5 1v2M11 1v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  },
  {
    label: 'Alert Radius', value: `${user.alertRadius || 5} km`,
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/><path d="M8 8l2-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  },
];

const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user: authUser, logout, updateUser } = useAuth();
  const [user, setUser] = React.useState(authUser);
  const [uploading, setUploading] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    homeLocation: user?.homeLocation || null,
    alertRadius: user?.alertRadius || 5,
  });
  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);

  React.useEffect(() => {
    getUserProfile()
      .then(data => setUser(data))
      .catch(console.error);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const uploadedData = await uploadImage(file, 'profiles');
      const updatedUser  = await updateUserProfile({ profileImage: uploadedData.url });
      setUser(updatedUser);
    } catch (err) {
      console.error('Failed to upload profile picture', err);
      alert('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };
  const handleUpdateProfile = async () => {
    try {
      setUploading(true);
      const updatedUser = await updateUserProfile(formData);
      setUser(updatedUser);
      updateUser(updatedUser);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile', err);
      alert('Failed to update profile');
    } finally {
      setUploading(false);
    }
  };

  const handleHomeLocationSelect = (place) => {
    setFormData({
      ...formData,
      homeLocation: {
        type: 'Point',
        coordinates: [place.lng, place.lat]
      }
    });
  };

  if (!user) return null;

  const displayName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email;
  const initials    = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col">
      <div className="max-w-lg mx-auto w-full flex flex-col flex-1">

        {/* ── Hero strip ──────────────────────────────────────────── */}
        <div className="relative bg-gradient-to-br from-slate-800 via-slate-700 to-red-700 px-5 pt-12 pb-20 overflow-hidden">
          {/* Abstract circles */}
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-red-500/20" />

          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-[13px] font-semibold text-white/80 hover:text-white transition-colors mb-8"
          >
            <BackIcon /> Back
          </button>

          <h1 className="text-[22px] font-bold text-white leading-tight">My Profile</h1>
          <p className="text-[13px] text-white/60 mt-1">Manage your account and settings</p>
        </div>

        {/* ── Floating avatar ──────────────────────────────────────── */}
        <div className="relative -mt-12 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-white shadow-xl
                            bg-gradient-to-br from-indigo-400 to-purple-500
                            flex items-center justify-center group">
              {user.profileImage ? (
                <img src={user.profileImage} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-bold text-3xl">{initials}</span>
              )}
              {/* Upload overlay */}
              <label className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center cursor-pointer text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                {uploading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : <CameraIcon />}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
              </label>
            </div>
            {/* Verified checkmark */}
            {user.verifiedBadge && (
              <div className="absolute bottom-0.5 right-0.5 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center ring-2 ring-white">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* ── Name + Badge ─────────────────────────────────────────── */}
        <div className="text-center mt-3 mb-2 px-4">
          <h2 className="text-[20px] font-bold text-gray-900">{displayName}</h2>
          <p className="text-[13px] text-gray-500">{user.email}</p>
          <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
            {user.verifiedBadge
              ? <Badge variant="success" dot>Verified User</Badge>
              : <Badge variant="warning">Unverified</Badge>}
            {user.role === 'admin' && <Badge variant="danger">Admin</Badge>}
          </div>
        </div>

        {/* ── Stat grid ────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3 mx-5 mb-4">
          {STAT_ITEMS(user).map(({ label, value, icon, bg, color }) => (
            <div key={label} className="bg-white rounded-2xl p-4 border border-black/[.05] shadow-sm flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bg} ${color}`}>
                {icon}
              </div>
              <div>
                <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">{label}</p>
                <p className="text-[18px] font-bold text-gray-900 leading-tight">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Info rows ─────────────────────────────────────────────── */}
        <div className="mx-5 mb-4 bg-white rounded-2xl border border-black/[.05] shadow-sm overflow-hidden">
          {INFO_ROWS(user).map(({ label, value, icon }, idx, arr) => (
            <div
              key={label}
              className={`flex items-center gap-3 px-4 py-3.5
                          ${idx < arr.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                {icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-gray-400 font-medium">{label}</p>
                <p className="text-[13.5px] font-semibold text-gray-800 truncate">{value}</p>
              </div>
              <ChevronRight />
            </div>
          ))}
        </div>

        {/* ── Action buttons ────────────────────────────────────────── */}
        <div className="mx-5 mb-8 space-y-2.5">
          {isEditing ? (
            <>
              <div className="bg-white p-6 rounded-2xl border border-black/[.05] shadow-sm space-y-4 mb-4">
                <h3 className="font-bold text-gray-800 mb-2">Personal Details</h3>
                <Input 
                  label="First Name" 
                  value={formData.firstName} 
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})} 
                />
                <Input 
                  label="Last Name" 
                  value={formData.lastName} 
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
                />
                
                <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-gray-700">Alert Radius (km)</label>
                  <p className="text-[11px] text-gray-400">Receive alerts within this distance from your locations (5 - 20 km).</p>
                  <div className="flex items-center gap-4">
                    <input 
                      type="range" 
                      min="5" 
                      max="20" 
                      step="1"
                      value={formData.alertRadius}
                      onChange={(e) => setFormData({...formData, alertRadius: parseInt(e.target.value)})}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                    />
                    <span className="w-12 text-center text-[14px] font-bold text-gray-800 bg-gray-50 py-1.5 rounded-lg border border-gray-100">
                      {formData.alertRadius}
                    </span>
                  </div>
                </div>
                
                <h3 className="font-bold text-gray-800 mt-4 mb-2">Home Location</h3>
                <div className="relative h-[250px] w-full bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                  <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY}>
                    <MapSearchBox onPlaceSelect={handleHomeLocationSelect} />
                    <Map
                      defaultZoom={12}
                      center={formData.homeLocation ? { lat: formData.homeLocation.coordinates[1], lng: formData.homeLocation.coordinates[0] } : { lat: 6.9271, lng: 79.8612 }}
                      mapId="DEMO_MAP_ID"
                      disableDefaultUI={true}
                      onClick={(e) => handleHomeLocationSelect({ lat: e.detail.latLng.lat, lng: e.detail.latLng.lng })}
                    >
                      {formData.homeLocation && (
                        <AdvancedMarker position={{ lat: formData.homeLocation.coordinates[1], lng: formData.homeLocation.coordinates[0] }}>
                          <div className="text-xl">🏠</div>
                        </AdvancedMarker>
                      )}
                    </Map>
                  </APIProvider>
                </div>
              </div>
              <Button onClick={handleUpdateProfile} loading={uploading} fullWidth size="lg">Save Changes</Button>
              <Button variant="secondary" onClick={() => setIsEditing(false)} fullWidth size="lg">Cancel</Button>
            </>
          ) : (
            <>
              <Button variant="secondary" size="lg" fullWidth onClick={() => {
                setFormData({
                  firstName: user.firstName,
                  lastName: user.lastName,
                  homeLocation: user.homeLocation,
                  alertRadius: user.alertRadius || 5
                });
                setIsEditing(true);
              }}>Edit Profile</Button>
              <Button variant="secondary" size="lg" fullWidth>Change Password</Button>
              <Button variant="danger" size="lg" fullWidth onClick={() => setIsLogoutModalOpen(true)}>Log Out</Button>

              <ConfirmationModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleLogout}
                title="Log Out?"
                message="Are you sure you want to log out of CitizenSafe? You will need to login again to access your reports and alerts."
                confirmText="Log Out"
                cancelText="Stay Logged In"
                variant="danger"
              />
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
