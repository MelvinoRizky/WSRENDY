'use client';

import ProtectedRoute from '../components/ProtectedRoute';
import Link from 'next/link';
import { useState, useEffect } from 'react';

function DashboardContent() {
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    total_bookings: 0,
    this_month_bookings: 0,
    total_spent: 0
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Get user data
    const userData = localStorage.getItem('rendyws_user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    }
    
    // Load bookings data
    loadBookingsData();
    
    // Load stats data
    loadStatsData();
  }, []);

  const loadBookingsData = () => {
    const bookingsData = JSON.parse(localStorage.getItem('rendyws_bookings') || '[]');
    // Sort by created_at descending (newest first)
    const sortedBookings = bookingsData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    setBookings(sortedBookings);
  };

  const loadStatsData = () => {
    const statsData = JSON.parse(localStorage.getItem('rendyws_user_stats') || '{}');
    
    // Check if we need to reset monthly stats
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    if (statsData.current_month !== currentMonth || statsData.current_year !== currentYear) {
      // Reset monthly stats if it's a new month/year
      const bookingsData = JSON.parse(localStorage.getItem('rendyws_bookings') || '[]');
      
      // Calculate this month's bookings
      const thisMonthBookings = bookingsData.filter(booking => {
        const bookingDate = new Date(booking.created_at);
        return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
      });
      
      const updatedStats = {
        ...statsData,
        this_month_bookings: thisMonthBookings.length,
        current_month: currentMonth,
        current_year: currentYear,
        last_updated: new Date().toISOString()
      };
      
      localStorage.setItem('rendyws_user_stats', JSON.stringify(updatedStats));
      setStats(updatedStats);
    } else {
      setStats(statsData);
    }
  };

  const handleDeleteBooking = (bookingId) => {
    const bookingToDelete = bookings.find(b => b.booking_ID === bookingId);
    if (!bookingToDelete) return;
    
    // Remove booking from localStorage
    const updatedBookings = bookings.filter(b => b.booking_ID !== bookingId);
    localStorage.setItem('rendyws_bookings', JSON.stringify(updatedBookings));
    
    // Update stats
    const currentStats = JSON.parse(localStorage.getItem('rendyws_user_stats') || '{}');
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const bookingDate = new Date(bookingToDelete.created_at);
    
    const updatedStats = {
      ...currentStats,
      total_bookings: Math.max(0, (currentStats.total_bookings || 0) - 1),
      this_month_bookings: 
        (bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear) 
          ? Math.max(0, (currentStats.this_month_bookings || 0) - 1)
          : currentStats.this_month_bookings || 0,
      last_updated: new Date().toISOString()
    };
    
    localStorage.setItem('rendyws_user_stats', JSON.stringify(updatedStats));
    
    // Update state
    setBookings(updatedBookings);
    setStats(updatedStats);
    setShowDeleteConfirm(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${period}`;
  };

  const handleLogout = () => {
    localStorage.removeItem('rendyws_user');
    window.location.href = '/';
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="font-bold text-xl text-gray-900">RendyWS</span>
            </Link>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/rooms" className="hidden sm:block text-gray-600 hover:text-blue-600 transition-colors">
                Browse
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium text-sm">
                    {user?.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <span className="hidden md:block text-gray-700 max-w-32 truncate">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 transition-colors text-sm px-2 py-1"
                >
                  Exit
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Hi, {user?.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600">Manage your workspace bookings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.total_bookings}</div>
            <div className="text-sm text-gray-600">Total Bookings</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="text-2xl font-bold text-green-600">{stats.this_month_bookings}</div>
            <div className="text-sm text-gray-600">This Month</div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
              </div>
              <div className="p-4">
                {bookings.length > 0 ? (
                  <div className="space-y-3">
                    {bookings.slice(0, 5).map((booking) => (
                      <div key={booking.booking_ID} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-gray-900 text-sm leading-tight">{booking.room_name}</h3>
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                              {booking.status}
                            </span>
                            <button
                              onClick={() => setShowDeleteConfirm(booking.booking_ID)}
                              className="text-red-500 hover:text-red-700 text-xs"
                              title="Delete booking"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-gray-600">
                            {formatDate(booking.booking_date)} • {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📅</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                    <p className="text-gray-600 mb-6">Start by booking your first workspace!</p>
                  </div>
                )}
                <div className="mt-4">
                  <Link href="/rooms" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full text-center block">
                    Book New Workspace
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Link href="/rooms" className="flex items-center p-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <span className="mr-3">🔍</span>
                  <span className="text-sm">Browse Rooms</span>
                </Link>
                <button 
                  onClick={() => setShowHistory(true)}
                  className="flex items-center p-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors w-full text-left"
                >
                  <span className="mr-3">📊</span>
                  <span className="text-sm">Full History ({bookings.length})</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Account</h3>
              <div className="flex items-center p-2 mb-2">
                <span className="mr-3">👤</span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
              >
                <span className="mr-3">🚪</span>
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Booking</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this booking? This action cannot be undone and will update your statistics.</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteBooking(showDeleteConfirm)}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">Booking History</h3>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.booking_ID} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{booking.room_name}</h4>
                          <p className="text-sm text-gray-600">{booking.room_location}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                            {booking.status}
                          </span>
                          <button
                            onClick={() => {
                              setShowHistory(false);
                              setShowDeleteConfirm(booking.booking_ID);
                            }}
                            className="text-red-500 hover:text-red-700"
                            title="Delete booking"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Date & Time</p>
                          <p className="text-sm">{formatDate(booking.booking_date)} at {formatTime(booking.start_time)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Start - End</p>
                          <p className="text-sm">{formatTime(booking.start_time)} - {formatTime(booking.end_time)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Booked On</p>
                          <p className="text-sm">{formatDate(booking.created_at)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📅</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                  <p className="text-gray-600">Your booking history will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}