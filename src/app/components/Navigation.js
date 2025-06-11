'use client';

import Link from 'next/link';

export default function Navigation({ user, showUserMenu, setShowUserMenu, handleLogout }) {
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-secondary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="font-display font-bold text-xl text-secondary-900">RendyWS</span>
            </div>
            
            {/* Navigation Links next to logo */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="#rooms" className="text-secondary-600 hover:text-primary-600 transition-colors">
                Rooms
              </Link>
              <Link href="#about" className="text-secondary-600 hover:text-primary-600 transition-colors">
                About
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && user.isLoggedIn ? (
              <>
                <Link href="/rooms" className="text-secondary-600 hover:text-primary-600 transition-colors">
                  Browse Rooms
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-secondary-600 hover:text-primary-600 transition-colors"
                  >
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-medium text-sm">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <span className="hidden sm:block">{user.name.split(' ')[0]}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-secondary-200 py-2">
                      <Link 
                        href="/dashboard" 
                        className="block px-4 py-2 text-secondary-700 hover:bg-secondary-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        📊 Dashboard
                      </Link>
                      <Link 
                        href="/rooms" 
                        className="block px-4 py-2 text-secondary-700 hover:bg-secondary-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        🏢 Browse Rooms
                      </Link>
                      <hr className="my-2 border-secondary-200" />
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
              <>
                <Link href="/login" className="text-secondary-600 hover:text-primary-600 transition-colors">
                  Login
                </Link>
                <Link href="/register" className="btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 