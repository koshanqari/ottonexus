'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BuildingOfficeIcon, UserIcon, CogIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const [email, setEmail] = useState('koshan.qari@kotak.com');
  const [corporateEmail, setCorporateEmail] = useState('admin@kotak.com');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginType, setLoginType] = useState<'guest' | 'corporate'>('guest');
  const router = useRouter();

  const handleGuestLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email })
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/guests/${data.guest_id}`);
      } else {
        setError('User not found. Please check your email.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCorporateLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/corporate-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: corporateEmail })
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/corporate/${data.company_id}`);
      } else {
        setError('Company not found. Please check the email address.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1220] flex items-center justify-center px-4">
      {/* Organizer Button - Top Left */}
      <button
        onClick={() => router.push('/organizer-login')}
        className="absolute top-6 left-6 bg-[#D4AF37] text-[#0B1220] px-4 py-2 rounded-lg font-semibold hover:bg-[#B8941F] transition-colors flex items-center gap-2"
      >
        <CogIcon className="w-4 h-4" />
        Organizer Panel
      </button>

      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#D4AF37] mb-2">Golden Lotus</h1>
          <p className="text-[#F8F9FA] text-lg">OttoNexus EMS - Alpha prototype</p>
        </div>

        {/* Login Type Toggle */}
        <div className="flex bg-[#1a2332] rounded-lg p-1 mb-6">
          <button
            onClick={() => setLoginType('guest')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium transition-colors ${
              loginType === 'guest'
                ? 'bg-[#D4AF37] text-[#0B1220]'
                : 'text-[#ADB5BD] hover:text-[#F8F9FA]'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            Guest Login
          </button>
          <button
            onClick={() => setLoginType('corporate')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium transition-colors ${
              loginType === 'corporate'
                ? 'bg-[#D4AF37] text-[#0B1220]'
                : 'text-[#ADB5BD] hover:text-[#F8F9FA]'
            }`}
          >
            <BuildingOfficeIcon className="w-4 h-4" />
            Corporate Login
          </button>
        </div>

        <div className="bg-[#1a2332] rounded-lg p-8 shadow-xl">
          <h2 className="text-2xl font-semibold text-[#F8F9FA] mb-6 text-center">
            {loginType === 'guest' ? 'Guest Login' : 'Corporate Login'}
          </h2>

          {loginType === 'guest' ? (
            <form onSubmit={handleGuestLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#ADB5BD] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0B1220] border border-[#6C757D] rounded-lg text-[#F8F9FA] focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37] focus:outline-none transition-colors"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              {error && (
                <div className="text-red-400 text-sm text-center">{error}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#D4AF37] text-[#0B1220] font-semibold py-3 px-4 rounded-lg hover:bg-[#B8941F] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-[#0B1220] transition-colors disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>

              <div className="mt-6">
                <p className="text-[#ADB5BD] text-sm text-center mb-3">Quick Login:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    type="button"
                    onClick={() => setEmail('koshan.qari@kotak.com')}
                    className="px-3 py-1 bg-[#6C757D] text-[#F8F9FA] text-xs rounded hover:bg-[#5A6268] transition-colors"
                  >
                    Koshan Qari
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmail('rahul.sharma@kotak.com')}
                    className="px-3 py-1 bg-[#6C757D] text-[#F8F9FA] text-xs rounded hover:bg-[#5A6268] transition-colors"
                  >
                    Rahul Sharma
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmail('priya.patel@kotak.com')}
                    className="px-3 py-1 bg-[#6C757D] text-[#F8F9FA] text-xs rounded hover:bg-[#5A6268] transition-colors"
                  >
                    Priya Patel
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleCorporateLogin} className="space-y-6">
              <div>
                <label htmlFor="corporateEmail" className="block text-sm font-medium text-[#ADB5BD] mb-2">
                  Admin Email
                </label>
                <input
                  type="email"
                  id="corporateEmail"
                  value={corporateEmail}
                  onChange={(e) => setCorporateEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0B1220] border border-[#6C757D] rounded-lg text-[#F8F9FA] focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37] focus:outline-none transition-colors"
                  placeholder="Enter admin email"
                  required
                />
              </div>

              {error && (
                <div className="text-red-400 text-sm text-center">{error}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#D4AF37] text-[#0B1220] font-semibold py-3 px-4 rounded-lg hover:bg-[#B8941F] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-[#0B1220] transition-colors disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>

              <div className="mt-6">
                <p className="text-[#ADB5BD] text-sm text-center mb-3">Quick Login:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    type="button"
                    onClick={() => setCorporateEmail('admin@kotak.com')}
                    className="px-3 py-1 bg-[#D4AF37] text-[#0B1220] text-xs rounded hover:bg-[#B8941F] transition-colors font-semibold"
                  >
                    Kotak Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => setCorporateEmail('admin@icici.com')}
                    className="px-3 py-1 bg-[#6C757D] text-[#F8F9FA] text-xs rounded hover:bg-[#5A6268] transition-colors"
                  >
                    ICICI Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => setCorporateEmail('admin@hdfc.com')}
                    className="px-3 py-1 bg-[#6C757D] text-[#F8F9FA] text-xs rounded hover:bg-[#5A6268] transition-colors"
                  >
                    HDFC Admin
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}