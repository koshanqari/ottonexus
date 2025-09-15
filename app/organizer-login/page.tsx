'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CogIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function OrganizerLogin() {
  const [email, setEmail] = useState('admin@goldenlotus.com');
  const [password, setPassword] = useState('organizer123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/organizer-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        // Store organizer session (in production, use proper session management)
        localStorage.setItem('organizer_authenticated', 'true');
        localStorage.setItem('organizer_email', data.organizer.email);
        router.push('/organiser');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Login failed');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1220] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <CogIcon className="w-12 h-12 text-[#D4AF37]" />
          </div>
          <h1 className="text-3xl font-bold text-[#D4AF37] mb-2">Organizer Login</h1>
          <p className="text-[#F8F9FA] text-lg">Golden Lotus Event Management</p>
        </div>

        <div className="bg-[#1a2332] rounded-lg p-8 shadow-xl">
          <form onSubmit={handleLogin} className="space-y-6">
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
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#ADB5BD] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-[#0B1220] border border-[#6C757D] rounded-lg text-[#F8F9FA] focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37] focus:outline-none transition-colors"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#ADB5BD] hover:text-[#F8F9FA] transition-colors"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D4AF37] text-[#0B1220] font-semibold py-3 px-4 rounded-lg hover:bg-[#B8941F] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-[#0B1220] transition-colors disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login to Organizer Panel'}
            </button>

            <div className="mt-6">
              <p className="text-[#ADB5BD] text-sm text-center mb-3">Demo Credentials:</p>
              <div className="bg-[#0B1220] rounded-lg p-3 text-sm">
                <p className="text-[#F8F9FA] mb-1"><strong>Email:</strong> admin@goldenlotus.com</p>
                <p className="text-[#F8F9FA]"><strong>Password:</strong> organizer123</p>
              </div>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="text-[#D4AF37] hover:text-[#B8941F] text-sm transition-colors"
              >
                ← Back to Main Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
