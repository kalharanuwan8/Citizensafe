import React, { useState, useEffect } from 'react';
import Header        from '../components/home/Header';
import { useNavigate } from 'react-router-dom';
import { getAlerts } from '../services/alertService';

const TYPE_LABEL = {
  flood:     'Flash Flood',
  Landslide: 'Landslide',
  Accident:  'Accident',
  Fire:      'Wildfire',
  other:     'Other',
};

const STATUS_SEVERITY = {
  Active: 'High',
  False:  'Medium',
  Solved: 'Low',
};

const severityDot = {
  High:   'bg-red-500',
  Medium: 'bg-orange-500',
  Low:    'bg-blue-500',
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

import socket from '../services/socket';

const AlertsPage = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    getAlerts()
      .then(data => setAlerts(data))
      .catch(err => console.error('Failed to fetch alerts:', err))
      .finally(() => setLoading(false));

    // Socket listener
    socket.on("new-alert", (newAlert) => {
      setAlerts((prev) => [newAlert, ...prev]);
    });

    return () => {
      socket.off("new-alert");
    };
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-background-tertiary)] flex flex-col">
      {/* Header */}
      <div className="shrink-0 bg-white border-b border-black/[.06] shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <div className="max-w-2xl mx-auto px-4">
          <Header variant="sidebar" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-5">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors w-fit">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10.5 3.5L5.5 8.5L10.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>
        <div>
          <h1 className="text-[20px] font-bold text-[var(--color-text-primary)] leading-tight">
            Recent Alerts
          </h1>
          <p className="text-[13px] text-[var(--color-text-secondary)] mt-1">
            Stay updated with the latest notifications in your area.
          </p>
        </div>

        {/* Alert List */}
        <div className="space-y-4">
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="animate-pulse bg-white rounded-xl border border-black/[.05] shadow-sm h-20" />
            ))
          ) : alerts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[14px] text-gray-500">No alerts at this time.</p>
            </div>
          ) : (
            alerts.map((alert) => {
              const severity = alert.severity === 'high' ? 'High' : alert.severity === 'medium' ? 'Medium' : 'Low';
              return (
                <div
                  key={alert._id}
                  className="p-4 rounded-xl border border-black/[.05] shadow-sm bg-white cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 shrink-0">
                      <div className={`w-3 h-3 rounded-full ${severityDot[severity]}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="text-[15px] font-semibold text-gray-900 leading-tight">
                          {alert.title}
                        </h2>
                        <span className="text-[11px] font-medium text-gray-500 whitespace-nowrap">
                          {formatTime(alert.createdAt)}
                        </span>
                      </div>
                      <p className="mt-1 text-[13px] text-gray-600 leading-relaxed line-clamp-2">
                        {alert.message}
                      </p>
                      <span className={`inline-block mt-1 text-[11px] font-semibold ${
                        severity === 'High' ? 'text-red-600' :
                        severity === 'Low' ? 'text-green-600' : 'text-orange-500'
                      }`}>
                        {severity} Severity
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;
