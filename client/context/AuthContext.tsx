// src/context/AuthContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL; // Corrected env variable name to match your register page

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/users/profile`, {
          withCredentials: true,
        });
        console.log(res)
        setUser(res.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null); // Not logged in
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []); // Empty dependency array means this runs once on mount

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/api/auth/login`, { email, password }, {
        withCredentials: true,
      });
      setUser(res.data.user);
      toast.success('Login successful!');
      redirectToDashboard(res.data.user.role);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
      throw err; // Re-throw to allow component to catch if needed
    }
  };

  const register = async (username: string, email: string, password: string, role?: string) => {
    try {
      // If the user already exists in the context and is an admin,
      // and a role is provided, pass it. Otherwise, let backend default or infer.
      const dataToSend = {
        username,
        email,
        password,
        ...(role && { role }), // Only include role if it's provided (e.g., by admin)
      };

      const res = await axios.post(`${BACKEND_URL}/api/auth/register`, dataToSend, {
        withCredentials: true,
      });

      // The backend 'registerUser' currently logs in the newly created user and returns their data.
      // So, update the current user state with the newly registered user.
      setUser(res.data.user);
      toast.success('User registered successfully!');
      // After successful registration, it's typically good to redirect the *newly registered user*.
      // However, if an admin registers someone, the admin stays logged in.
      // For this page, we'll let the RegisterPage component handle post-registration actions.
      // If you want the new user to be automatically logged in, the backend should handle setting the cookie for the *new* user.
      // But typically, a registration flow redirects to login or confirms registration.
      // Given your backend response, it's setting the token for the *newly created user*.
      // This means the admin who registered someone will be logged out and the new user logged in.
      // This is probably not the desired behavior if an admin is creating accounts.
      // If an admin is creating accounts, the backend's `registerUser` should NOT call `generateToken` for the newly created user,
      // nor should it set a cookie. It should simply return success.
      // The `AuthContext` here is for the *current* user.
      // For now, let's assume `register` means the current *admin* is performing the registration
      // and the current admin's session should persist.
      // So, if the register API *does* log in the new user, we need to re-fetch the *admin's* user info.
      // Or, better yet, the `register` API should not log in the newly created user if it's an admin registering.

      // Let's adjust based on the common flow: if an admin registers, the admin remains logged in.
      // If a public user registers, they are then logged in.
      // Your backend `registerUser` currently generates a token and returns it, implying auto-login for the *newly registered user*.
      // This is fine if a user self-registers. If an admin registers, this logs out the admin.
      // For the admin flow, the register endpoint should just return success without logging in the new user.
      // For now, we'll leave it as is, assuming the backend's `registerUser` logs in the newly created user and you want *that* user's details.

      // If the admin is creating the account and should remain logged in:
      // You would simply toast success and not update the user state here,
      // as the `user` state in AuthContext represents the *currently logged-in* user.
      // Alternatively, the `registerUser` backend endpoint should not generate a token for the new user,
      // but rather just create the user and return success.

    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
      throw err; // Re-throw to allow component to catch
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/auth/logout`, {}, { withCredentials: true });
    } finally {
      setUser(null);
      toast.info('Logged out');
      router.push('/login');
    }
  };

  const redirectToDashboard = (role: string) => {
    switch (role) {
      case 'admin':
        router.push('/admin/dashboard');
        break;
      case 'ot_staff':
        router.push('/dashboard/ot');
        break;
      case 'pharmacy_staff':
        router.push('/dashboard/pharmacy');
        break;
      default:
        router.push('/dashboard/general');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};