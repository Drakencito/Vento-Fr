import { apiClient } from '@/lib/api';

export interface Platillo {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl: string;
  disponible: boolean;
  categoria: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePlatilloRequest {
  nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl: string;
  disponible: boolean;
  categoria: string;
}

export interface UpdatePlatilloRequest extends Partial<CreatePlatilloRequest> {}

export const menuService = {
  async createPlatillo(platillo: CreatePlatilloRequest): Promise<{ success: boolean; platillo?: Platillo; error?: string }> {
    const response = await apiClient.post<Platillo>('/menu', platillo);
    
    if (response.error) {
      return { success: false, error: response.error };
    }
    
    if (response.data) {
      return { success: true, platillo: response.data };
    }
    
    return { success: false, error: 'Error al crear platillo' };
  },

  async getMisPlatillos(): Promise<{ success: boolean; platillos?: Platillo[]; error?: string }> {
    const response = await apiClient.get<Platillo[]>('/menu/mis-platillos');
    
    if (response.error) {
      return { success: false, error: response.error };
    }
    
    if (response.data) {
      return { success: true, platillos: response.data };
    }
    
    return { success: false, error: 'Error al obtener platillos' };
  },

  async updatePlatillo(id: string, updates: UpdatePlatilloRequest): Promise<{ success: boolean; platillo?: Platillo; error?: string }> {
    const response = await apiClient.patch<Platillo>(`/menu/${id}`, updates);
    
    if (response.error) {
      return { success: false, error: response.error };
    }
    
    if (response.data) {
      return { success: true, platillo: response.data };
    }
    
    return { success: false, error: 'Error al actualizar platillo' };
  },

  async deletePlatillo(id: string): Promise<{ success: boolean; error?: string }> {
    const response = await apiClient.delete(`/menu/${id}`);
    
    if (response.error) {
      return { success: false, error: response.error };
    }
    
    return { success: true };
  }
};