// src/contexts/AuthContext.tsx - REEMPLAZA COMPLETAMENTE
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import authService, { User } from '@/services/authService'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  isLoading: boolean
  isAuthenticated: boolean
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Verificar autenticación solo una vez al cargar
  useEffect(() => {
    if (!hasCheckedAuth && pathname !== '/login' && pathname !== '/register') {
      checkAuthStatus()
    } else if (pathname === '/login' || pathname === '/register') {
      setIsLoading(false)
      setHasCheckedAuth(true)
    }
  }, [hasCheckedAuth, pathname])

  // Redirigir a login si no está autenticado (solo después de verificar)
  useEffect(() => {
    if (hasCheckedAuth && !isLoading && !user && pathname !== '/login' && pathname !== '/register') {
      console.log('🔄 Redirigiendo a login - usuario no autenticado')
      router.push('/login')
    }
  }, [user, isLoading, pathname, router, hasCheckedAuth])

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true)
      console.log('🔄 Verificando estado de autenticación...')
      
      const result = await authService.getProfile()
      
      if (result.success && result.user) {
        console.log('✅ Usuario autenticado:', result.user.nombreCompleto)
        setUser(result.user)
      } else {
        console.log('❌ No hay sesión activa o sesión expirada')
        setUser(null)
      }
    } catch (error) {
      console.error('❌ Error al verificar autenticación:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
      setHasCheckedAuth(true)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      console.log('🔄 Intentando login para:', email)
      
      const result = await authService.login({ 
        correo: email, 
        contrasena: password 
      })
      
      if (result.success && result.user) {
        console.log('✅ Login exitoso para:', result.user.nombreCompleto)
        setUser(result.user)
        setHasCheckedAuth(true)
        
        // CRÍTICO: Esperar un momento para que las cookies se establezcan
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        return true
      } else {
        console.log('❌ Login fallido:', result.error)
        return false
      }
      
    } catch (error) {
      console.error('❌ Error en login:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true)
      console.log('🔄 Cerrando sesión...')
      await authService.logout()
      console.log('✅ Sesión cerrada')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    } finally {
      setUser(null)
      setHasCheckedAuth(false) // Reset para permitir nueva verificación
      setIsLoading(false)
      router.push('/login')
    }
  }

  const checkAuth = async (): Promise<void> => {
    await checkAuthStatus()
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isLoading, 
      isAuthenticated: !!user,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
  //te odio jhair
}