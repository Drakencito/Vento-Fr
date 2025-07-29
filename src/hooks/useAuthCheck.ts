import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export function useAuthCheck() {
  const { isAuthenticated, isLoading, checkAuth } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  // Función para re-verificar autenticación cuando hay errores 401
  const handleAuthError = async () => {
    await checkAuth()
    if (!isAuthenticated) {
      router.push('/login')
    }
  }

  return {
    isAuthenticated,
    isLoading,
    handleAuthError
  }
}