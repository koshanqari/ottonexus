'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { CalendarIcon, MapPinIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface Event {
  event_id: string;
  client_name: string;
  event_title: string;
  date: string;
  time: string;
  venue: string;
  description: string;
}

interface Guest {
  guest_id: string;
  event_id: string;
  name: string;
  email: string;
  phone: string;
  company_id: string;
  kyc_file: string;
  status: string;
  rsvp: string;
}

export default function GuestDashboard() {
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company_id: ''
  });
  const [kycFile, setKycFile] = useState<File | null>(null);
  const [rsvp, setRsvp] = useState('maybe');

  useEffect(() => {
    if (params.id) {
      fetchGuestData();
    }
  }, [params.id]);

  const fetchGuestData = async () => {
    try {
      const response = await fetch(`/api/guests/${params.id}`);
      const data = await response.json();
      setGuest(data.guest);
      setFormData({
        name: data.guest.name,
        email: data.guest.email,
        phone: data.guest.phone,
        company_id: data.guest.company_id
      });
      setRsvp(data.guest.rsvp || 'maybe');

      // Fetch event details
      const eventResponse = await fetch(`/api/events/${data.guest.event_id}`);
      const eventData = await eventResponse.json();
      setEvent(eventData.event);
    } catch (error) {
      console.error('Failed to fetch guest data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      // Update guest details
      const response = await fetch(`/api/guests/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, rsvp })
      });

      if (response.ok) {
        setMessage('Registration updated successfully!');
        fetchGuestData(); // Refresh data
      } else {
        setMessage('Failed to update registration. Please try again.');
      }
    } catch (error) {
      setMessage('Failed to update registration. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setKycFile(file);
    setMessage('File selected. Click "Upload KYC" to save.');
  };

  const uploadKYC = async () => {
    if (!kycFile) return;

    setSaving(true);
    const formData = new FormData();
    formData.append('file', kycFile);

    try {
      const response = await fetch(`/api/guests/${params.id}/kyc`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setMessage('KYC document uploaded successfully!');
        setKycFile(null);
        fetchGuestData(); // Refresh data
      } else {
        setMessage('Failed to upload KYC document. Please try again.');
      }
    } catch (error) {
      setMessage('Failed to upload KYC document. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center">
        <div className="text-[#D4AF37] text-xl">Loading...</div>
      </div>
    );
  }

  if (!event || !guest) {
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center">
        <div className="text-[#F8F9FA] text-xl">Guest not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1220]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#D4AF37] mb-2">{event.event_title}</h1>
          <p className="text-[#F8F9FA] text-lg">{event.client_name}</p>
          <p className="text-[#ADB5BD] text-sm">Powered by Ottonexus</p>
          <p className="text-[#6C757D] text-xs">Golden Lotus Event Solutions</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Event Details */}
          <div className="bg-[#1a2332] rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#F8F9FA] mb-4">Event Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CalendarIcon className="w-5 h-5 text-[#D4AF37]" />
                <span className="text-[#ADB5BD]">{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-3">
                <ClockIcon className="w-5 h-5 text-[#D4AF37]" />
                <span className="text-[#ADB5BD]">{event.time}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPinIcon className="w-5 h-5 text-[#D4AF37]" />
                <span className="text-[#ADB5BD]">{event.venue}</span>
              </div>
              <div className="mt-4">
                <p className="text-[#ADB5BD]">{event.description}</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-[#0B1220] rounded-lg">
              <div className="flex items-center gap-2 text-[#D4AF37]">
                <CheckCircleIcon className="w-5 h-5" />
                <span className="font-semibold">Registration Status</span>
              </div>
              <p className="text-[#ADB5BD] mt-1 capitalize">{guest.status}</p>
            </div>

            {/* Event Materials */}
            <div className="mt-6 p-4 bg-[#0B1220] rounded-lg">
              <h3 className="text-lg font-semibold text-[#F8F9FA] mb-4">Event Materials</h3>
              <div className="space-y-3">
                <a
                  href="/materials/sample-agenda.pdf"
                  download
                  className="flex items-center gap-3 p-3 bg-[#1a2332] rounded-lg hover:bg-[#2a3441] transition-colors"
                >
                  <div className="w-8 h-8 bg-[#D4AF37] rounded flex items-center justify-center">
                    <span className="text-[#0B1220] font-bold text-sm">PDF</span>
                  </div>
                  <div>
                    <p className="text-[#F8F9FA] font-medium">Event Agenda</p>
                    <p className="text-[#ADB5BD] text-sm">Download the complete event schedule</p>
                  </div>
                </a>
                <a
                  href="/materials/sample-ticket.pdf"
                  download
                  className="flex items-center gap-3 p-3 bg-[#1a2332] rounded-lg hover:bg-[#2a3441] transition-colors"
                >
                  <div className="w-8 h-8 bg-[#D4AF37] rounded flex items-center justify-center">
                    <span className="text-[#0B1220] font-bold text-sm">PDF</span>
                  </div>
                  <div>
                    <p className="text-[#F8F9FA] font-medium">Digital Ticket</p>
                    <p className="text-[#ADB5BD] text-sm">Your entry pass for the event</p>
                  </div>
                </a>
                <a
                  href="/materials/instructions.pdf"
                  download
                  className="flex items-center gap-3 p-3 bg-[#1a2332] rounded-lg hover:bg-[#2a3441] transition-colors"
                >
                  <div className="w-8 h-8 bg-[#D4AF37] rounded flex items-center justify-center">
                    <span className="text-[#0B1220] font-bold text-sm">PDF</span>
                  </div>
                  <div>
                    <p className="text-[#F8F9FA] font-medium">Event Instructions</p>
                    <p className="text-[#ADB5BD] text-sm">Important information and guidelines</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="bg-[#1a2332] rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#F8F9FA] mb-4">Your Registration</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#ADB5BD] mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 bg-[#0B1220] border border-[#6C757D] rounded-lg text-[#F8F9FA] focus:border-[#D4AF37] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#ADB5BD] mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 bg-[#0B1220] border border-[#6C757D] rounded-lg text-[#F8F9FA] focus:border-[#D4AF37] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#ADB5BD] mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-2 bg-[#0B1220] border border-[#6C757D] rounded-lg text-[#F8F9FA] focus:border-[#D4AF37] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#ADB5BD] mb-2">Company ID</label>
                <input
                  type="text"
                  value={formData.company_id}
                  onChange={(e) => setFormData({...formData, company_id: e.target.value})}
                  className="w-full px-4 py-2 bg-[#0B1220] border border-[#6C757D] rounded-lg text-[#F8F9FA] focus:border-[#D4AF37] focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-[#D4AF37] text-[#0B1220] py-2 rounded-lg font-semibold hover:bg-[#B8941F] transition-colors disabled:opacity-50"
              >
                {saving ? 'Updating...' : 'Update Registration'}
              </button>
            </form>

            {/* RSVP Section */}
            <div className="mt-6 pt-6 border-t border-[#6C757D]">
              <h3 className="text-lg font-semibold text-[#F8F9FA] mb-4">RSVP to Event</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <button
                    onClick={() => setRsvp('yes')}
                    className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                      rsvp === 'yes' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-[#0B1220] border border-green-600 text-green-400 hover:bg-green-600 hover:text-white'
                    }`}
                  >
                    ✓ Yes, I'll attend
                  </button>
                  <button
                    onClick={() => setRsvp('maybe')}
                    className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                      rsvp === 'maybe' 
                        ? 'bg-yellow-600 text-white' 
                        : 'bg-[#0B1220] border border-yellow-600 text-yellow-400 hover:bg-yellow-600 hover:text-white'
                    }`}
                  >
                    ? Maybe
                  </button>
                  <button
                    onClick={() => setRsvp('no')}
                    className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                      rsvp === 'no' 
                        ? 'bg-red-600 text-white' 
                        : 'bg-[#0B1220] border border-red-600 text-red-400 hover:bg-red-600 hover:text-white'
                    }`}
                  >
                    ✗ No, I can't attend
                  </button>
                </div>
                <p className="text-[#ADB5BD] text-sm">
                  Current RSVP: <span className="font-semibold capitalize">{rsvp}</span>
                </p>
              </div>
            </div>

            {/* KYC Upload */}
            <div className="mt-6 pt-6 border-t border-[#6C757D]">
              <h3 className="text-lg font-semibold text-[#F8F9FA] mb-4">KYC Document</h3>
              
              {guest.kyc_file ? (
                <div className="p-4 bg-green-900 bg-opacity-20 border border-green-500 rounded-lg">
                  <p className="text-green-400">✓ KYC document uploaded successfully</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="w-full px-4 py-2 bg-[#0B1220] border border-[#6C757D] rounded-lg text-[#F8F9FA] focus:border-[#D4AF37] focus:outline-none"
                  />
                  {kycFile && (
                    <button
                      onClick={uploadKYC}
                      disabled={saving}
                      className="w-full bg-[#D4AF37] text-[#0B1220] py-2 rounded-lg font-semibold hover:bg-[#B8941F] transition-colors disabled:opacity-50"
                    >
                      {saving ? 'Uploading...' : 'Upload KYC'}
                    </button>
                  )}
                </div>
              )}
            </div>

            {message && (
              <div className={`mt-4 p-3 rounded-lg ${
                message.includes('success') 
                  ? 'bg-green-900 bg-opacity-20 text-green-400' 
                  : 'bg-red-900 bg-opacity-20 text-red-400'
              }`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
