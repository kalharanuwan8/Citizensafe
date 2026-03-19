import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/authService';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';

const LockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
    <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const CheckCircle = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-green-500 mb-4 mx-auto">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) return;

    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setStatus('error');
      setMessage('Password must be at least 6 characters long.');
      return;
    }

    setStatus('loading');
    try {
      await resetPassword(token, password);
      setStatus('success');
      setMessage('Your password has been reset successfully.');
      
      // We can also auto-redirect after a few seconds
      setTimeout(() => navigate('/login'), 3000);
      
    } catch (err) {
      setStatus('error');
      setMessage(err.error || err.message || 'Failed to reset password. The link might be expired.');
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-50 px-4 py-10">
      {/* Background blobs */}
      <div className="absolute top-[-60px] -left-16 w-96 h-96 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
      <div className="absolute top-[-40px] -right-16 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-16 left-1/4 w-80 h-80 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000" />
      
      <div className="animate-slide-up relative z-10 w-full max-w-sm">
        <Card className="border border-white/60 shadow-[0_20px_60px_rgba(15,23,42,0.12)] glass rounded-3xl" padding="p-8">
          <div className="flex justify-center mb-7 mt-1">
            <img src="/logo.png" alt="CitizenSafe Logo" className="w-[200px] h-auto object-contain drop-shadow-md" />
          </div>

          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
            <p className="text-sm text-gray-500 mt-2">Enter your new password below to regain access to your account.</p>
          </div>

          {status === 'success' ? (
            <div className="text-center">
              <CheckCircle />
              <h2 className="text-lg font-bold text-gray-900 mb-2">Success!</h2>
              <p className="text-sm text-gray-600 mb-6">{message}</p>
              <Link 
                to="/login"
                className="inline-flex w-full h-[52px] rounded-xl font-bold text-[15px] text-white
                           bg-gradient-to-r from-red-500 to-rose-600 shadow-[0_4px_18px_rgba(225,29,72,0.38)]
                           hover:from-red-600 hover:to-rose-700 items-center justify-center
                           active:scale-[0.98] transition-all duration-150"
              >
                Go to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {status === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-xl text-xs flex items-start gap-2">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 mt-0.5">
                    <circle cx="7" cy="7" r="6.5" stroke="currentColor"/>
                    <path d="M7 4.5v3M7 9.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                  <span>{message}</span>
                </div>
              )}

              <Input
                label="New Password"
                type="password"
                placeholder="••••••••"
                icon={<LockIcon />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
                autoComplete="new-password"
              />

              <Input
                label="Confirm New Password"
                type="password"
                placeholder="••••••••"
                icon={<LockIcon />}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />

              <button
                type="submit"
                disabled={status === 'loading'}
                className="mt-2 w-full h-[52px] rounded-xl font-bold text-[15px] text-white
                           bg-gradient-to-r from-red-500 to-rose-600
                           shadow-[0_4px_18px_rgba(225,29,72,0.38)]
                           hover:from-red-600 hover:to-rose-700
                           flex items-center justify-center gap-2
                           active:scale-[0.98] transition-all duration-150
                           disabled:opacity-50 disabled:pointer-events-none"
              >
                {status === 'loading' ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Resetting...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
