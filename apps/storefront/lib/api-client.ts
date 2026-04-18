const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

interface ApiResponse<T> {
  data?: T
  error?: string
}

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null

    const headers = new Headers(options?.headers)
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }))
      return { error: error.error || `HTTP ${response.status}` }
    }

    const data = await response.json()
    return { data }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Network error' }
  }
}

// Auth API
type AuthResponse = { token: string; userId: string; email: string }

export const authAPI = {
  login: (email: string, password: string) =>
    fetchAPI<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  signup: (email: string, password: string) =>
    fetchAPI<AuthResponse>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  verify: () => fetchAPI<{ valid: boolean; userId: string; email: string }>('/api/auth/verify', {
    method: 'POST',
  }),
}

// Order API
export const orderAPI = {
  create: (orderData: any) =>
    fetchAPI<{ orderId: string; orderNumber: string; status: string; createdAt: string }>(
      '/api/orders',
      {
        method: 'POST',
        body: JSON.stringify(orderData),
      }
    ),

  getByNumber: (orderNumber: string) =>
    fetchAPI<any>(`/api/orders/${orderNumber}`, {
      method: 'GET',
    }),

  getByUser: (userId: string) =>
    fetchAPI<any[]>(`/api/orders/user/${userId}`, {
      method: 'GET',
    }),

  updateStatus: (orderNumber: string, status: string) =>
    fetchAPI<any>(`/api/orders/${orderNumber}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
}

// Inquiry API
export const inquiryAPI = {
  create: (inquiryData: any) =>
    fetchAPI<{ inquiryId: string; subject: string; status: string; createdAt: string }>(
      '/api/inquiries',
      {
        method: 'POST',
        body: JSON.stringify(inquiryData),
      }
    ),

  getById: (inquiryId: string) =>
    fetchAPI<any>(`/api/inquiries/${inquiryId}`, {
      method: 'GET',
    }),

  addMessage: (inquiryId: string, messageData: any) =>
    fetchAPI<any>(`/api/inquiries/${inquiryId}/messages`, {
      method: 'POST',
      body: JSON.stringify(messageData),
    }),

  getByUser: (userId: string) =>
    fetchAPI<any[]>(`/api/inquiries/user/${userId}`, {
      method: 'GET',
    }),
}

// Notice API
export const noticeAPI = {
  getAll: () =>
    fetchAPI<any[]>('/api/notices', {
      method: 'GET',
    }),

  getById: (noticeId: string) =>
    fetchAPI<any>(`/api/notices/${noticeId}`, {
      method: 'GET',
    }),

  create: (noticeData: any) =>
    fetchAPI<any>('/api/notices', {
      method: 'POST',
      body: JSON.stringify(noticeData),
    }),

  addComment: (noticeId: string, commentData: any) =>
    fetchAPI<any>(`/api/notices/${noticeId}/comments`, {
      method: 'POST',
      body: JSON.stringify(commentData),
    }),
}
