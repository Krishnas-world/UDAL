// client/context/AuthContext.tsx
'use client'; // This is a Client Component

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner'; // Import toast for notifications

// Define the shape of the user data
interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
}

// Define the shape of the AuthContext
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean; // To indicate if auth state is being loaded
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Backend API URL from environment variable
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Initially true

  const router = useRouter();

  // Load user from localStorage on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (e) {
        console.error('Failed to parse stored user or token:', e);
        logout(); // Clear invalid data
      }
    }
    setLoading(false); // Auth state loaded
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email,
        password,
      });

      const { token: newToken, ...userData } = response.data;
      setUser(userData);
      setToken(newToken);
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      toast.success('Login successful!');

      // Redirect based on role after successful login
      if (userData.role === 'admin') {
        router.push('/dashboard/admin');
      } else if (userData.role === 'ot_staff') {
        router.push('/dashboard/ot');
      } else if (userData.role === 'pharmacy_staff') {
        router.push('/dashboard/pharmacy');
      } else {
        router.push('/dashboard/general'); // Default for general_staff
      }
    } catch (error: any) {
      console.error('Login failed:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Login failed');
      throw new Error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // UPDATED: Register function to automatically log in and redirect
  const register = async (username: string, email: string, password: string) => {
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/register`, {
        username,
        email,
        password,
      });

      const { token: newToken, ...userData } = response.data;
      setUser(userData);
      setToken(newToken);
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      toast.success('Registration successful! Welcome!');

      // Redirect based on role after successful registration (now logged in)
      if (userData.role === 'admin') {
        router.push('/dashboard/admin');
      } else if (userData.role === 'ot_staff') {
        router.push('/dashboard/ot');
      } else if (userData.role === 'pharmacy_staff') {
        router.push('/dashboard/pharmacy');
      } else {
        router.push('/dashboard/general'); // Default for general_staff
      }
    } catch (error: any) {
      console.error('Registration failed:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Registration failed');
      throw new Error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };


  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.info('You have been logged out.');
    router.push('/login'); // Redirect to login page after logout
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
