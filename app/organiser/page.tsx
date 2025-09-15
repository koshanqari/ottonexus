'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon, CalendarIcon, MapPinIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

interface Event {
  event_id: string;
  client_name: string;
  event_title: string;
  date: string;
  time: string;
  venue: string;
  description: string;
}

export default function OrganiserPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [organizerEmail, setOrganizerEmail] = useState('');
  const [newEvent, setNewEvent] = useState({
    client_name: '',
    event_title: '',
    date: '',
    time: '',
    venue: '',
    description: ''
  });
  const router = useRouter();

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
    const authenticated = localStorage.getItem('organizer_authenticated');
    const email = localStorage.getItem('organizer_email');
    
    if (authenticated === 'true' && email) {
      setIsAuthenticated(true);
      setOrganizerEmail(email);
      fetchEvents();
    } else {
      router.push('/organizer-login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('organizer_authenticated');
    localStorage.removeItem('organizer_email');
    router.push('/organizer-login');
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      setEvents(data.events);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent)
      });

      if (response.ok) {
        setShowCreateForm(false);
        setNewEvent({
          client_name: '',
          event_title: '',
          date: '',
          time: '',
          venue: '',
          description: ''
        });
        fetchEvents();
      }
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center">
        <div className="text-[#D4AF37] text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1220]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#F8F9FA]">Ottonexus</h1>
            <p className="text-[#ADB5BD] mt-2">Manage your events and guest registrations</p>
            <p className="text-[#6C757D] text-sm">Powered by Golden Lotus</p>
            <p className="text-[#D4AF37] text-sm">Logged in as: {organizerEmail}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-[#D4AF37] text-[#0B1220] px-6 py-3 rounded-lg font-semibold hover:bg-[#B8941F] transition-colors flex items-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              Create Event
            </button>
            <button
              onClick={handleLogout}
              className="bg-[#6C757D] text-[#F8F9FA] px-6 py-3 rounded-lg font-semibold hover:bg-[#5a6268] transition-colors flex items-center gap-2"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>

        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#1a2332] rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-[#F8F9FA] mb-4">Create New Event</h2>
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <input
                  type="text"
                  placeholder="Client Name"
                  value={newEvent.client_name}
                  onChange={(e) => setNewEvent({...newEvent, client_name: e.target.value})}
                  className="w-full px-4 py-2 bg-[#0B1220] border border-[#6C757D] rounded-lg text-[#F8F9FA] focus:border-[#D4AF37] focus:outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Event Title"
                  value={newEvent.event_title}
                  onChange={(e) => setNewEvent({...newEvent, event_title: e.target.value})}
                  className="w-full px-4 py-2 bg-[#0B1220] border border-[#6C757D] rounded-lg text-[#F8F9FA] focus:border-[#D4AF37] focus:outline-none"
                  required
                />
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  className="w-full px-4 py-2 bg-[#0B1220] border border-[#6C757D] rounded-lg text-[#F8F9FA] focus:border-[#D4AF37] focus:outline-none"
                  required
                />
                <input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                  className="w-full px-4 py-2 bg-[#0B1220] border border-[#6C757D] rounded-lg text-[#F8F9FA] focus:border-[#D4AF37] focus:outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Venue"
                  value={newEvent.venue}
                  onChange={(e) => setNewEvent({...newEvent, venue: e.target.value})}
                  className="w-full px-4 py-2 bg-[#0B1220] border border-[#6C757D] rounded-lg text-[#F8F9FA] focus:border-[#D4AF37] focus:outline-none"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  className="w-full px-4 py-2 bg-[#0B1220] border border-[#6C757D] rounded-lg text-[#F8F9FA] focus:border-[#D4AF37] focus:outline-none h-20 resize-none"
                  required
                />
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-[#D4AF37] text-[#0B1220] py-2 rounded-lg font-semibold hover:bg-[#B8941F] transition-colors"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 bg-[#6C757D] text-[#F8F9FA] py-2 rounded-lg font-semibold hover:bg-[#5a6268] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.event_id}
              className="bg-[#1a2332] rounded-lg p-6 hover:bg-[#2a3441] transition-colors cursor-pointer"
              onClick={() => router.push(`/organiser/${event.event_id}`)}
            >
              <h3 className="text-xl font-semibold text-[#F8F9FA] mb-2">{event.event_title}</h3>
              <p className="text-[#D4AF37] font-medium mb-3">{event.client_name}</p>
              
              <div className="space-y-2 text-[#ADB5BD] text-sm">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{formatDate(event.date)} at {event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{event.venue}</span>
                </div>
              </div>
              
              <p className="text-[#ADB5BD] text-sm mt-3 line-clamp-2">{event.description}</p>
            </div>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#ADB5BD] text-lg">No events yet. Create your first event!</p>
          </div>
        )}
      </div>
    </div>
  );
}
