'use client'

import { useMenu } from '@/hooks/useMenu'
import { usePedidos } from '@/hooks/usePedidos'
import { useAuth } from '@/contexts/AuthContext'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'

export default function Dashboard() {
  const { user } = useAuth()
  const { platillos, isLoading: menuLoading } = useMenu()
  const { pedidos, isLoading: pedidosLoading } = usePedidos()

  // Filtrar productos destacados (primeros 3 disponibles)
  const featuredProducts = platillos.filter(p => p.disponible).slice(0, 3)
  
  // Estadísticas básicas
  const totalPlatillos = platillos.length
  const platillosDisponibles = platillos.filter(p => p.disponible).length
  const pedidosPendientes = pedidos.filter(p => p.estado === 'pendiente').length
  const pedidosHoy = pedidos.filter(p => {
    const today = new Date().toDateString()
    const pedidoDate = new Date(p.createdAt).toDateString()
    return today === pedidoDate
  }).length

  const handleProductClick = (platillo: any) => {
    console.log('Producto seleccionado:', platillo)
  }

  if (menuLoading || pedidosLoading) {
    return (
      <div className="p-6 bg-black min-h-screen text-white">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Cargando dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              ¡Bienvenido, {user?.nombreCompleto || 'Usuario'}!
            </h1>
            <p className="text-gray-400 mt-1">Panel de control de Vento</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar..."
                className="w-80 pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-400 text-sm font-medium mb-2">Total Platillos</h3>
              <p className="text-2xl font-bold text-white">{totalPlatillos}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-400 text-sm font-medium mb-2">Disponibles</h3>
              <p className="text-2xl font-bold text-green-400">{platillosDisponibles}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-400 text-sm font-medium mb-2">Pedidos Pendientes</h3>
              <p className="text-2xl font-bold text-yellow-400">{pedidosPendientes}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-400 text-sm font-medium mb-2">Pedidos Hoy</h3>
              <p className="text-2xl font-bold text-blue-400">{pedidosHoy}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Platillos Destacados</h2>
            <Link 
              href="/menu" 
              className="text-orange-400 hover:text-orange-300 text-sm font-medium"
            >
              Ver todos →
            </Link>
          </div>
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((platillo) => (
                <ProductCard
                  key={platillo.id}
                  id={platillo.id}
                  title={platillo.nombre}
                  imageSrc={platillo.imagenUrl || 'https://via.placeholder.com/300x200?text=Sin+Imagen'}
                  price={platillo.precio}
                  category={platillo.categoria}
                  description={platillo.descripcion}
                  isAvailable={platillo.disponible}
                  onClick={() => handleProductClick(platillo)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8 bg-gray-900 rounded-lg border border-gray-800">
              <div className="text-4xl mb-2">🍽️</div>
              <p className="mb-4">No hay platillos disponibles</p>
              <Link 
                href="/menu" 
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Agregar platillos
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-6">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/menu" className="bg-gray-900 hover:bg-gray-800 rounded-xl p-6 border border-gray-800 transition-colors group">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">Gestionar Menú</h3>
              </div>
              <p className="text-gray-400 text-sm">Agregar, editar o eliminar platillos</p>
            </Link>

            <Link href="/pedidos" className="bg-gray-900 hover:bg-gray-800 rounded-xl p-6 border border-gray-800 transition-colors group">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">Ver Pedidos</h3>
              </div>
              <p className="text-gray-400 text-sm">Revisar y gestionar pedidos activos</p>
            </Link>

            <Link href="/ventas" className="bg-gray-900 hover:bg-gray-800 rounded-xl p-6 border border-gray-800 transition-colors group">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">Reportes de Ventas</h3>
              </div>
              <p className="text-gray-400 text-sm">Analizar rendimiento y estadísticas</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}