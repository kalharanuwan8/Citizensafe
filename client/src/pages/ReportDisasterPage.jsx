import React, { useState, useRef } from 'react';
import Header      from '../components/home/Header';
import DisasterMap  from '../components/map/DisasterMap';
import MapSearchBox from '../components/map/MapSearchBox';
import { useNavigate } from 'react-router-dom';
import { APIProvider } from '@vis.gl/react-google-maps';
import { createDisaster, DISASTER_TYPES } from '../services/disasterService';
import { uploadImage } from '../services/uploadService';
import useGeolocation from '../hooks/useGeolocation';

// ── Icon helpers ───────────────────────────────────────────────────────────────
const LocationPin = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 1.5C5.51 1.5 3.5 3.51 3.5 6c0 3.35 4.5 8.5 4.5 8.5S12.5 9.35 12.5 6c0-2.49-2.01-4.5-4.5-4.5Z"
          stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    <circle cx="8" cy="6" r="1.75" stroke="currentColor" strokeWidth="1.3"/>
  </svg>
);

const CameraIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.4"/>
    <circle cx="8" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M5.5 4l1-2h3l1 2" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
  </svg>
);

const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M10.5 3.5L5.5 8.5L10.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Disaster type emoji map
const TYPE_EMOJI = {
  flood: '🌊', Landslide: '⛰️', Accident: '🚨', Fire: '🔥', 
  earthquake: '🌍', power_outage: '⚡', other: '⚠️',
  hurricane: '🌀', tsunami: '🌊',
};

const DISASTER_CONFIG = {
  'flood':         { bg: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)', text: '🌊 FLASH FLOOD DETECTED!', color: 'text-blue-600', animation: 'animate-pulse' },
  'Landslide':     { bg: 'linear-gradient(135deg, #d97706 0%, #92400e 100%)', text: '⛰️ LANDSLIDE RISK DETECTED!', color: 'text-amber-700', animation: 'animate-shake' },
  'Fire':          { bg: 'linear-gradient(135deg, #f97316 0%, #dc2626 100%)', text: '🔥 FIRE EMERGENCY DETECTED!', color: 'text-red-600', animation: 'animate-heat' },
  'earthquake':    { bg: 'linear-gradient(135deg, #ef4444 0%, #7f1d1d 100%)', text: '🌍 EARTHQUAKE DETECTED!', color: 'text-red-700', animation: 'animate-shake' },
  'Accident':      { bg: 'linear-gradient(135deg, #a855f7 0%, #6b21a8 100%)', text: '🚨 CRITICAL ACCIDENT REPORTED!', color: 'text-purple-700', animation: 'animate-intense-pulse' },
  'tsunami':       { bg: 'linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%)', text: '🌊 TSUNAMI WARNING!', color: 'text-blue-800', animation: 'animate-pulse' },
};


