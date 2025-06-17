import { useState, useEffect, ReactNode } from 'react';
import type { LoginPayload, LoginResponse } from '@/lib/api';
import { login as loginRequest } from '@/lib/api';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    const access = localStorage.getItem('access_token');
    const refresh = localStorage.getItem('refresh_token');
    if (access && refresh) {
      setAccessToken(access);
      setRefreshToken(refresh);
    }
  }, []);

  const saveTokens = (data: LoginResponse) => {
    setAccessToken(data.access_token);
    setRefreshToken(data.refresh_token);
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
  };

  const login = async (payload: LoginPayload) => {
    const data = await loginRequest(payload);
    saveTokens(data);
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        isAuthenticated: !!accessToken,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
