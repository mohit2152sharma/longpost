export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface User {
  isAuthenticated: boolean;
  token: string | null;
}
