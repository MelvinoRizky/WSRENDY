'use client';

import Link from 'next/link';

export default function HeroSection({ user }) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <section className="pt-16 pb-20 bg-gradient-hero relative overflow-hidden min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white animate-fade-in leading-tight">
            {user && user.isLoggedIn ? (
              <>
                {getGreeting()},
                <br />
                <span className="text-cyan-300">{user.name.split(' ')[0]}!</span>
              </>
            ) : (
              <>
                Your Perfect
                <br />
                <span className="text-cyan-300">Workspace Awaits</span>
              </>
            )}
          </h1>
          
          <p className="text-xl text-white/90 max-w-2xl mx-auto animate-fade-in leading-relaxed text-center">
            {user && user.isLoggedIn ? (
              "Ready to book your next workspace? Explore our premium rooms and find the perfect space for your needs."
            ) : (
              "Book premium co-working spaces, meeting rooms, and private offices. Work smarter, not harder with RendyWS."
            )}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in">
            {user && user.isLoggedIn ? (
              <>
                <Link href="/rooms" className="px-10 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-center min-w-[160px]">
                  Browse Rooms
                </Link>
                <Link href="/dashboard" className="px-10 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-all duration-300 text-center min-w-[160px]">
                  My Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link href="/rooms" className="px-10 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-center min-w-[160px]">
                  Browse Rooms
                </Link>
                <Link href="#how-it-works" className="px-10 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-all duration-300 text-center min-w-[160px]">
                  How It Works
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
      <div className="absolute bottom-20 right-10 w-16 h-16 bg-cyan-300/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 right-20 w-12 h-12 bg-white/5 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
    </section>
  );
} 