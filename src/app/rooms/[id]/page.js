'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Mock room data (sesuai database structure)
const getRoomById = (id) => {
  const rooms = [
    {
      room_ID: 1,
      name: "Executive Meeting Room A",
      capacity: 8,
      location: "Floor 2, Jakarta",
      price_per_hour: 150000,
      room_type: "meeting_room",
      description: "Spacious meeting room with city view, perfect for important business meetings and presentations. Features premium amenities and professional atmosphere.",
      image_url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
      facilities: ["Projector", "Whiteboard", "WiFi", "AC", "Coffee", "City View", "Sound System"],
      images: [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=600&fit=crop"
      ]
    },
    {
      room_ID: 2,
      name: "Private Office Suite",
      capacity: 4,
      location: "Floor 3, Jakarta", 
      price_per_hour: 300000,
      room_type: "private_office",
      description: "Luxury private office with premium amenities, ideal for focused work sessions and small team collaborations. Includes dedicated workspace with storage.",
      image_url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop",
      facilities: ["Desk", "Chair", "Storage", "WiFi", "Printer", "Private Entrance", "Phone Booth"],
      images: [
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop"
      ]
    },
    {
      room_ID: 3,
      name: "Hot Desk Area",
      capacity: 1,
      location: "Floor 1, Jakarta",
      price_per_hour: 75000,
      room_type: "hot_desk", 
      description: "Flexible workspace in vibrant community environment. Perfect for individual work, networking, and accessing our collaborative ecosystem.",
      image_url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop",
      facilities: ["WiFi", "Coffee", "Lounge", "Community", "Power Outlets", "Ergonomic Chair"],
      images: [
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=600&fit=crop"
      ]
    }
  ];
  
  return rooms.find(room => room.room_ID === parseInt(id));
};

export default function RoomDetailPage({ params }) {
  const [room, setRoom] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [user, setUser] = useState(null);

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
      }
    }
  }, [params.id]);

  if (!room) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏢</div>
          <h1 className="text-2xl font-bold text-secondary-900 mb-2">Room Not Found</h1>
          <p className="text-secondary-600 mb-6">The room you're looking for doesn't exist.</p>
          <Link href="/rooms" className="btn-primary">
            Back to Rooms
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
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
              <Link href="/rooms" className="text-secondary-600 hover:text-primary-600 transition-colors">
                ← Back to Rooms
              </Link>
              {user ? (
                <Link href="/dashboard" className="btn-primary">
                  Dashboard
                </Link>
              ) : (
                <Link href="/login" className="btn-primary">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="relative h-96 rounded-xl overflow-hidden">
              <img 
                src={room.images[currentImageIndex]} 
                alt={room.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Available
              </div>
            </div>
            
            {/* Thumbnail Images */}
            <div className="flex space-x-4">
              {room.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative h-20 w-20 rounded-lg overflow-hidden border-2 transition-all ${
                    currentImageIndex === index ? 'border-primary-500' : 'border-transparent'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`${room.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Room Details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Room Info */}
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs font-medium">
                  {room.room_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
                <span className="text-secondary-500">👥 {room.capacity} people</span>
              </div>
              <h1 className="text-3xl font-bold text-secondary-900 mb-2">{room.name}</h1>
              {/* Description removed */}
              <div className="flex items-center text-secondary-600">
                <span className="mr-4">📍 {room.location}</span>
              </div>
            </div>

            {/* Facilities */}
            <div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Facilities & Amenities</h3>
              <div className="grid grid-cols-2 gap-3">
                {room.facilities.map((facility, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-accent-500 rounded-full"></span>
                    <span className="text-secondary-700">{facility}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking CTA */}
            <div className="space-y-4">
              <Link 
                href={user ? `/rooms/${room.room_ID}/book` : `/login?redirect=/rooms/${room.room_ID}/book`}
                className="btn-primary w-full text-center block"
              >
                Book This Room
              </Link>
              <button className="btn-secondary w-full">
                💬 Contact Support
              </button>
            </div>

            {/* Additional Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">💡 Booking Tips</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Book in advance for better availability</li>
                <li>• Minimum booking duration is 1 hour</li>
                <li>• Cancellation allowed up to 2 hours before</li>
                <li>• All amenities included in the price</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 