import React, { useState } from 'react';
import Button from '../ui/Button';
import Input  from '../ui/Input';
import Card   from '../ui/Card';
import { loginUser } from '../../services/authService';

// ── Icons ─────────────────────────────────────────────────────────────────────
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

// ── Error banner ───────────────────────────────────────────────────────────────
const ErrorBanner = ({ message }) => (
  <div
    role="alert"
    className="flex items-center gap-2 px-3 py-2.5 rounded-[10px] text-sm
               bg-red-50 border-[.5px] border-red-200 text-red-800"
  >
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="shrink-0">
      <circle cx="7" cy="7" r="6.5" stroke="currentColor"/>
      <path d="M7 4.5v3M7 9.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
    {message}
  </div>
);

// ── LoginForm ──────────────────────────────────────────────────────────────────
const LoginForm = () => {
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
      console.log('Login success', data);
      // Example: window.location.href = '/dashboard';
    } catch (err) {
      // Handles Axios error structure or generic error
      setError(err.response?.data?.message || err.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center
                    bg-(--color-background-tertiary) px-4 py-10">
      <Card className="w-full max-w-sm border-white shadow-2xl" padding="p-7 sm:p-8">

        {/* Logo mark */}
        <div className="w-9 h-9 rounded-[10px] bg-indigo-600 flex items-center justify-center mb-6">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 9a7 7 0 1014 0A7 7 0 002 9z" stroke="#fff" strokeWidth="1.5"/>
            <path d="M9 6v3l2 2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>

        <Card.Header
          title="Welcome back"
          subtitle="Sign in to your account to continue"
        />

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
            
            {/* FIXED: Added missing <a tag here */}
            <a 
              href="/forgot-password"
              className="self-end text-xs font-medium text-indigo-600
                         hover:text-indigo-700 transition-colors"
            >
              Forgot password?
            </a>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={submitting}
            loadingText="Signing in…"
            disabled={!isValid || submitting}
            className="mt-1"
          >
            Sign in
          </Button>

        </form>

        <Card.Divider />

        <p className="text-center text-[13px] text-(--color-text-secondary)">
          Don't have an account?{' '}
          <a href="/register"
             className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
            Create one
          </a>
        </p>

      </Card>
    </div>
  );
};

export default LoginForm;