import React, { useState } from 'react';
import Button from '../ui/Button';
import Input  from '../ui/Input';
import Card   from '../ui/Card';
import { loginUser } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const EmailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M1 5.5l7 4.5 7-4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const LockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
    <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ErrorBanner = ({ message }) => (
  <div role="alert" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm bg-red-50 border border-red-200 text-red-800">
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="shrink-0">
      <circle cx="7" cy="7" r="6.5" stroke="currentColor"/>
      <path d="M7 4.5v3M7 9.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
    {message}
  </div>
);

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState('');

  const isValid = email.trim() !== '' && password !== '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    setSubmitting(true);
    setError('');
    try {
      const data = await loginUser(email, password);
      login(data.user, data.token);
      
      // Only force redirect if isNewUser is true (first login)
      // and home location is not set yet.
      const hasLocation = data.user.homeLocation?.coordinates?.length > 0;
      
      if (data.user.isNewUser && !hasLocation) {
        navigate('/complete-profile');
      } else {
        navigate('/home');
      }
    } catch (err) {
      setError(err.error || err.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-50 px-4 py-10">

      {/* Background blobs — brand palette */}
      <div className="absolute top-[-60px] -left-16 w-96 h-96 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
      <div className="absolute top-[-40px] -right-16 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-16 left-1/4 w-80 h-80 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000" />

      <div className="animate-slide-up relative z-10 w-full max-w-sm">
        <Card className="border border-white/60 shadow-[0_20px_60px_rgba(15,23,42,0.12)] glass rounded-3xl" padding="p-8">

          {/* Logo */}
          <div className="flex justify-center mb-7 mt-1">
            <img
              src="/logo.png"
              alt="CitizenSafe Logo"
              className="w-[220px] sm:w-[260px] h-auto max-h-28 object-contain drop-shadow-md"
            />
          </div>

          {/* Heading */}
          <div className="mb-5">
            <h1 className="text-[22px] font-bold text-gray-900 leading-tight">Welcome back 👋</h1>
            <p className="text-[13px] text-gray-500 mt-1">Sign in to your CitizenSafe account</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            {error && <ErrorBanner message={error} />}

            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              icon={<EmailIcon />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
            />

            <div className="flex flex-col gap-1.5">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={<LockIcon />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <Link
                to="/forgot-password"
                className="self-end text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Gradient submit button */}
            <button
              type="submit"
              disabled={!isValid || submitting}
              className="mt-1 w-full h-[52px] rounded-xl font-bold text-[15px] text-white
                         bg-gradient-to-r from-red-500 to-rose-600
                         shadow-[0_4px_18px_rgba(225,29,72,0.38)]
                         hover:from-red-600 hover:to-rose-700
                         flex items-center justify-center gap-2
                         active:scale-[0.98] transition-all duration-150
                         disabled:opacity-50 disabled:pointer-events-none"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                <>Sign in <ArrowRight /></>
              )}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-black/[.06]">
            <p className="text-center text-[13px] text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                Create one
              </Link>
            </p>
          </div>

        </Card>
      </div>
    </div>
  );
};

export default LoginForm;