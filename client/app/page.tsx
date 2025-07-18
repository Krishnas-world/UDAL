'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Users, Calendar, AlertTriangle, Activity, Shield, Database, Server, HardDrive, ChevronRight, Heart, Stethoscope, Building2, Phone, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Heart className="w-9 h-9 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
                  Wenlock Hospital
                </h1>
                <p className="text-slate-600 font-medium">Comprehensive Care Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center space-x-3 bg-green-50 px-4 py-2 rounded-full">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-700">System Online</span>
              </div>
              <div className="text-lg font-mono font-semibold text-slate-700 bg-white/60 px-4 py-2 rounded-lg">
                {currentTime.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="text-center mb-20">
          <h2 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8 leading-tight">
            Advanced Healthcare
            <br />
            Management
          </h2>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-medium">
            Streamline patient care, optimize staff workflows, and enhance hospital operations with our
            comprehensive digital healthcare platform designed for modern medical facilities.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <div className="group bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 border border-blue-100 hover:border-blue-300 hover:-translate-y-2">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-4xl font-bold text-slate-800 mb-2">24/7</h3>
              <p className="text-slate-600 font-semibold">Continuous Operations</p>
            </div>
          </div>

          <div className="group bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 border border-green-100 hover:border-green-300 hover:-translate-y-2">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-4xl font-bold text-slate-800 mb-2">Real-time</h3>
              <p className="text-slate-600 font-semibold">Live Data Updates</p>
            </div>
          </div>

          <div className="group bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 border border-orange-100 hover:border-orange-300 hover:-translate-y-2">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-4xl font-bold text-slate-800 mb-2">Smart</h3>
              <p className="text-slate-600 font-semibold">Automated Scheduling</p>
            </div>
          </div>

          <div className="group bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 border border-red-100 hover:border-red-300 hover:-translate-y-2">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-4xl font-bold text-slate-800 mb-2">Instant</h3>
              <p className="text-slate-600 font-semibold">Emergency Alerts</p>
            </div>
          </div>
        </div>

        {/* Main Access Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
          {/* Staff Portal */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden border border-blue-100 hover:border-blue-300 hover:-translate-y-1">
            <div className="p-10">
              <div className="flex items-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-xl">
                  <Stethoscope className="w-10 h-10 text-white" />
                </div>
                <div className="ml-6">
                  <h3 className="text-3xl font-bold text-slate-800 mb-2">Staff Portal</h3>
                  <p className="text-slate-600 font-medium">Secure access for medical professionals</p>
                </div>
              </div>

              <div className="space-y-4 mb-10">
                {[
                  'Comprehensive patient records management',
                  'Advanced appointment scheduling system',
                  'Resource allocation and tracking',
                  'Emergency response protocols'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center text-slate-700 group-hover:text-slate-800 transition-colors duration-300">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-4 shadow-sm">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span className="font-semibold">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href='/login'>
                  <button className="flex-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center group shadow-xl hover:shadow-2xl hover:-translate-y-1">
                    <span>Access Staff Portal</span>
                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </Link>
                <Link href='/register'><button className="flex-1 bg-gradient-to-r from-slate-200 to-slate-300 text-slate-800 py-4 px-6 rounded-2xl font-bold text-lg hover:from-slate-300 hover:to-slate-400 transition-all duration-300 flex items-center justify-center group shadow-lg hover:shadow-xl hover:-translate-y-1">
                  <span>Register Staff Account</span>
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Patient Display */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden border border-green-100 hover:border-green-300 hover:-translate-y-1">
            <div className="p-10">
              <div className="flex items-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-xl">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <div className="ml-6">
                  <h3 className="text-3xl font-bold text-slate-800 mb-2">Patient Display</h3>
                  <p className="text-slate-600 font-medium">Public information system</p>
                </div>
              </div>

              <div className="space-y-4 mb-10">
                {[
                  'Dynamic queue management system',
                  'Real-time wait time updates',
                  'Department status monitoring',
                  'Important announcements'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center text-slate-700 group-hover:text-slate-800 transition-colors duration-300">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-4 shadow-sm">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span className="font-semibold">{feature}</span>
                  </div>
                ))}
              </div>

              <button className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 transition-all duration-300 flex items-center justify-center group shadow-xl hover:shadow-2xl hover:-translate-y-1">
                <span>Open Patient Display</span>
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border border-slate-200 mb-16">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-slate-800">System Status Monitor</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Database, name: 'Database', status: 'Online', gradient: 'from-green-500 to-emerald-600' },
              { icon: Server, name: 'API Services', status: 'Running', gradient: 'from-blue-500 to-indigo-600' },
              { icon: HardDrive, name: 'Backup System', status: 'Active', gradient: 'from-purple-500 to-pink-600' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 hover:from-green-100 hover:to-emerald-100 transition-all duration-300 shadow-lg hover:shadow-xl">
                <div className="flex items-center">
                  <div className={`w-10 h-10 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center mr-4 shadow-lg`}>
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-slate-800">{item.name}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                  <span className="text-sm text-green-700 font-bold">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">Wenlock Hospital</span>
              </div>
              <p className="text-slate-300 mb-4 leading-relaxed">
                Advanced healthcare management system providing comprehensive digital solutions for modern medical facilities.
              </p>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-6">Quick Contact</h4>
              <div className="space-y-4">
                {[
                  { icon: Phone, text: 'Emergency: 108' },
                  { icon: Building2, text: 'Support: 24/7' },
                  { icon: Mail, text: 'info@wenlock.hospital' },
                  { icon: MapPin, text: '123 Hospital Rd, Health City' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center group hover:text-blue-300 transition-colors duration-200">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-500 transition-colors duration-200">
                      <item.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-slate-300 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-6">System Info</h4>
              <div className="space-y-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-blue-300 font-semibold">Version 2.1.0</p>
                  <p className="text-slate-400">Last Updated: {new Date().toLocaleDateString()}</p>
                  <p className="text-green-300 font-semibold">Uptime: 99.98%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 mt-12">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-slate-400 mb-4 md:mb-0 font-medium">
                © 2025 Wenlock Hospital Management System. All rights reserved.
              </p>
              <div className="flex space-x-8 text-sm">
                {['Privacy Policy', 'Terms of Service', 'Security'].map((item, index) => (
                  <button key={index} className="text-slate-400 hover:text-white transition-colors duration-200 font-medium">
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