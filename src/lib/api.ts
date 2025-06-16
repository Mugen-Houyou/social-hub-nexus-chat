const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1';

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

export interface SignupPayload {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export async function signup(payload: SignupPayload): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
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

export interface RefreshPayload {
  refresh_token: string;
  token_type: 'bearer';
}

export async function refreshTokens(
  payload: RefreshPayload,
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = 'Failed to refresh token';
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

export interface Board {
  id: number;
  name: string;
  description: string;
  posts: number;
  created_at: string;
}

export async function fetchBoards(): Promise<Board[]> {
  const response = await fetch(`${API_BASE_URL}/boards/all_boards`);

  if (!response.ok) {
    throw new Error('Failed to fetch boards');
  }

  return response.json();
}

export interface PostSummary {
  id: number;
  board_id: number;
  title: string;
  author: {
    id: number;
    username: string;
  };
  created_at: string;
}

export async function fetchPostsByBoard(
  boardId: number,
  params?: { page?: number; size?: number },
): Promise<PostSummary[]> {
  const search = new URLSearchParams();
  if (params?.page) search.append('page', String(params.page));
  if (params?.size) search.append('size', String(params.size));
  const query = search.toString();
  const url = `${API_BASE_URL}/posts/boards/${boardId}/posts${query ? `?${query}` : ''}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }

  return response.json();
}
