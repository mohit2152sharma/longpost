export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  // Add other response fields from xyz.com API
}

export interface User {
  isAuthenticated: boolean;
  token: string | null;
}
