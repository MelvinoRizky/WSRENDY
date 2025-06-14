'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Dummy credentials untuk testing (user & admin)
const DUMMY_USERS = [
  {
    email: 'rendyreza@rendyws.com',
    password: '123456',
    name: 'RendyReza',
    role: 'user',
    user_ID: 1
  },
  {
    email: 'rendyadmin@gmail.com',
    password: '12345',
    name: 'Admin',
    role: 'admin',
    user_ID: 999 // arbitrary admin ID
  }
];

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check credentials against dummy list
    const matchedUser = DUMMY_USERS.find(
      (u) => u.email === formData.email && u.password === formData.password
    );

    if (matchedUser) {
      // Store user session in localStorage (temporary solution)
      localStorage.setItem('rendyws_user', JSON.stringify({
        user_ID: matchedUser.user_ID,
        name: matchedUser.name,
        email: matchedUser.email,
        role: matchedUser.role,
        isLoggedIn: true
      }));

      // Decide default redirect based on role
      const defaultRedirect = matchedUser.role === 'admin' ? '/admin-dashboard' : '/dashboard';

      // Redirect to intended page if provided (ignore if admin to non-admin pages)
      const redirect = searchParams.get('redirect');
      if (redirect && matchedUser.role !== 'admin') {
        router.push(redirect);
      } else {
        router.push(defaultRedirect);
      }
    } else {
      setError('Invalid email or password. Please check your credentials.');
    }
    
    setIsLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
      <div className="absolute bottom-20 right-10 w-16 h-16 bg-cyan-300/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 right-20 w-12 h-12 bg-white/5 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>

      <div className="relative w-full max-w-md animate-fade-in">
        <div className="card p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">R</span>
              </div>
              <span className="font-display font-bold text-2xl text-secondary-900">RendyWS</span>
            </Link>
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">Welcome Back</h1>
            <p className="text-secondary-600">Sign in to your workspace account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 text-primary-600" disabled={isLoading} />
                <span className="text-sm text-secondary-600">Remember me</span>
              </label>
              <Link href="/" className="text-sm text-primary-600 hover:text-primary-700">
                Forgot password?
              </Link>
            </div>

            <button 
              type="submit" 
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-secondary-600">
              Don't have an account?{' '}
              <Link href="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign up for free
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-white/80 hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 