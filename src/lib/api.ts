const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = 'Failed to login';
    try {
      const data = await response.json();
      message = data.detail ?? message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  return response.json();
}

export interface RegisterPayload {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export async function register(payload: RegisterPayload): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = 'Failed to register';
    try {
      const data = await response.json();
      message = data.detail ?? message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
}
