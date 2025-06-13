'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Mock room data (same as detail page)
const getRoomById = (id) => {
  const rooms = [
    {
      room_ID: 1,
      name: "Executive Meeting Room A",
      capacity: 8,
      location: "Floor 2, Jakarta",
      price_per_hour: 150000,
      room_type: "meeting_room",
      description: "Spacious meeting room with city view",
      image_url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
      facilities: ["Projector", "Whiteboard", "WiFi", "AC", "Coffee"]
    },
    {
      room_ID: 2,
      name: "Private Office Suite",
      capacity: 4,
      location: "Floor 3, Jakarta", 
      price_per_hour: 300000,
      room_type: "private_office",
      description: "Luxury private office with premium amenities",
      image_url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop",
      facilities: ["Desk", "Chair", "Storage", "WiFi", "Printer"]
    },
    {
      room_ID: 3,
      name: "Hot Desk Area",
      capacity: 1,
      location: "Floor 1, Jakarta",
      price_per_hour: 75000,
      room_type: "hot_desk", 
      description: "Flexible workspace in vibrant community",
      image_url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop",
      facilities: ["WiFi", "Coffee", "Lounge", "Community"]
    },
    {
      room_ID: 4,
      name: "Conference Room B",
      capacity: 12,
      location: "Floor 2, Jakarta",
      price_per_hour: 200000,
      room_type: "meeting_room",
      description: "Large conference room for team meetings",
      image_url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop",
      facilities: ["Projector", "Sound System", "WiFi", "AC", "Catering"]
    },
    {
      room_ID: 5,
      name: "Creative Studio",
      capacity: 6,
      location: "Floor 4, Jakarta",
      price_per_hour: 180000,
      room_type: "private_office",
      description: "Inspiring space for creative work",
      image_url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=600&fit=crop",
      facilities: ["Natural Light", "Whiteboard", "WiFi", "Plants", "Art Supplies"]
    },
    {
      room_ID: 6,
      name: "Quiet Zone Desk",
      capacity: 1,
      location: "Floor 1, Jakarta",
      price_per_hour: 50000,
      room_type: "hot_desk",
      description: "Perfect for focused individual work",
      image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
      facilities: ["WiFi", "Quiet Zone", "Power Outlet", "Ergonomic Chair"]
    }
  ];
  
  return rooms.find(room => room.room_ID === parseInt(id));
};

