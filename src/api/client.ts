const API_BASE = import.meta.env.VITE_API_URL || '';

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('cortek_token', token);
    } else {
      localStorage.removeItem('cortek_token');
    }
  }

  getToken(): string | null {
    if (this.token) return this.token;
    const stored = localStorage.getItem('cortek_token');
    if (stored) this.token = stored;
    return this.token;
  }

  private async request<T>(method: string, path: string, body?: unknown, auth = true): Promise<T> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (auth && this.getToken()) {
      headers['Authorization'] = `Bearer ${this.getToken()}`;
    }
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `Request failed: ${res.status}`);
    }
    return data as T;
  }

  get<T>(path: string, auth = true) { return this.request<T>('GET', path, undefined, auth); }
  post<T>(path: string, body?: unknown, auth = true) { return this.request<T>('POST', path, body, auth); }
  patch<T>(path: string, body?: unknown, auth = true) { return this.request<T>('PATCH', path, body, auth); }
  del<T>(path: string, auth = true) { return this.request<T>('DELETE', path, undefined, auth); }
}

export const api = new ApiClient();
