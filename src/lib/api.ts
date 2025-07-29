// src/lib/api.ts - REEMPLAZA COMPLETAMENTE
const API_BASE_URL = 'https://vento-ba-production.up.railway.app';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      console.log(`🔄 ${options.method || 'GET'} ${endpoint}`);
      
      const response = await fetch(url, {
        credentials: 'include', // CRÍTICO: incluir cookies HttpOnly
        mode: 'cors', // Asegurar CORS
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // Agregar headers adicionales para debugging
          'X-Requested-With': 'XMLHttpRequest',
          ...options.headers,
        },
        ...options,
      });

      console.log(`📊 Response: ${response.status} ${response.statusText}`);

      // Debug: Ver headers de respuesta
      console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));

      // Si es 401, significa que no hay sesión válida
      if (response.status === 401) {
        console.log('❌ Error 401 - Token expirado o inválido');
        
        // Solo redirigir después de un timeout para evitar bucles
        setTimeout(() => {
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            console.log('🔄 Redirigiendo a login después de 401...');
            window.location.href = '/login';
          }
        }, 100);
        
        throw new Error('No autorizado - sesión expirada');
      }

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // Si no se puede parsear, usar el mensaje por defecto
        }
        console.log('❌ API Error:', errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('✅ API Success');
      return { data };
      
    } catch (error) {
      console.error('💥 API Error:', error);
      return { error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);