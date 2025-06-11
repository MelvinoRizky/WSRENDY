'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

// Mock data for rooms (sesuai database structure)
const mockRooms = [
  {
    room_ID: 1,
    name: "Executive Meeting Room A",
    capacity: 8,
    location: "Floor 2, Jakarta",
    price_per_hour: 150000,
    room_type: "meeting_room",
    description: "Spacious meeting room with city view",
    image_url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&h=300&fit=crop",
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
    image_url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=500&h=300&fit=crop",
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
    image_url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=500&h=300&fit=crop",
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
    image_url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=300&fit=crop",
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
    image_url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=500&h=300&fit=crop",
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
    image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=300&fit=crop",
    facilities: ["WiFi", "Quiet Zone", "Power Outlet", "Ergonomic Chair"]
  }
];

export default function RoomsPage() {
  const [filters, setFilters] = useState({
    priceRange: [0, 500000],
    capacity: '',
    roomType: '',
    location: ''
  });

  const [filteredRooms, setFilteredRooms] = useState(mockRooms);
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if user is logged in
    const checkUserLogin = () => {
      try {
        const userData = localStorage.getItem('rendyws_user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          if (parsedUser && parsedUser.isLoggedIn === true) {
            setUser(parsedUser);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('rendyws_user');
        setUser(null);
      }
    };

    checkUserLogin();

    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'rendyws_user') {
        checkUserLogin();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('rendyws_user');
    setUser(null);
    setShowUserMenu(false);
    window.location.reload();
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    
    // Apply filters
    let filtered = mockRooms.filter(room => {
      const priceMatch = room.price_per_hour >= newFilters.priceRange[0] && 
                        room.price_per_hour <= newFilters.priceRange[1];
      const capacityMatch = !newFilters.capacity || room.capacity >= parseInt(newFilters.capacity);
      const typeMatch = !newFilters.roomType || room.room_type === newFilters.roomType;
      const locationMatch = !newFilters.location || room.location.includes(newFilters.location);
      
      return priceMatch && capacityMatch && typeMatch && locationMatch;
    });
    
    setFilteredRooms(filtered);
  };

  // Don't render until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="font-bold text-xl text-gray-900">RendyWS</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              {user && user.isLoggedIn ? (
                // Logged in user
                <>
                  <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Dashboard
                  </Link>
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-sm">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="hidden sm:block">{user.name.split(' ')[0]}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Dropdown Menu */}
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                        <Link 
                          href="/dashboard" 
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          📊 Dashboard
                        </Link>
                        <Link 
                          href="/rooms" 
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          🏢 Browse Rooms
                        </Link>
                        <hr className="my-2 border-gray-200" />
                        <button 
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          🚪 Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                // Guest user
                <>
                  <Link href="/login" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Login
                  </Link>
                  <Link href="/register" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Workspace
          </h1>
          <p className="text-xl text-gray-600">
            {filteredRooms.length} workspace{filteredRooms.length !== 1 ? 's' : ''} available
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar removed */}
          <div className="hidden">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-6 text-lg">Filter by:</h3>
              
              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Price Range (per hour)
                </label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Rp {filters.priceRange[0].toLocaleString()}</span>
                    <span>Rp {filters.priceRange[1].toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500000"
                    step="25000"
                    value={filters.priceRange[1]}
                    onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Capacity */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Minimum Capacity
                </label>
                <select 
                  value={filters.capacity}
                  onChange={(e) => handleFilterChange('capacity', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Any capacity</option>
                  <option value="1">1+ People</option>
                  <option value="4">4+ People</option>
                  <option value="8">8+ People</option>
                  <option value="12">12+ People</option>
                </select>
              </div>

              {/* Room Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Room Type
                </label>
                <div className="space-y-3">
                  {[
                    { value: '', label: 'All types' },
                    { value: 'meeting_room', label: 'Meeting Room' },
                    { value: 'private_office', label: 'Private Office' },
                    { value: 'hot_desk', label: 'Hot Desk' }
                  ].map((type) => (
                    <label key={type.value} className="flex items-center">
                      <input
                        type="radio"
                        name="roomType"
                        value={type.value}
                        checked={filters.roomType === type.value}
                        onChange={(e) => handleFilterChange('roomType', e.target.value)}
                        className="mr-3 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Facilities */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Facilities
                </label>
                <div className="flex flex-wrap gap-2">
                  {['WiFi', 'Projector', 'Whiteboard', 'Coffee', 'AC', 'Parking'].map((facility) => (
                    <span key={facility} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {facility}
                    </span>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <button 
                onClick={() => {
                  setFilters({ priceRange: [0, 500000], capacity: '', roomType: '', location: '' });
                  setFilteredRooms(mockRooms);
                }}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Rooms Grid */}
          <div className="flex-1">
            <div className="grid md:grid-cols-2 gap-6">
              {filteredRooms.map((room, index) => (
                <div
                  key={room.room_ID}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={room.image_url} 
                      alt={room.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Available
                    </div>
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-900">
                      {room.room_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{room.name}</h3>
                    {/* Description removed */}
                    
                    <div className="text-sm text-gray-600 flex items-center mb-4">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {room.capacity} people
                    </div>
                    
                    <div className="flex items-center mb-4 text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {room.location}
                    </div>
                    
                    {/* Facilities */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {room.facilities.slice(0, 3).map((facility, idx) => (
                        <span key={idx} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                          {facility}
                        </span>
                      ))}
                      {room.facilities.length > 3 && (
                        <span className="text-gray-500 text-xs">
                          +{room.facilities.length - 3} more
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-3">
                      <Link 
                        href={`/rooms/${room.room_ID}`} 
                        className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-center hover:bg-gray-200 transition-colors"
                      >
                        View Details
                      </Link>
                      <Link 
                        href={user && user.isLoggedIn ? `/rooms/${room.room_ID}/book` : `/login?redirect=/rooms/${room.room_ID}/book`} 
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-center hover:bg-blue-700 transition-colors"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredRooms.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No rooms found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters to see more results</p>
                <button 
                  onClick={() => {
                    setFilters({ priceRange: [0, 500000], capacity: '', roomType: '', location: '' });
                    setFilteredRooms(mockRooms);
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 