import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../services/authService';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';

const EmailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M1 5.5l7 4.5 7-4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const ArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const data = await forgotPassword(email);
      setStatus('success');
      setMessage(data.message || 'Reset link sent to your email.');
    } catch (err) {
      setStatus('error');
      setMessage(err.error || err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-50 px-4 py-10">
      {/* Background blobs */}
      <div className="absolute top-[-60px] -left-16 w-96 h-96 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
      <div className="absolute top-[-40px] -right-16 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />
      
      <div className="animate-slide-up relative z-10 w-full max-w-sm">
        <Card className="border border-white/60 shadow-[0_20px_60px_rgba(15,23,42,0.12)] glass rounded-3xl" padding="p-8">
          <div className="flex justify-center mb-7 mt-1">
            <img src="/logo.png" alt="CitizenSafe Logo" className="w-[200px] h-auto object-contain drop-shadow-md" />
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Forgot Password?</h1>
            <p className="text-sm text-gray-500 mt-2">Enter your email and we'll send you a link to reset your password.</p>
          </div>

          {status === 'success' ? (
            <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl text-sm mb-6">
              {message}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {status === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-xl text-xs flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="6.5" stroke="currentColor"/>
                    <path d="M7 4.5v3M7 9.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                  {message}
                </div>
              )}

              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                icon={<EmailIcon />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
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
                    Sending link...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          )}

          <div className="mt-8 pt-5 border-t border-black/[.06] flex justify-center">
            <Link to="/login" className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
              <ArrowLeft /> Back to login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
