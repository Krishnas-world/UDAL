// HomePage.js (or wherever your HomePage component is)
'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Users, Calendar, AlertTriangle, Activity, Shield, Database, Server, HardDrive, ChevronRight, Heart, Stethoscope, Building2, Phone, Mail, MapPin, User, LogOut, Settings, Bell, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter
import { useAuth } from '@/lib/api'; // Assuming your useAuth hook is in '@/lib/api'

export default function HomePage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);

  const { user, loading, logout } = useAuth(); // Get user, loading, and logout from useAuth
  const router = useRouter(); // Initialize useRouter

  // State for user details, now derived from useAuth
  const isLoggedIn = !!user;
  const userName = user?.name || 'Guest'; // Assuming 'name' comes with user object from auth
  const userRole = user?.role || 'Visitor'; // Assuming 'role' comes with user object from auth

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLoginRedirect = () => {
    router.push('/login'); // Redirect to your login page
  };

  const handleLogout = () => {
    logout(); // Use the logout function from useAuth
  };

  const NavigationMenu = () => (
    <nav className="hidden md:flex items-center space-x-6">
      {isLoggedIn ? (
        <>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="p-2 text-slate-600 hover:text-blue-600 transition-colors duration-200">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
            </div>
            <div className="flex items-center space-x-3 bg-blue-50 px-4 py-2 rounded-full">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="text-sm">
                <p className="font-semibold text-slate-800">{userName}</p>
                <p className="text-slate-600">{userRole}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-slate-600 hover:text-red-600 transition-colors duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLoginRedirect} // Redirect to login page
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Staff Login
          </button>
          <Link href="/register"> {/* Assuming a register page */}
            <button className="text-slate-600 hover:text-blue-600 font-semibold transition-colors duration-200">
              Register
            </button>
          </Link>
        </div>
      )}
    </nav>
  );

  const MobileMenu = () => (
    <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
      <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg shadow-xl border-t border-blue-100 z-50">
        <div className="p-6">
          {isLoggedIn ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-2xl">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{userName}</p>
                  <p className="text-sm text-slate-600">{userRole}</p>
                </div>
              </div>
              <button className="w-full flex items-center justify-center space-x-2 p-3 text-slate-600 hover:text-blue-600 transition-colors duration-200">
                <Bell className="w-5 h-5" />
                <span>Notifications ({notifications})</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 p-3 text-red-600 hover:text-red-700 transition-colors duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <button
                onClick={handleLoginRedirect}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
              >
                Staff Login
              </button>
              <Link href="/register">
                <button className="w-full text-slate-600 hover:text-blue-600 font-semibold py-3 transition-colors duration-200">
                  Register Staff Account
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-blue-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
                  Wenlock Hospital
                </h1>
                <p className="text-sm text-slate-600 font-medium">Care Management System</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-3 bg-green-50 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-700">Online</span>
              </div>
              <div className="text-sm font-mono font-semibold text-slate-700 bg-white/60 px-3 py-1 rounded-lg">
                {currentTime.toLocaleTimeString()}
              </div>

              <NavigationMenu />

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 text-slate-600 hover:text-blue-600 transition-colors duration-200"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
        <MobileMenu />
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Welcome Message for Logged In Users */}
        {isLoggedIn && (
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Welcome back, {userName}!</h2>
                <p className="text-slate-600">Ready to manage patient care and hospital operations.</p>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6 leading-tight">
            Advanced Healthcare
            <br />
            Management
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
            Streamline patient care, optimize staff workflows, and enhance hospital operations with our
            comprehensive digital healthcare platform.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-blue-100 hover:border-blue-300 hover:-translate-y-1">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-slate-800 mb-1">24/7</h3>
              <p className="text-slate-600 font-medium">Continuous Operations</p>
            </div>
          </div>

          <div className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-green-100 hover:border-green-300 hover:-translate-y-1">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-slate-800 mb-1">Real-time</h3>
              <p className="text-slate-600 font-medium">Live Updates</p>
            </div>
          </div>

          <div className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-orange-100 hover:border-orange-300 hover:-translate-y-1">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-slate-800 mb-1">Smart</h3>
              <p className="text-slate-600 font-medium">Scheduling</p>
            </div>
          </div>

          <div className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-red-100 hover:border-red-300 hover:-translate-y-1">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-slate-800 mb-1">Instant</h3>
              <p className="text-slate-600 font-medium">Alerts</p>
            </div>
          </div>
        </div>

        {/* Main Access Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Staff Portal */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-blue-100 hover:border-blue-300">
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <Stethoscope className="w-8 h-8 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-bold text-slate-800 mb-1">Staff Portal</h3>
                  <p className="text-slate-600 font-medium">Medical professional access</p>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {[
                  'Patient records management',
                  'Appointment scheduling',
                  'Resource allocation',
                  'Emergency protocols'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center text-slate-700">
                    <div className="w-5 h-5 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-3">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span className="font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {isLoggedIn ? (
                  <Link href="/dashboard"> {/* Link to dashboard if logged in */}
                    <button className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center group shadow-lg">
                      <span>Access Dashboard</span>
                      <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={handleLoginRedirect}
                      className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center group shadow-lg"
                    >
                      <span>Staff Login</span>
                      <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                    <Link href="/register">
                      <button className="w-full bg-slate-200 text-slate-800 py-3 px-6 rounded-xl font-semibold hover:bg-slate-300 transition-all duration-300">
                        Register Staff Account
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Patient Display */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-green-100 hover:border-green-300">
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-bold text-slate-800 mb-1">Patient Display</h3>
                  <p className="text-slate-600 font-medium">Public information system</p>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {[
                  'Queue management',
                  'Wait time updates',
                  'Department status',
                  'Announcements'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center text-slate-700">
                    <div className="w-5 h-5 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-3">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span className="font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <button className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 transition-all duration-300 flex items-center justify-center group shadow-lg">
                <span>Open Patient Display</span>
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-slate-200">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">System Status</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Database, name: 'Database', status: 'Online' },
              { icon: Server, name: 'API Services', status: 'Running' },
              { icon: HardDrive, name: 'Backup System', status: 'Active' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
                    <item.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-slate-800">{item.name}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm text-green-700 font-semibold">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-lg flex items-center justify-center mr-3">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Wenlock Hospital</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Advanced healthcare management system for modern medical facilities.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Quick Contact</h4>
              <div className="space-y-3">
                {[
                  { icon: Phone, text: 'Emergency: 108' },
                  { icon: Building2, text: 'Support: 24/7' },
                  { icon: Mail, text: 'info@wenlock.hospital' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center text-slate-300">
                    <item.icon className="w-4 h-4 mr-3" />
                    <span className="text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">System Info</h4>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-blue-300 font-semibold">Version 2.1.0</p>
                <p className="text-slate-400 text-sm">Updated: {new Date().toLocaleDateString()}</p>
                <p className="text-green-300 font-semibold text-sm">Uptime: 99.98%</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-slate-400 text-sm mb-4 md:mb-0">
                © 2025 Wenlock Hospital. All rights reserved.
              </p>
              <div className="flex space-x-6 text-sm">
                {['Privacy', 'Terms', 'Security'].map((item, index) => (
                  <button key={index} className="text-slate-400 hover:text-white transition-colors duration-200">
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}