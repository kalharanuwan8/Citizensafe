import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import socket from '../../services/socket';
import { Bell } from 'lucide-react';

const Header = ({ variant = 'default' }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hasNew, setHasNew] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    socket.on("new-alert", (alert) => {
      setAlerts((prev) => [alert, ...prev].slice(0, 5)); // Keep last 5
      setHasNew(true);
    });

    return () => socket.off("new-alert");
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBellClick = () => {
    setHasNew(false);
    setIsDropdownOpen(!isDropdownOpen);
  };

  const isSidebar    = variant === 'sidebar';
  const isMobileFull = variant === 'mobile-full';

  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || user.email?.[0]?.toUpperCase()
    : '?';

  return (
    <header
      className={[
        'flex items-center justify-between px-4 py-3',
        isMobileFull
          ? 'glass rounded-2xl shadow-[0_4px_24px_rgba(15,23,42,0.10)]'
          : isSidebar
          ? 'bg-transparent border-b border-black/[.05] px-5 py-4'
          : 'bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_2px_16px_rgba(15,23,42,0.08)] border border-white/60',
      ].join(' ')}
    >
      {/* Logo + Name */}
      <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/home')}>
        <img
          src="/logo.png"
          alt="CitizenSafe Logo"
          className="w-8 h-8 object-contain drop-shadow-sm"
          onError={(e) => {
            e.target.onerror = null;
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        {/* Fallback badge */}
        <div
          className="hidden w-9 h-9    rounded-lg bg-red-600 items-center justify-center text-white font-bold text-sm"
          style={{ display: 'none' }}
        >
          CS
        </div>
        <div>
          <span className="text-[15px] font-bold text-gray-900 tracking-tight leading-none">
            CitizenSafe
          </span>
          {isMobileFull && (
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-semibold text-red-500 tracking-wide uppercase">Live</span>
            </div>
          )}
        </div>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-3">
        {user?.role === 'admin' && (
          <button
            onClick={() => navigate('/admin')}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl
                       bg-indigo-50 text-indigo-600 text-[13px] font-semibold
                       hover:bg-indigo-100 transition-colors border border-indigo-100"
          >
            📊 Admin Panel
          </button>
        )}

        {/* Notifications Bell */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={handleBellClick}
            className={`w-9 h-9 rounded-xl flex items-center justify-center
                       ${isDropdownOpen ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-50 text-gray-500'} 
                       hover:bg-gray-100 hover:text-gray-700
                       border border-black/[.03] transition-colors relative`}
            aria-label="Notifications"
          >
            <Bell size={18} />
            {hasNew && (
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
            )}

          </button>

          {/* Alerts Dropdown */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white shadow-xl rounded-2xl border border-black/[.05] z-50 overflow-hidden">
              <div className="p-3 border-b border-black/[.05] flex justify-between items-center bg-gray-50/50">
                <span className="text-[13px] font-bold text-gray-900">Recent Notifications</span>
                <button 
                  onClick={() => { navigate('/alerts'); setIsDropdownOpen(false); }}
                  className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  View All
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {alerts.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-[12px] text-gray-400">No new alerts</p>
                  </div>
                ) : (
                  alerts.map((a, i) => (
                    <div 
                      key={i} 
                      className="p-3 border-b border-black/[.03] hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => { navigate('/alerts'); setIsDropdownOpen(false); }}
                    >
                      <p className="text-[13px] font-semibold text-gray-900 leading-snug">{a.title}</p>
                      <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">{a.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        
        <button
          onClick={() => navigate('/profile')}
          className="relative w-9 h-9 rounded-full overflow-hidden flex items-center justify-center
                     bg-gradient-to-br from-indigo-500 to-purple-600
                     shadow-[0_2px_8px_rgba(99,102,241,0.35)]
                     hover:scale-105 active:scale-95 transition-transform duration-150"
        >
          {user?.profileImage ? (
            <img src={user.profileImage} alt="profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-white font-bold text-[13px]">{initials}</span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
