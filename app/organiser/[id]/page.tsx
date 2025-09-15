'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeftIcon, CalendarIcon, MapPinIcon, UserGroupIcon, DocumentArrowDownIcon, PencilIcon } from '@heroicons/react/24/outline';

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
}

export default function EventDashboard() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editForm, setEditForm] = useState({
    client_name: '',
    event_title: '',
    date: '',
    time: '',
    venue: '',
    description: ''
  });

  useEffect(() => {
    if (params.id) {
      fetchEventData();
    }
  }, [params.id]);

  const fetchEventData = async () => {
    try {
      const response = await fetch(`/api/events/${params.id}`);
      const data = await response.json();
      setEvent(data.event);
      setGuests(data.guests);
      
      // Populate edit form
      setEditForm({
        client_name: data.event.client_name,
        event_title: data.event.event_title,
        date: data.event.date,
        time: data.event.time,
        venue: data.event.venue,
        description: data.event.description
      });
    } catch (error) {
      console.error('Failed to fetch event data:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (guests.length === 0) return;
    
    const headers = ['Name', 'Email', 'Phone', 'Company ID', 'Status', 'RSVP', 'KYC File'];
    const csvContent = [
      headers.join(','),
      ...guests.map(guest => [
        guest.name,
        guest.email,
        guest.phone,
        guest.company_id,
        guest.status,
        guest.rsvp || 'maybe',
        guest.kyc_file ? 'Yes' : 'No'
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event?.event_title}_guests.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleEditEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/events/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        setShowEditForm(false);
        fetchEventData(); // Refresh data
      }
    } catch (error) {
      console.error('Failed to update event:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'registered':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center">
        <div className="text-[#D4AF37] text-xl">Loading...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center">
        <div className="text-[#F8F9FA] text-xl">Event not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1220]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 text-[#ADB5BD] hover:text-[#F8F9FA] transition-colors"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-[#F8F9FA]">{event.event_title}</h1>
              <p className="text-[#D4AF37] text-lg">{event.client_name}</p>
              <p className="text-[#ADB5BD] text-sm">Ottonexus Event Management</p>
              <p className="text-[#6C757D] text-xs">Powered by Golden Lotus</p>
            </div>
          </div>
          <button
            onClick={() => setShowEditForm(true)}
            className="bg-[#D4AF37] text-[#0B1220] px-4 py-2 rounded-lg font-semibold hover:bg-[#B8941F] transition-colors flex items-center gap-2"
          >
            <PencilIcon className="w-4 h-4" />
            Edit Event
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-[#1a2332] rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-[#F8F9FA] mb-4">Event Details</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="w-5 h-5 text-[#D4AF37]" />
                  <span className="text-[#ADB5BD]">{formatDate(event.date)} at {event.time}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPinIcon className="w-5 h-5 text-[#D4AF37]" />
                  <span className="text-[#ADB5BD]">{event.venue}</span>
                </div>
                <div className="mt-4">
                  <p className="text-[#ADB5BD]">{event.description}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#1a2332] rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#F8F9FA] flex items-center gap-2">
                  <UserGroupIcon className="w-5 h-5" />
                  Guests ({guests.length})
                </h2>
                <button
                  onClick={downloadCSV}
                  className="bg-[#D4AF37] text-[#0B1220] px-4 py-2 rounded-lg font-semibold hover:bg-[#B8941F] transition-colors flex items-center gap-2"
                >
                  <DocumentArrowDownIcon className="w-4 h-4" />
                  Download CSV
                </button>
              </div>

              {guests.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#6C757D]">
                        <th className="text-left py-3 px-2 text-[#ADB5BD] font-medium">Name</th>
                        <th className="text-left py-3 px-2 text-[#ADB5BD] font-medium">Email</th>
                        <th className="text-left py-3 px-2 text-[#ADB5BD] font-medium">Phone</th>
                        <th className="text-left py-3 px-2 text-[#ADB5BD] font-medium">Company ID</th>
                        <th className="text-left py-3 px-2 text-[#ADB5BD] font-medium">Status</th>
                        <th className="text-left py-3 px-2 text-[#ADB5BD] font-medium">RSVP</th>
                        <th className="text-left py-3 px-2 text-[#ADB5BD] font-medium">KYC</th>
                      </tr>
                    </thead>
                    <tbody>
                      {guests.map((guest) => (
                        <tr key={guest.guest_id} className="border-b border-[#2a3441]">
                          <td className="py-3 px-2 text-[#F8F9FA]">{guest.name}</td>
                          <td className="py-3 px-2 text-[#ADB5BD]">{guest.email}</td>
                          <td className="py-3 px-2 text-[#ADB5BD]">{guest.phone}</td>
                          <td className="py-3 px-2 text-[#ADB5BD]">{guest.company_id}</td>
                          <td className="py-3 px-2">
                            <span className={`inline-block w-2 h-2 rounded-full ${getStatusColor(guest.status)} mr-2`}></span>
                            <span className="text-[#ADB5BD] capitalize">{guest.status}</span>
                          </td>
                          <td className="py-3 px-2 text-[#ADB5BD]">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              guest.rsvp === 'yes' ? 'bg-green-900 text-green-300' :
                              guest.rsvp === 'no' ? 'bg-red-900 text-red-300' :
                              'bg-yellow-900 text-yellow-300'
                            }`}>
                              {guest.rsvp || 'maybe'}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-[#ADB5BD]">
                            {guest.kyc_file ? '✓' : '✗'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-[#ADB5BD]">No guests registered yet.</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-[#1a2332] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#F8F9FA] mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-[#ADB5BD]">Total Guests</span>
                  <span className="text-[#F8F9FA] font-semibold">{guests.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#ADB5BD]">Registered</span>
                  <span className="text-[#F8F9FA] font-semibold">
                    {guests.filter(g => g.status === 'registered').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#ADB5BD]">Pending</span>
                  <span className="text-[#F8F9FA] font-semibold">
                    {guests.filter(g => g.status === 'pending').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#ADB5BD]">KYC Uploaded</span>
                  <span className="text-[#F8F9FA] font-semibold">
                    {guests.filter(g => g.kyc_file).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Event Modal */}
        {showEditForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#1a2332] rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-[#F8F9FA] mb-4">Edit Event</h2>
              <form onSubmit={handleEditEvent} className="space-y-4">
                <input
                  type="text"
                  placeholder="Client Name"
                  value={editForm.client_name}
                  onChange={(e) => setEditForm({...editForm, client_name: e.target.value})}
                  className="w-full px-4 py-2 bg-[#0B1220] border border-[#6C757D] rounded-lg text-[#F8F9FA] focus:border-[#D4AF37] focus:outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Event Title"
                  value={editForm.event_title}
                  onChange={(e) => setEditForm({...editForm, event_title: e.target.value})}
                  className="w-full px-4 py-2 bg-[#0B1220] border border-[#6C757D] rounded-lg text-[#F8F9FA] focus:border-[#D4AF37] focus:outline-none"
                  required
                />
                <input
                  type="date"
                  value={editForm.date}
                  onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                  className="w-full px-4 py-2 bg-[#0B1220] border border-[#6C757D] rounded-lg text-[#F8F9FA] focus:border-[#D4AF37] focus:outline-none"
                  required
                />
                <input
                  type="time"
                  value={editForm.time}
                  onChange={(e) => setEditForm({...editForm, time: e.target.value})}
                  className="w-full px-4 py-2 bg-[#0B1220] border border-[#6C757D] rounded-lg text-[#F8F9FA] focus:border-[#D4AF37] focus:outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Venue"
                  value={editForm.venue}
                  onChange={(e) => setEditForm({...editForm, venue: e.target.value})}
                  className="w-full px-4 py-2 bg-[#0B1220] border border-[#6C757D] rounded-lg text-[#F8F9FA] focus:border-[#D4AF37] focus:outline-none"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={editForm.description}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  className="w-full px-4 py-2 bg-[#0B1220] border border-[#6C757D] rounded-lg text-[#F8F9FA] focus:border-[#D4AF37] focus:outline-none h-20 resize-none"
                  required
                />
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-[#D4AF37] text-[#0B1220] py-2 rounded-lg font-semibold hover:bg-[#B8941F] transition-colors"
                  >
                    Update Event
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditForm(false)}
                    className="flex-1 bg-[#6C757D] text-[#F8F9FA] py-2 rounded-lg font-semibold hover:bg-[#5a6268] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
