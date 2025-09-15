'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  ChartBarIcon, 
  UsersIcon, 
  CalendarIcon, 
  DocumentArrowDownIcon,
  CogIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

interface Company {
  company_id: string;
  company_name: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  settings: string;
  created_at: string;
}

interface Employee {
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

interface EventWithStats {
  event_id: string;
  client_name: string;
  event_title: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  participation: {
    yes: number;
    no: number;
    maybe: number;
    total: number;
  };
}

export default function CorporateDashboard() {
  const params = useParams();
  const companyId = params.id as string;
  
  const [company, setCompany] = useState<Company | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [events, setEvents] = useState<EventWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchCompanyData();
  }, [companyId]);

  const fetchCompanyData = async () => {
    try {
      const [companyRes, employeesRes, eventsRes] = await Promise.all([
        fetch(`/api/companies/${companyId}`),
        fetch(`/api/companies/${companyId}/employees`),
        fetch(`/api/companies/${companyId}/events`)
      ]);

      if (companyRes.ok) {
        const companyData = await companyRes.json();
        setCompany(companyData);
      }

      if (employeesRes.ok) {
        const employeesData = await employeesRes.json();
        setEmployees(employeesData);
      }

      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        setEvents(eventsData);
      }
    } catch (error) {
      console.error('Error fetching company data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportEmployees = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Status', 'RSVP', 'KYC Status'],
      ...employees.map(emp => [
        emp.name,
        emp.email,
        emp.phone,
        emp.status,
        emp.rsvp || 'maybe',
        emp.kyc_file ? 'Completed' : 'Pending'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${company?.company_name}_employees.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportEvents = () => {
    const csvContent = [
      ['Event Title', 'Client', 'Date', 'Time', 'Venue', 'Total Employees', 'Yes', 'No', 'Maybe'],
      ...events.map(event => [
        event.event_title,
        event.client_name,
        event.date,
        event.time,
        event.venue,
        event.participation.total,
        event.participation.yes,
        event.participation.no,
        event.participation.maybe
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${company?.company_name}_events.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center">
        <div className="text-[#D4AF37] text-xl">Loading...</div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center">
        <div className="text-red-400 text-xl">Company not found</div>
      </div>
    );
  }

  const totalEmployees = employees.length;
  const kycCompleted = employees.filter(emp => emp.kyc_file).length;
  const rsvpYes = employees.filter(emp => emp.rsvp === 'yes').length;
  const rsvpNo = employees.filter(emp => emp.rsvp === 'no').length;
  const rsvpMaybe = employees.filter(emp => emp.rsvp === 'maybe' || !emp.rsvp).length;

  return (
    <div className="min-h-screen bg-[#0B1220] text-[#F8F9FA]">
      {/* Header */}
      <div className="bg-[#1a2332] border-b border-[#6C757D] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#D4AF37] flex items-center gap-3">
                <BuildingOfficeIcon className="w-8 h-8" />
                {company.company_name}
              </h1>
              <p className="text-[#ADB5BD] mt-2">Corporate Dashboard</p>
              <p className="text-[#6C757D] text-sm">Powered by Golden Lotus</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={exportEmployees}
                className="bg-[#D4AF37] text-[#0B1220] px-4 py-2 rounded-lg font-semibold hover:bg-[#B8941F] transition-colors flex items-center gap-2"
              >
                <DocumentArrowDownIcon className="w-4 h-4" />
                Export Employees
              </button>
              <button
                onClick={exportEvents}
                className="bg-[#6C757D] text-[#F8F9FA] px-4 py-2 rounded-lg font-semibold hover:bg-[#5A6268] transition-colors flex items-center gap-2"
              >
                <DocumentArrowDownIcon className="w-4 h-4" />
                Export Events
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex space-x-1 bg-[#1a2332] p-1 rounded-lg">
          {[
            { id: 'overview', label: 'Overview', icon: ChartBarIcon },
            { id: 'employees', label: 'Employees', icon: UsersIcon },
            { id: 'events', label: 'Events', icon: CalendarIcon },
            { id: 'settings', label: 'Settings', icon: CogIcon }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#D4AF37] text-[#0B1220]'
                  : 'text-[#ADB5BD] hover:text-[#F8F9FA] hover:bg-[#2a3441]'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#1a2332] p-6 rounded-lg border border-[#6C757D]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#ADB5BD] text-sm">Total Employees</p>
                    <p className="text-2xl font-bold text-[#F8F9FA]">{totalEmployees}</p>
                  </div>
                  <UsersIcon className="w-8 h-8 text-[#D4AF37]" />
                </div>
              </div>
              
              <div className="bg-[#1a2332] p-6 rounded-lg border border-[#6C757D]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#ADB5BD] text-sm">KYC Completed</p>
                    <p className="text-2xl font-bold text-[#F8F9FA]">{kycCompleted}</p>
                    <p className="text-xs text-[#6C757D]">{Math.round((kycCompleted / totalEmployees) * 100)}% completion</p>
                  </div>
                  <DocumentArrowDownIcon className="w-8 h-8 text-green-400" />
                </div>
              </div>
              
              <div className="bg-[#1a2332] p-6 rounded-lg border border-[#6C757D]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#ADB5BD] text-sm">RSVP Yes</p>
                    <p className="text-2xl font-bold text-green-400">{rsvpYes}</p>
                  </div>
                  <ChartBarIcon className="w-8 h-8 text-green-400" />
                </div>
              </div>
              
              <div className="bg-[#1a2332] p-6 rounded-lg border border-[#6C757D]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#ADB5BD] text-sm">Total Events</p>
                    <p className="text-2xl font-bold text-[#F8F9FA]">{events.length}</p>
                  </div>
                  <CalendarIcon className="w-8 h-8 text-[#D4AF37]" />
                </div>
              </div>
            </div>

            {/* Recent Events */}
            <div className="bg-[#1a2332] rounded-lg border border-[#6C757D]">
              <div className="p-6 border-b border-[#6C757D]">
                <h3 className="text-lg font-semibold text-[#F8F9FA]">Recent Events</h3>
              </div>
              <div className="p-6">
                {events.length === 0 ? (
                  <p className="text-[#ADB5BD] text-center py-8">No events found</p>
                ) : (
                  <div className="space-y-4">
                    {events.slice(0, 5).map(event => (
                      <div key={event.event_id} className="flex items-center justify-between p-4 bg-[#0B1220] rounded-lg">
                        <div>
                          <h4 className="font-semibold text-[#F8F9FA]">{event.event_title}</h4>
                          <p className="text-sm text-[#ADB5BD]">{event.client_name} • {event.date} at {event.time}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex gap-4 text-sm">
                            <span className="text-green-400">{event.participation.yes} Yes</span>
                            <span className="text-red-400">{event.participation.no} No</span>
                            <span className="text-yellow-400">{event.participation.maybe} Maybe</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'employees' && (
          <div className="bg-[#1a2332] rounded-lg border border-[#6C757D]">
            <div className="p-6 border-b border-[#6C757D]">
              <h3 className="text-lg font-semibold text-[#F8F9FA]">Employee Management</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0B1220]">
                  <tr>
                    <th className="text-left py-3 px-6 text-[#ADB5BD] font-medium">Name</th>
                    <th className="text-left py-3 px-6 text-[#ADB5BD] font-medium">Email</th>
                    <th className="text-left py-3 px-6 text-[#ADB5BD] font-medium">Phone</th>
                    <th className="text-left py-3 px-6 text-[#ADB5BD] font-medium">Status</th>
                    <th className="text-left py-3 px-6 text-[#ADB5BD] font-medium">RSVP</th>
                    <th className="text-left py-3 px-6 text-[#ADB5BD] font-medium">KYC</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map(employee => (
                    <tr key={employee.guest_id} className="border-b border-[#6C757D]">
                      <td className="py-3 px-6 text-[#F8F9FA]">{employee.name}</td>
                      <td className="py-3 px-6 text-[#ADB5BD]">{employee.email}</td>
                      <td className="py-3 px-6 text-[#ADB5BD]">{employee.phone}</td>
                      <td className="py-3 px-6">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          employee.status === 'registered' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                        }`}>
                          {employee.status}
                        </span>
                      </td>
                      <td className="py-3 px-6">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          employee.rsvp === 'yes' ? 'bg-green-900 text-green-300' :
                          employee.rsvp === 'no' ? 'bg-red-900 text-red-300' :
                          'bg-yellow-900 text-yellow-300'
                        }`}>
                          {employee.rsvp || 'maybe'}
                        </span>
                      </td>
                      <td className="py-3 px-6">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          employee.kyc_file ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                        }`}>
                          {employee.kyc_file ? 'Completed' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-6">
            {events.map(event => (
              <div key={event.event_id} className="bg-[#1a2332] rounded-lg border border-[#6C757D] p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-[#F8F9FA]">{event.event_title}</h3>
                    <p className="text-[#D4AF37] text-lg">{event.client_name}</p>
                    <p className="text-[#ADB5BD] text-sm">{event.date} at {event.time}</p>
                    <p className="text-[#6C757D] text-sm">{event.venue}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#F8F9FA]">{event.participation.total}</p>
                    <p className="text-sm text-[#ADB5BD]">Total Employees</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-green-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-green-400">{event.participation.yes}</p>
                    <p className="text-sm text-green-300">Yes</p>
                  </div>
                  <div className="text-center p-3 bg-red-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-red-400">{event.participation.no}</p>
                    <p className="text-sm text-red-300">No</p>
                  </div>
                  <div className="text-center p-3 bg-yellow-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-400">{event.participation.maybe}</p>
                    <p className="text-sm text-yellow-300">Maybe</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-[#1a2332] rounded-lg border border-[#6C757D] p-6">
            <h3 className="text-lg font-semibold text-[#F8F9FA] mb-6">Company Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#ADB5BD] mb-2">Company Name</label>
                <input
                  type="text"
                  value={company.company_name}
                  className="w-full px-3 py-2 bg-[#0B1220] border border-[#6C757D] rounded-lg text-[#F8F9FA] focus:border-[#D4AF37] focus:outline-none"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#ADB5BD] mb-2">Contact Email</label>
                <input
                  type="email"
                  value={company.contact_email}
                  className="w-full px-3 py-2 bg-[#0B1220] border border-[#6C757D] rounded-lg text-[#F8F9FA] focus:border-[#D4AF37] focus:outline-none"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#ADB5BD] mb-2">Contact Phone</label>
                <input
                  type="tel"
                  value={company.contact_phone}
                  className="w-full px-3 py-2 bg-[#0B1220] border border-[#6C757D] rounded-lg text-[#F8F9FA] focus:border-[#D4AF37] focus:outline-none"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#ADB5BD] mb-2">Address</label>
                <textarea
                  value={company.address}
                  className="w-full px-3 py-2 bg-[#0B1220] border border-[#6C757D] rounded-lg text-[#F8F9FA] focus:border-[#D4AF37] focus:outline-none"
                  rows={3}
                  readOnly
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
