import { createContext } from 'react';
import type { LoginPayload } from '@/lib/api';

export interface AuthContextValue {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue>({
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
});
