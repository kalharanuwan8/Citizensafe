import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header          from '../components/home/Header';
import DisasterDetails  from '../components/disaster/DisasterDetails';
import { getDisasterById, confirmDisaster } from '../services/disasterService';
import { uploadImage } from '../services/uploadService';

import { useAuth } from '../context/AuthContext';

// Map backend enum → UI display type
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

const DisasterDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [disaster, setDisaster] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [confirmImage, setConfirmImage] = useState(null);

  useEffect(() => {
    if (!id) return;
    getDisasterById(id)
      .then(data => {
        if (!data) { setError('Disaster not found.'); return; }
        setDisaster({
          type:        data.disasterType,
          typeLabel:   TYPE_LABEL[data.disasterType] ?? data.disasterType,
          title:       (TYPE_LABEL[data.disasterType] ?? data.disasterType) + ' Report',
          status:      STATUS_MAP[data.status] ?? data.status,
          distance:    '',
          time:        formatTime(data.createdAt),
          location:    data.location?.coordinates
            ? `${data.location.coordinates[1].toFixed(4)}°N, ${data.location.coordinates[0].toFixed(4)}°E`
            : 'Sri Lanka',
          description: data.description,
          reportedBy:  data.reportedBy?.email ?? 'Anonymous',
          isReporter:  String(data.reportedBy?._id || data.reportedBy) === String(user?._id),
          image:       data.image,
          affectedZones: [],
          emergencyContacts: [
            { label: 'Emergency Hotline', number: '1926' },
            { label: 'Police',            number: '119'  },
            { label: 'Fire & Rescue',     number: '110'  },
          ],
        });
      })
      .catch(() => setError('Failed to load disaster details.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await confirmDisaster(id, null);
      alert("Disaster confirmed successfully");
      navigate('/home');
    } catch (err) {
      setError(err.error || err.message || "Failed to confirm request");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background-tertiary)] flex flex-col">

      {/* ── Top bar (desktop only) */}
      <div className="hidden md:block shrink-0 bg-white
                      border-b border-black/[.06]
                      shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <div className="max-w-2xl mx-auto px-4">
          <Header variant="sidebar" />
        </div>
      </div>

      {/* ── Main content */}
      <div className="flex-1 w-full md:max-w-2xl md:mx-auto md:px-4 md:py-6">

        <div
          className="bg-white md:rounded-2xl md:shadow-lg
                     md:border md:border-black/[.05]
                     overflow-hidden
                     min-h-screen md:min-h-0"
        >
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-slate-300 border-t-indigo-500 rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3 px-6 text-center">
              <p className="text-[15px] font-semibold text-red-600">{error}</p>
              <button
                onClick={() => navigate(-1)}
                className="text-sm text-indigo-600 font-medium hover:underline"
              >
                Go Back
              </button>
            </div>
          ) : (
            <DisasterDetails
              disaster={disaster}
              onBack={() => navigate('/home')}
              onConfirm={handleConfirm}
              onImageSelect={setConfirmImage}
            />
          )}
        </div>

      </div>
    </div>
  );
};

export default DisasterDetailsPage;
