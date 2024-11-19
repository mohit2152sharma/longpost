import type { User, LoginCredentials } from '~/lib/types/auth'
import { BskyAgent } from '@atproto/api';

export const AUTH_TOKEN_KEY = 'auth_token';


export const checkAuthStatus = (): User => {
  if (typeof window === 'undefined') {
    return { isAuthenticated: false, token: null };
  }

  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  return {
    isAuthenticated: !!token,
    token
  };
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const bskyLogin = async ({ credentials }: { credentials: LoginCredentials }) => {
  const agent = new BskyAgent({ service: "https://bsky.social" })
  try {
    const response = await agent.login({ identifier: credentials.identifier, password: credentials.password });

    if (!response.success) {
      return false
    }

    console.log('Logged in successfully');
    console.log(response)
    console.log(response.data)
    const sessionToken = response.data.AccessJwt as string
    setAuthToken(sessionToken);

    document.cookie = `auth_token=${sessionToken}; path=/`;
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}
