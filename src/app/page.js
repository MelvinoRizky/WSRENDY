'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    
    // Optimized user login check with faster execution
    const checkUserLogin = () => {
      try {
        const userData = localStorage.getItem('rendyws_user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser?.isLoggedIn === true ? parsedUser : null);
        }
      } catch (error) {
        localStorage.removeItem('rendyws_user');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Use requestAnimationFrame for better performance
    requestAnimationFrame(checkUserLogin);

    // Optimized storage listener
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

  // Simplified loading state - show content faster
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="animate-pulse">
          <div className="h-16 bg-gray-200"></div>
          <div className="h-96 bg-gray-100"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation 
        user={user} 
        showUserMenu={showUserMenu} 
        setShowUserMenu={setShowUserMenu} 
        handleLogout={handleLogout} 
      />
      
      <HeroSection user={user} />

      {/* Features Section */}
      <section id="how-it-works" className="py-20 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary-900 mb-4">
              How RendyWS Works
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Simple, fast, and reliable workspace booking in just three steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Browse & Select",
                description: "Explore our premium rooms and find the perfect workspace for your needs",
                icon: "🔍"
              },
              {
                step: "02", 
                title: "Book Instantly",
                description: "Choose your date, time, and duration. Secure your booking in seconds",
                icon: "📅"
              },
              {
                step: "03",
                title: "Work & Enjoy",
                description: "Arrive at your booked space and focus on what matters most - your work",
                icon: "💼"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="card p-8 text-center group hover:scale-105 transition-transform duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <div className="text-primary-500 font-bold text-sm mb-2">{feature.step}</div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-4">{feature.title}</h3>
                <p className="text-secondary-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Room Types Preview - Optimized images */}
      <section id="rooms" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary-900 mb-4">
              Choose Your Workspace
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              From private offices to collaborative spaces, we have the perfect environment for every work style
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                type: "Meeting Room",
                image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop&auto=format&q=75",
                features: ["4-8 People", "Projector", "Whiteboard", "WiFi"]
              },
              {
                type: "Private Office", 
                image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=300&fit=crop&auto=format&q=75",
                features: ["1-4 People", "Private Space", "Desk & Chair", "Storage"]
              },
              {
                type: "Hot Desk",
                image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&h=300&fit=crop&auto=format&q=75",
                features: ["Flexible Seating", "WiFi", "Coffee", "Community"]
              }
            ].map((room, index) => (
              <div
                key={index}
                className="card overflow-hidden group hover:scale-105 transition-transform duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={room.image} 
                    alt={room.type}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-sm font-semibold text-secondary-900">Available</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-secondary-900 mb-2">{room.type}</h3>
                  <div className="flex items-baseline mb-4">
                    <span className="text-2xl font-bold text-primary-600">{room.price}</span>
                    <span className="text-secondary-500 ml-1">{room.duration}</span>
                  </div>
                  
                  <ul className="space-y-2 mb-6">
                    {room.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-secondary-600">
                        <span className="w-2 h-2 bg-accent-500 rounded-full mr-3"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Link href="/rooms" className="btn-primary w-full text-center">
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
            Ready to Transform Your Work Experience?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of professionals who trust RendyWS for their workspace needs
          </p>
          {user && user.isLoggedIn ? (
            <Link href="/rooms" className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              Browse Available Rooms
            </Link>
          ) : (
            <Link href="/register" className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              Start Your Journey
            </Link>
          )}
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-secondary-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="font-display font-bold text-xl">RendyWS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}