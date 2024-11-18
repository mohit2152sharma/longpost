"use client"
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { setAuthToken } from '~/lib/utils/auth';
import type { LoginCredentials } from '~/lib/types/auth';
import { BskyAgent } from '@atproto/api';

const LoginForm = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    identifier: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const agent = new BskyAgent( { service: 'https://bsky.social'})
    try {
      const response = await agent.login({ identifier: credentials.identifier, password: credentials.password}) ;
      if (!response.success) {
        throw new Error('Invalid credentials');
      }
      console.log('Logged in successfully');

      const sessionToken = response.data.AccessJwt as string
      setAuthToken(sessionToken);
      
      // Set the token in cookies for middleware
      document.cookie = `auth_token=${sessionToken}; path=/`;
      // const redirect = usePathname();
      router.push('/home');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center">Login</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              value={credentials.identifier}
              onChange={(e) => 
                setCredentials(prev => ({ ...prev, identifier: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => 
                setCredentials(prev => ({ ...prev, password: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-black rounded-md"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
