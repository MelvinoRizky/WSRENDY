'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Verify admin auth
    const userData = localStorage.getItem('rendyws_user');
    if (userData) {
      const parsed = JSON.parse(userData);
      if (parsed.isLoggedIn && parsed.role === 'admin') {
        setAdmin(parsed);
      } else {
        router.push('/login');
      }
    } else {
      router.push('/login');
    }

    loadBookings();
  }, [router]);

  const loadBookings = () => {
    const data = JSON.parse(localStorage.getItem('rendyws_bookings') || '[]');
    // sort pending first then others
    const sorted = data.sort((a, b) => (a.status === 'pending' ? -1 : 1));
    setBookings(sorted);
  };

  const updateStatus = (id, newStatus, e) => {
    e?.stopPropagation();
    setBookings(prev => {
      const updated = prev.map(b =>
        b.booking_ID === id ? { ...b, status: newStatus } : b
      );
      localStorage.setItem('rendyws_bookings', JSON.stringify(updated));
      return updated;
    });
  };

  if (!mounted || !admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="font-bold text-xl text-gray-900">RendyWS Admin</span>
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem('rendyws_user');
                router.push('/');
              }}
              className="text-red-600 hover:text-red-700 text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Pending Reservations</h1>

        {bookings.length === 0 ? (
          <p className="text-gray-600">No reservations found.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.booking_ID} className="bg-white shadow rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm md:text-base">{booking.room_name}</h3>
                  <p className="text-sm text-gray-600">{booking.booking_date} • {booking.start_time} - {booking.end_time}</p>
                  <p className="text-sm text-gray-500">User: {booking.user_name} ({booking.user_email})</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : booking.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{booking.status}</span>
                  {booking.status === 'pending' && (
                    <>
                      <button onClick={(e) => updateStatus(booking.booking_ID, 'approved', e)} className="btn-primary text-xs py-1 px-3">Approve</button>
                      <button onClick={(e) => updateStatus(booking.booking_ID, 'rejected', e)} className="btn-secondary text-xs py-1 px-3">Reject</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 