export default function BookRoomPage({ params }) {
  const router = useRouter();
  const [room, setRoom] = useState(null);
  const [user, setUser] = useState(null);
  const [bookingData, setBookingData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    // purpose and special requests removed
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Get room data
    const roomData = getRoomById(params.id);
    setRoom(roomData);
    
    // Check if user is logged in
    const userData = localStorage.getItem('rendyws_user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.isLoggedIn) {
        setUser(parsedUser);
      } else {
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [params.id, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Small delay to show spinner briefly (0.5s)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Create booking object
    const newBooking = {
      booking_ID: Date.now(), // Simple ID based on timestamp
      room_ID: room.room_ID,
      room_name: room.name,
      user_ID: user.user_ID,
      user_name: user.name,
      user_email: user.email,
      booking_date: bookingData.date,
      start_time: bookingData.startTime,
      end_time: bookingData.endTime,
      status: 'pending',
      created_at: new Date().toISOString(),
      room_location: room.location,
      room_capacity: room.capacity,
      room_image: room.image_url
    };
    
    // Get existing bookings from localStorage
    const existingBookings = JSON.parse(localStorage.getItem('rendyws_bookings') || '[]');
    
    // Add new booking
    existingBookings.push(newBooking);
    
    // Save back to localStorage
    localStorage.setItem('rendyws_bookings', JSON.stringify(existingBookings));
    
    // Update user stats in localStorage
    const existingStats = JSON.parse(localStorage.getItem('rendyws_user_stats') || '{}');
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Update stats
    const updatedStats = {
      total_bookings: (existingStats.total_bookings || 0) + 1,
      this_month_bookings: (existingStats.this_month_bookings || 0) + 1,
      total_spent: existingStats.total_spent || 0,
      last_updated: new Date().toISOString(),
      current_month: currentMonth,
      current_year: currentYear
    };
    
    localStorage.setItem('rendyws_user_stats', JSON.stringify(updatedStats));
    
    // Show success message
    alert(`Booking request submitted! 🎉\n\nRoom: ${room.name}\nDate: ${bookingData.date}\nStart: ${bookingData.startTime}\nEnd: ${bookingData.endTime}\n\nWaiting for admin approval.`);
    
    // Redirect to dashboard
    router.push('/dashboard');
    setIsLoading(false);
  };

  const handleChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  // Show loading while checking auth or room data
  if (!room || !user) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-secondary-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="font-display font-bold text-xl text-secondary-900">RendyWS</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link href={`/rooms/${room.room_ID}`} className="text-secondary-600 hover:text-primary-600 transition-colors">
                ← Back to Room
              </Link>
              <Link href="/dashboard" className="btn-secondary">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-display font-bold text-secondary-900 mb-2">
            Book Your Workspace
          </h1>
          <p className="text-secondary-600">
            Complete your booking for {room.name}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="card p-8">
              <h2 className="text-xl font-semibold text-secondary-900 mb-6">Booking Details</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Booking Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={bookingData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="input-field"
                    disabled={isLoading}
                  />
                </div>

                {/* Time Selection */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Start Time
                    </label>
                    <select
                      name="startTime"
                      value={bookingData.startTime}
                      onChange={handleChange}
                      required
                      className="input-field"
                      disabled={isLoading}
                    >
                      <option value="">Select time</option>
                      <option value="08:00">08:00 AM</option>
                      <option value="09:00">09:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="13:00">01:00 PM</option>
                      <option value="14:00">02:00 PM</option>
                      <option value="15:00">03:00 PM</option>
                      <option value="16:00">04:00 PM</option>
                      <option value="17:00">05:00 PM</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      End Time
                    </label>
                    <select
                      name="endTime"
                      value={bookingData.endTime}
                      onChange={handleChange}
                      required
                      className="input-field"
                      disabled={isLoading}
                    >
                      <option value="">Select time</option>
                      <option value="09:00">09:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="13:00">01:00 PM</option>
                      <option value="14:00">02:00 PM</option>
                      <option value="15:00">03:00 PM</option>
                      <option value="16:00">04:00 PM</option>
                      <option value="17:00">05:00 PM</option>
                      <option value="18:00">06:00 PM</option>
                    </select>
                  </div>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing Booking...
                    </div>
                  ) : (
                    'Confirm Booking'
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Booking Summary */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="card p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Booking Summary</h3>
              
              {/* Room Info */}
              <div className="space-y-4 mb-6">
                <div className="flex space-x-3">
                  <img 
                    src={room.image_url} 
                    alt={room.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-secondary-900">{room.name}</h4>
                    <p className="text-sm text-secondary-600">{room.location}</p>
                    <p className="text-sm text-secondary-600">👥 {room.capacity} people</p>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="space-y-3 mb-6 pb-6 border-b border-secondary-200">
                <div className="flex justify-between">
                  <span className="text-secondary-600">Date:</span>
                  <span className="font-medium">{bookingData.date || 'Not selected'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Start Time:</span>
                  <span className="font-medium">{bookingData.startTime || 'Not selected'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">End Time:</span>
                  <span className="font-medium">{bookingData.endTime || 'Not selected'}</span>
                </div>
              </div>

              {/* User Info */}
              <div className="bg-secondary-50 rounded-lg p-4">
                <h4 className="font-medium text-secondary-900 mb-2">Booking for:</h4>
                <p className="text-sm text-secondary-600">{user.name}</p>
                <p className="text-sm text-secondary-600">{user.email}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 