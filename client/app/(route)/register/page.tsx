// pages/register.tsx (or app/register/page.tsx)
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // Ensure this path is correct
import { toast } from "sonner";
import { Heart, User, Mail, Lock, Shield, ChevronRight, ArrowLeft, CheckCircle, AlertCircle, Home, LogOut } from "lucide-react";

interface FormData {
  username: string;
  email: string;
  password: string;
  role: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { user, loading, logout, register } = useAuth(); // Destructure register and logout from useAuth

  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    // Initialize role based on current user's role if they are an admin
    role: user?.role === "admin" ? "" : user?.role ?? "general_staff", // Default to general_staff if not admin
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const availableRoles = [
    "general_staff",
    "ot_staff",
    "pharmacy_staff",
    "admin",
  ];

  const handleLogout = () => {
    logout(); // Use the logout function from AuthContext
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      // Use the register function from AuthContext
      await register(formData.username, formData.email, formData.password, formData.role);

      setSuccess("User registered successfully!");
      toast.success("User registered successfully!");

      // Reset form after successful registration
      setFormData({
        username: "",
        email: "",
        password: "",
        role: user?.role === "admin" ? "" : user?.role ?? "general_staff",
      });

    } catch (err: any) {
      console.error(err);
      const errorMessage = err.message || "Something went wrong. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleDisplayName = (role: string) => {
    const roleMap: { [key: string]: string } = { // Add index signature for safety
      general_staff: "General Staff",
      ot_staff: "OT Staff",
      pharmacy_staff: "Pharmacy Staff",
      admin: "Administrator"
    };
    return roleMap[role] || role;
  };

  const getRoleColor = (role: string) => {
    const colorMap: { [key: string]: string } = { // Add index signature for safety
      general_staff: "from-blue-500 to-indigo-600",
      ot_staff: "from-green-500 to-emerald-600",
      pharmacy_staff: "from-purple-500 to-pink-600",
      admin: "from-red-500 to-orange-600"
    };
    return colorMap[role] || "from-gray-500 to-gray-600";
  };

  // Show loading state for AuthContext
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    router.push("/login");
    return null;
  }

  const isAdmin = user.role === "admin";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-xl">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
                  Wenlock Hospital
                </h1>
                <p className="text-slate-600 font-medium">User Registration</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm font-semibold text-slate-700">Welcome, {user.username}</span>
                  <span className="text-xs text-slate-500">{getRoleDisplayName(user.role)}</span>
                </div>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="flex items-center space-x-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Registration Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-blue-100 overflow-hidden">
            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent mb-2">
                  Register New {isAdmin ? "User" : "Team Member"}
                </h2>
                <p className="text-slate-600">Create a new staff account</p>
              </div>

              {/* Alerts */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <p className="text-green-700 font-medium">{success}</p>
                </div>
              )}

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Username</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <User className="w-5 h-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                      placeholder="Enter username"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Email</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Mail className="w-5 h-5 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Password</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Lock className="w-5 h-5 text-slate-400" />
                    </div>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                      placeholder="Enter password"
                    />
                  </div>
                </div>

                {/* Role Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Role</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Shield className="w-5 h-5 text-slate-400" />
                    </div>
                    {isAdmin ? (
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/70 backdrop-blur-sm appearance-none"
                      >
                        <option value="">Select Role</option>
                        {availableRoles.map((role) => (
                          <option key={role} value={role}>
                            {getRoleDisplayName(role)}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        name="role"
                        value={getRoleDisplayName(formData.role)}
                        disabled
                        readOnly
                        className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-2xl bg-gray-100 text-gray-700 cursor-not-allowed"
                      />
                    )}
                  </div>
                  {!isAdmin && (
                    <p className="text-xs text-slate-500 mt-1">
                      Role selection is restricted to administrators
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center group shadow-xl hover:shadow-2xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Register User</span>
                      <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </button>
              </form>

              {/* Current User Info */}
              <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${getRoleColor(user.role)} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Logged in as: {user.username}</p>
                    <p className="text-xs text-slate-600">{getRoleDisplayName(user.role)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}