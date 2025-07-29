// src/hooks/useMenu.ts - REEMPLAZA COMPLETAMENTE
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { menuService, Platillo } from '@/services/menuService'
import { useAuth } from '@/contexts/AuthContext'

export function useMenu() {
  const [platillos, setPlatillos] = useState<Platillo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()

  const fetchPlatillos = async () => {
    // No hacer fetch si no está autenticado o si auth está cargando
    if (!isAuthenticated || authLoading) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      console.log('🔄 Fetching platillos...')
      const result = await menuService.getMisPlatillos()
      
      if (result.success && result.platillos) {
        console.log('✅ Platillos cargados:', result.platillos.length)
        setPlatillos(result.platillos)
      } else {
        console.log('❌ Error al cargar platillos:', result.error)
        if (result.error?.includes('No autorizado') || result.error?.includes('401')) {
          // No redirigir automáticamente, dejar que AuthContext maneje esto
          setError('Sesión expirada')
        } else {
          setError(result.error || 'Error al cargar platillos')
        }
      }
    } catch (err) {
      console.error('💥 Error en fetchPlatillos:', err)
      setError('Error de conexión')
    } finally {
      setIsLoading(false)
    }
  }

  const createPlatillo = async (platillo: Omit<Platillo, 'id'>) => {
    if (!isAuthenticated) {
      return { success: false, error: 'No autenticado' }
    }

    try {
      const result = await menuService.createPlatillo(platillo)
      if (result.success && result.platillo) {
        setPlatillos(prev => [...prev, result.platillo!])
        return { success: true }
      }
      return { success: false, error: result.error }
    } catch (err) {
      return { success: false, error: 'Error al crear platillo' }
    }
  }

  const updatePlatillo = async (id: string, updates: Partial<Platillo>) => {
    if (!isAuthenticated) {
      return { success: false, error: 'No autenticado' }
    }

    try {
      const result = await menuService.updatePlatillo(id, updates)
      if (result.success && result.platillo) {
        setPlatillos(prev => 
          prev.map(p => p.id === id ? result.platillo! : p)
        )
        return { success: true }
      }
      return { success: false, error: result.error }
    } catch (err) {
      return { success: false, error: 'Error al actualizar platillo' }
    }
  }

  const deletePlatillo = async (id: string) => {
    if (!isAuthenticated) {
      return { success: false, error: 'No autenticado' }
    }

    try {
      const result = await menuService.deletePlatillo(id)
      if (result.success) {
        setPlatillos(prev => prev.filter(p => p.id !== id))
        return { success: true }
      }
      return { success: false, error: result.error }
    } catch (err) {
      return { success: false, error: 'Error al eliminar platillo' }
    }
  }

  useEffect(() => {
    // Solo fetchear cuando la autenticación esté confirmada y no esté cargando
    if (!authLoading && isAuthenticated) {
      // Agregar un pequeño delay para asegurar que las cookies estén listas
      const timer = setTimeout(() => {
        fetchPlatillos()
      }, 500)
      return () => clearTimeout(timer)
    } else if (!authLoading && !isAuthenticated) {
      setIsLoading(false)
    }
  }, [isAuthenticated, authLoading])

  return {
    platillos,
    isLoading,
    error,
    refetch: fetchPlatillos,
    createPlatillo,
    updatePlatillo,
    deletePlatillo
  }
}