// ── Step Progress Bar ──────────────────────────────────────────────────────────
const StepBar = ({ current }) => (
  <div className="flex items-center gap-0 mb-2">
    {[1, 2].map((s, i) => (
      <React.Fragment key={s}>
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold
                           transition-all duration-300
                           ${current >= s
                              ? 'bg-red-500 text-white shadow-[0_2px_8px_rgba(225,29,72,0.35)]'
                              : 'bg-gray-200 text-gray-400'}`}>
            {current > s ? (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : s}
          </div>
          <span className={`text-[12px] font-semibold ${current >= s ? 'text-gray-800' : 'text-gray-400'}`}>
            {s === 1 ? 'Location' : 'Details'}
          </span>
        </div>
        {i === 0 && (
          <div className="flex-1 mx-3 h-px bg-gray-200 relative">
            <div
              className="absolute inset-y-0 left-0 bg-red-400 rounded transition-all duration-500"
              style={{ width: current > 1 ? '100%' : '0%' }}
            />
          </div>
        )}
      </React.Fragment>
    ))}
  </div>
);

// ── Default map center (Colombo) ───────────────────────────────────────────────
const DEFAULT_CENTER = { lat: 6.9271, lng: 79.8612 };

const ReportDisasterPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('map');

  const { location: userLocation } = useGeolocation();
  const [coords, setCoords] = useState(DEFAULT_CENTER);
  const [hasSetInitialLocation, setHasSetInitialLocation] = useState(false);

  const [selectedType, setSelectedType] = useState('');
  const [description, setDescription]   = useState('');
  const [submitting, setSubmitting]      = useState(false);
  const [error, setError]                = useState('');
  const [imageFile, setImageFile]        = useState(null);
  const [successData, setSuccessData]    = useState(null); // { message, points }
  const fileInputRef                     = useRef(null);

  // Auto-pin to user location when first detected
  React.useEffect(() => {
    if (userLocation && !hasSetInitialLocation) {
      setCoords(userLocation);
      setHasSetInitialLocation(true);
    }
  }, [userLocation, hasSetInitialLocation]);

  const currentStep = step === 'map' ? 1 : 2;

  const handleConfirmLocation = () => setStep('form');

  const handleSubmit = async () => {
    console.log('[ReportDisasterPage] handleSubmit triggered');
    console.log('[ReportDisasterPage] State:', { selectedType, description, coords, imageFile });

    if (!selectedType)       { 
      console.warn('[ReportDisasterPage] Validation failed: Missing disaster type');
      setError('Please select a disaster type.');     
      return; 
    }
    if (!description.trim()) { 
      console.warn('[ReportDisasterPage] Validation failed: Missing description');
      setError('Please describe what you observed.'); 
      return; 
    }

    setSubmitting(true);
    setError('');
    try {
      let uploadedImage;
      if (imageFile) {
        console.log('[ReportDisasterPage] Uploading image...', imageFile.name);
        uploadedImage = await uploadImage(imageFile);
        console.log('[ReportDisasterPage] Image upload successful:', uploadedImage);
      } else {
        console.log('[ReportDisasterPage] No image file selected. Proceeding without image.');
      }

      const payload = {
        disasterType: selectedType,
        description:  description.trim(),
        location: { type: 'Point', coordinates: [coords.lng, coords.lat] },
        image: uploadedImage,
      };
      
      console.log('[ReportDisasterPage] Sending payload to createDisaster API:', payload);
      const response = await createDisaster(payload);
      console.log('[ReportDisasterPage] createDisaster API response:', response);

      setSuccessData({
        message: response.message || 'Disaster Reported successfully!',
        points: response.pointsAwarded || 0,
      });

      // Redirect after a short delay so they can see the points
      setTimeout(() => navigate('/home'), 5000);
    } catch (err) {
      console.error('[ReportDisasterPage] Error caught in handleSubmit:', err);
      setError(err.error || err.message || 'Failed to submit report. Please try again.');
    } finally {
      console.log('[ReportDisasterPage] handleSubmit finished, turning off submitting state.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background-tertiary)] flex flex-col">

      {/* ── Top header ────────────────────────────────────────────────────── */}
      <div className="shrink-0 bg-white border-b border-black/[.06] shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <div className="max-w-2xl mx-auto px-4">
          <Header variant="sidebar" />
        </div>
      </div>

      {/* ── Page body ─────────────────────────────────────────────────────── */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-5 space-y-5">

        {/* Back + step progress */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => step === 'form' ? setStep('map') : navigate(-1)}
            className="flex items-center gap-1 text-[13px] font-semibold text-gray-500 hover:text-gray-900 transition-colors shrink-0"
          >
            <BackIcon /> Back
          </button>
          <div className="flex-1">
            <StepBar current={currentStep} />
          </div>
        </div>

        {/* Page title */}
        <div>
          <h1 className="text-[20px] font-bold text-gray-900 leading-tight">
            {currentStep === 1 ? '📍 Select Location' : '📋 Incident Details'}
          </h1>
          <p className="text-[13px] text-gray-400 mt-0.5">
            {currentStep === 1
              ? 'Drag the map to pin the exact incident location'
              : 'Provide key details so responders can act quickly'}
          </p>
        </div>

        {/* ── Step 1: Map ───────────────────────────────────────────────── */}
        {step === 'map' && (
          <section className="flex flex-col h-[60vh]">
            <div className="relative flex-1 rounded-2xl overflow-hidden shadow-md border border-black/[.05]">
              
              <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY}>
                <MapSearchBox onPlaceSelect={(location) => setCoords(location)} />
                <DisasterMap hideLegend={true} center={coords} onCenterChange={setCoords} />
              </APIProvider>

              {/* Centre pin */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center pb-8">
                <div className="relative">
                  <div className="absolute -inset-2 rounded-full bg-red-500/20 animate-pulse-ring" />
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="#e11d48" className="drop-shadow-md">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
              </div>

              {/* Confirm button overlay */}
              <div className="absolute bottom-4 inset-x-4 flex justify-center pointer-events-none">
                <button
                  type="button"
                  onClick={handleConfirmLocation}
                  className="w-full max-w-sm h-[52px] rounded-xl text-[15px] font-bold
                             bg-gradient-to-r from-red-500 to-rose-600
                             text-white pointer-events-auto
                             shadow-[0_4px_18px_rgba(225,29,72,0.38)]
                             hover:from-red-600 hover:to-rose-700
                             flex items-center justify-center gap-2
                             transition-all duration-150 active:scale-95"
                >
                  <LocationPin />
                  Confirm Location
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="text-gray-400"><LocationPin /></span>
              <p className="text-[12px] text-gray-400">Drag map to place the pin on the exact location</p>
            </div>
          </section>
        )}

        {/* ── Step 2: Form ──────────────────────────────────────────────── */}
        {step === 'form' && (
          <section className="bg-white rounded-2xl shadow-sm border border-black/[.05] p-5 space-y-5 animate-slide-up">

            {/* Selected location recap */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                  <LocationPin />
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 font-medium">Selected Location</p>
                  <p className="text-[13px] font-semibold text-gray-800">
                    {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setStep('map')}
                className="px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-white border border-gray-200 shadow-sm text-gray-600 hover:text-red-600 transition-colors"
              >
                Change
              </button>
            </div>

            {/* Error banner */}
            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm bg-red-50 border border-red-200 text-red-800">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                  <circle cx="7" cy="7" r="6.5" stroke="currentColor"/>
                  <path d="M7 4.5v3M7 9.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
                {error}
              </div>
            )}

            {/* Disaster type */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-semibold text-gray-800">Disaster Type</label>
              
              {selectedType && DISASTER_CONFIG[selectedType] && (
                <div className={`mb-2 px-4 py-3 rounded-2xl bg-white border-2 border-dashed flex items-center gap-3 ${DISASTER_CONFIG[selectedType].color} border-current animate-shake shadow-lg transition-all`}>
                   <span className="text-xl">{DISASTER_CONFIG[selectedType].text.split(' ')[0]}</span>
                   <span className="font-black text-[14px] uppercase tracking-tighter">{DISASTER_CONFIG[selectedType].text}</span>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {DISASTER_TYPES.map(({ label, value }, idx) => {
                  const isActive = selectedType === value;
                  const config = DISASTER_CONFIG[value];
                  return (
                    <button
                      key={`${value}-${idx}`}
                      type="button"
                      onClick={() => setSelectedType(value)}
                      className={`px-4 py-2.5 rounded-xl text-[13px] font-bold border
                                  transition-all duration-200 active:scale-90
                                  ${isActive
                                     ? 'text-white shadow-xl scale-105 border-transparent ' + (config?.animation || '')
                                     : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-400 hover:bg-gray-100'}`}
                      style={isActive ? { background: config?.bg || '#ef4444' } : {}}
                    >
                      {TYPE_EMOJI[value] || '⚠️'} {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-semibold text-gray-800">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe what you observed… (e.g. road blocked, water level rising)"
                rows={4}
                className="w-full px-3.5 py-3 rounded-xl text-[13.5px]
                           bg-gray-50 border border-gray-200 text-gray-900
                           placeholder:text-gray-400 resize-none outline-none
                           focus:ring-2 focus:ring-red-400/30 focus:border-red-300
                           transition-shadow duration-150"
              />
            </div>

            {/* Photo upload */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-semibold text-gray-800 flex items-center gap-1.5">
                <CameraIcon /> Attach Photos <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => setImageFile(e.target.files[0])}
                className="hidden"
              />
              {imageFile ? (
                <div className="relative w-full h-28 rounded-2xl overflow-hidden border border-gray-200">
                  <img src={URL.createObjectURL(imageFile)} alt="preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImageFile(null)}
                    className="absolute top-2 right-2 w-7 h-7 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M2 2l8 8M10 2l-8 8"/>
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-24 rounded-2xl border-2 border-dashed border-gray-300
                             hover:border-red-400 hover:bg-red-50
                             flex flex-col items-center justify-center gap-2
                             text-gray-400 hover:text-red-500
                             transition-all duration-200 cursor-pointer active:scale-[0.98]"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                    <CameraIcon />
                  </div>
                  <span className="text-[12.5px] font-medium">Tap to upload a photo</span>
                </button>
              )}
            </div>

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full h-[54px] rounded-xl text-[15px] font-bold text-white
                         bg-gradient-to-r from-red-500 to-rose-600
                         shadow-[0_4px_18px_rgba(225,29,72,0.38)]
                         hover:from-red-600 hover:to-rose-700
                         flex items-center justify-center gap-2
                         transition-all duration-150 active:scale-[0.98]
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Submitting…
                </>
              ) : '🚨 Submit Report'}
            </button>
          </section>
        )}

        <div className="h-4" />
      </div>

      {/* ── Success Overlay ─────────────────────────────────────────────────── */}
      {successData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-[32px] w-full max-w-sm p-8 text-center shadow-2xl shadow-indigo-200/50 border border-white animate-scale-up">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-emerald-50/50">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <path d="M22 4L12 14.01l-3-3" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Great Work!</h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              Your report has been submitted successfully. Our team will verify it shortly.
            </p>

            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 mb-8 relative overflow-hidden group">
              {/* Decorative logo in background */}
              <img src="/logo.png" className="absolute -right-4 -bottom-4 w-24 h-24 opacity-5 grayscale rotate-12 transition-transform group-hover:scale-110" alt="" />
              
              <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-[0.2em] mb-1">Impact Points Earned</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-4xl font-black text-indigo-600">+{successData.points}</span>
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[13px] font-bold text-indigo-600">CITIZEN</span>
                  <span className="text-[13px] font-bold text-indigo-400">POINTS</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/home')}
              className="w-full py-4 rounded-2xl bg-gray-900 text-white font-bold text-[15px] hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-gray-200"
            >
              Done
            </button>
            <p className="text-[11px] text-gray-400 mt-4">Redirecting to home in 5 seconds...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportDisasterPage;
