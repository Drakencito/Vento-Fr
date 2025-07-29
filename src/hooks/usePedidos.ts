// src/hooks/usePedidos.ts - REEMPLAZA COMPLETAMENTE
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { pedidosService, Pedido, CreatePedidoRequest, UpdatePedidoRequest } from '@/services/pedidosService'
import { useAuth } from '@/contexts/AuthContext'

export function usePedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()

  const fetchPedidos = async () => {
    // No hacer fetch si no está autenticado o si auth está cargando
    if (!isAuthenticated || authLoading) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      console.log('🔄 Fetching pedidos...')
      const result = await pedidosService.getMisPedidos()
      
      if (result.success && result.pedidos) {
        console.log('✅ Pedidos cargados:', result.pedidos.length)
        setPedidos(result.pedidos)
      } else {
        console.log('❌ Error al cargar pedidos:', result.error)
        if (result.error?.includes('No autorizado') || result.error?.includes('401')) {
          // No redirigir automáticamente, dejar que AuthContext maneje esto
          setError('Sesión expirada')
        } else {
          setError(result.error || 'Error al cargar pedidos')
        }
      }
    } catch (err) {
      console.error('💥 Error en fetchPedidos:', err)
      setError('Error de conexión')
    } finally {
      setIsLoading(false)
    }
  }

  const createPedido = async (pedido: CreatePedidoRequest) => {
    if (!isAuthenticated) {
      return { success: false, error: 'No autenticado' }
    }

    try {
      const result = await pedidosService.createPedido(pedido)
      if (result.success && result.pedido) {
        setPedidos(prev => [...prev, result.pedido!])
        return { success: true, pedido: result.pedido }
      }
      return { success: false, error: result.error }
    } catch (err) {
      return { success: false, error: 'Error al crear pedido' }
    }
  }

  const updatePedido = async (id: string, updates: UpdatePedidoRequest) => {
    if (!isAuthenticated) {
      return { success: false, error: 'No autenticado' }
    }

    try {
      const result = await pedidosService.updatePedido(id, updates)
      if (result.success && result.pedido) {
        setPedidos(prev => 
          prev.map(p => p.id === id ? result.pedido! : p)
        )
        return { success: true }
      }
      return { success: false, error: result.error }
    } catch (err) {
      return { success: false, error: 'Error al actualizar pedido' }
    }
  }

  useEffect(() => {
    // Solo fetchear cuando la autenticación esté confirmada y no esté cargando
    if (!authLoading && isAuthenticated) {
      // Agregar un pequeño delay para asegurar que las cookies estén listas
      const timer = setTimeout(() => {
        fetchPedidos()
      }, 500)
      return () => clearTimeout(timer)
    } else if (!authLoading && !isAuthenticated) {
      setIsLoading(false)
    }
  }, [isAuthenticated, authLoading])

  return {
    pedidos,
    isLoading,
    error,
    refetch: fetchPedidos,
    createPedido,
    updatePedido
  }
}