import React, { useState } from 'react';
import Button from '../ui/Button';
import Input  from '../ui/Input';
import Card   from '../ui/Card';
import { registerUser } from '../../services/authService';
import { Link, useNavigate } from 'react-router-dom';

// ── Icons ──────────────────────────────────────────────────────────────────────
const UserIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

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
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
      <circle cx="7" cy="7" r="6.5" stroke="currentColor"/>
      <path d="M7 4.5v3M7 9.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
    {message}
  </div>
);

const SuccessBanner = ({ message }) => (
  <div role="alert" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm bg-emerald-50 border border-emerald-200 text-emerald-800">
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
      <circle cx="7" cy="7" r="6.5" stroke="currentColor"/>
      <path d="M4.5 7.5L6.5 9.5L9.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    {message}
  </div>
);

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState('');
  const [success,    setSuccess]    = useState('');

  const isValid = firstName.trim() !== '' && email.trim() !== '' && password !== '' && confirmPassword !== '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await registerUser(firstName, lastName, email, password);
      setSuccess('Account created! Redirecting to sign in…');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.error || err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-50 px-4 py-10">

      {/* Background blobs */}
      <div className="absolute top-[-60px] -left-16 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-45 animate-blob" />
      <div className="absolute top-[-40px] -right-16 w-80 h-80 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-45 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-16 left-1/4 w-80 h-80 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-55 animate-blob animation-delay-4000" />

      <div className="animate-slide-up relative z-10 w-full max-w-sm">
        <Card className="border border-white/60 shadow-[0_20px_60px_rgba(15,23,42,0.12)] glass rounded-3xl" padding="p-8">

          {/* Logo */}
          <div className="flex justify-center mb-6 mt-1">
            <img
              src="/logo.png"
              alt="CitizenSafe Logo"
              className="w-[200px] h-auto max-h-24 object-contain drop-shadow-md"
            />
          </div>

          {/* Heading */}
          <div className="mb-5">
            <h1 className="text-[22px] font-bold text-gray-900 leading-tight">Create account ✨</h1>
            <p className="text-[13px] text-gray-500 mt-1">Join CitizenSafe and stay protected</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5">
            {error   && <ErrorBanner   message={error} />}
            {success && <SuccessBanner message={success} />}

            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="First Name"
                type="text"
                placeholder="Dhammika"
                icon={<UserIcon />}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoComplete="given-name"
                autoFocus
              />
              <Input
                label="Last Name"
                type="text"
                placeholder="Perera"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                autoComplete="family-name"
              />
            </div>

            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              icon={<EmailIcon />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••  (min 6 chars)"
              icon={<LockIcon />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              icon={<LockIcon />}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />

            {/* Gradient submit button */}
            <button
              type="submit"
              disabled={!isValid || submitting}
              className="mt-1 w-full h-[52px] rounded-xl font-bold text-[15px] text-white
                         bg-gradient-to-r from-indigo-500 to-purple-600
                         shadow-[0_4px_18px_rgba(99,102,241,0.38)]
                         hover:from-indigo-600 hover:to-purple-700
                         flex items-center justify-center gap-2
                         active:scale-[0.98] transition-all duration-150
                         disabled:opacity-50 disabled:pointer-events-none"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Creating account…
                </>
              ) : (
                <>Create account <ArrowRight /></>
              )}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-black/[.06]">
            <p className="text-center text-[13px] text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-red-600 hover:text-red-700 transition-colors">
                Sign in
              </Link>
            </p>
          </div>

        </Card>
      </div>
    </div>
  );
};

export default RegistrationForm;