const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name?: string;
  email: string;
  password: string;
}

class ApiService {
  private async fetchAPI(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  }

  async login(credentials: LoginData): Promise<AuthResponse> {
    return this.fetchAPI('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    return this.fetchAPI('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser(token: string) {
    return this.fetchAPI('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export const api = new ApiService();
