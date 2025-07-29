// src/services/authService.ts
import { apiClient } from '@/lib/api';

export interface User {
  id: string;
  nombreCompleto: string;
  correo: string;
}

export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface RegisterRequest {
  nombreCompleto: string;
  correo: string;
  contrasena: string;
}

export interface LoginResponse {
  message: string;
  user: User;
}

export interface ProfileResponse {
  user: User;
  authenticated: boolean;
}

const authService = {
  async login(credentials: LoginRequest): Promise<{ success: boolean; user?: User; error?: string }> {
    console.log('🔄 Enviando login para:', credentials.correo);
    
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    
    if (response.error) {
      console.log('❌ Error en login:', response.error);
      return { success: false, error: response.error };
    }
    
    if (response.data && response.data.user) {
      console.log('✅ Login exitoso:', response.data.user.nombreCompleto);
      return { success: true, user: response.data.user };
    }
    
    return { success: false, error: 'Respuesta inválida del servidor' };
  },

  async register(userData: RegisterRequest): Promise<{ success: boolean; user?: User; error?: string }> {
    const response = await apiClient.post<LoginResponse>('/auth/register', userData);
    
    if (response.error) {
      return { success: false, error: response.error };
    }
    
    if (response.data && response.data.user) {
      return { success: true, user: response.data.user };
    }
    
    return { success: false, error: 'Error al registrar usuario' };
  },

  async logout(): Promise<{ success: boolean; error?: string }> {
    const response = await apiClient.post('/auth/logout/secure');
    
    if (response.error) {
      return { success: false, error: response.error };
    }
    
    return { success: true };
  },

  async getProfile(): Promise<{ success: boolean; user?: User; error?: string }> {
    console.log('🔄 Verificando perfil del usuario...');
    
    const response = await apiClient.get<ProfileResponse>('/auth/me');
    
    if (response.error) {
      console.log('❌ Error en getProfile:', response.error);
      return { success: false, error: response.error };
    }
    
    if (response.data && response.data.user) {
      console.log('✅ Perfil obtenido:', response.data.user.nombreCompleto);
      return { success: true, user: response.data.user };
    }
    
    return { success: false, error: 'No se pudo obtener el perfil' };
  }
};

export default authService;