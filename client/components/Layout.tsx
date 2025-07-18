import { useAuth } from '../lib/api';
import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold text-gray-800">UDAL</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link href="/schedules" className="px-3 py-2 text-gray-700 hover:text-gray-900">
                    Schedules
                  </Link>
                  <Link href="/inventory" className="px-3 py-2 text-gray-700 hover:text-gray-900">
                    Inventory
                  </Link>
                  <Link href="/tokens" className="px-3 py-2 text-gray-700 hover:text-gray-900">
                    Tokens
                  </Link>
                  <button
                    onClick={logout}
                    className="px-3 py-2 text-gray-700 hover:text-gray-900"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/login" className="px-3 py-2 text-gray-700 hover:text-gray-900">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
