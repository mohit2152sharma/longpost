import { User } from '~/lib/types/auth';

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
