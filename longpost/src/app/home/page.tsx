"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkAuthStatus, removeAuthToken } from '~/lib/utils/auth';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = checkAuthStatus();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    removeAuthToken();
    router.push('/login');
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Welcome to Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
        {/* Add your protected content here */}
      </div>
    </div>
  );
}
