import { apiClient } from '@/lib/api';

export interface DetallePedido {
  platilloId: string;
  cantidad: number;
  notasEspeciales?: string;
}

export interface CreatePedidoRequest {
  notas?: string;
  detalles: DetallePedido[];
}

export interface UpdatePedidoRequest {
  notas?: string;
  estado?: 'pendiente' | 'confirmado' | 'preparando' | 'listo' | 'entregado' | 'cancelado';
}

export interface Pedido {
  id: string;
  notas?: string;
  estado: string;
  total?: number;
  createdAt: string;
  updatedAt: string;
  detalles: Array<{
    id: string;
    cantidad: number;
    notasEspeciales?: string;
    platillo: {
      id: string;
      nombre: string;
      precio: number;
      descripcion: string;
    };
  }>;
}

export const pedidosService = {
  async createPedido(pedido: CreatePedidoRequest): Promise<{ success: boolean; pedido?: Pedido; error?: string }> {
    const response = await apiClient.post<Pedido>('/pedidos', pedido);
    
    if (response.error) {
      return { success: false, error: response.error };
    }
    
    if (response.data) {
      return { success: true, pedido: response.data };
    }
    
    return { success: false, error: 'Error al crear pedido' };
  },

  async getMisPedidos(): Promise<{ success: boolean; pedidos?: Pedido[]; error?: string }> {
    const response = await apiClient.get<Pedido[]>('/pedidos/mis-pedidos');
    
    if (response.error) {
      return { success: false, error: response.error };
    }
    
    if (response.data) {
      return { success: true, pedidos: response.data };
    }
    
    return { success: false, error: 'Error al obtener pedidos' };
  },

  async updatePedido(id: string, updates: UpdatePedidoRequest): Promise<{ success: boolean; pedido?: Pedido; error?: string }> {
    const response = await apiClient.patch<Pedido>(`/pedidos/${id}`, updates);
    
    if (response.error) {
      return { success: false, error: response.error };
    }
    
    if (response.data) {
      return { success: true, pedido: response.data };
    }
    
    return { success: false, error: 'Error al actualizar pedido' };
  }
};