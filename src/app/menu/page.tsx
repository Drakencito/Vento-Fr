'use client'

import { useState } from 'react'
import { useMenu } from '@/hooks/useMenu'
import { Platillo } from '@/services/menuService'
import ProductCard from '@/components/ProductCard'
import CreatePlatilloModal from '@/components/CreatePlatilloModal'

type CategoryType = 'todas' | 'hamburguesas' | 'hot dogs' | 'refrescos' | 'complementos' | 'postres' | 'entradas'

const categories = [
  { id: 'todas', name: 'Todas' },
  { id: 'hamburguesas', name: 'Hamburguesas' },
  { id: 'hot dogs', name: 'Hot Dogs' },
  { id: 'refrescos', name: 'Refrescos' },
  { id: 'complementos', name: 'Complementos' },
  { id: 'postres', name: 'Postres' },
  { id: 'entradas', name: 'Entradas' }
]

export default function MenuPage() {
  const { platillos, isLoading, error, createPlatillo, updatePlatillo, deletePlatillo } = useMenu()
  const [activeCategory, setActiveCategory] = useState<CategoryType>('todas')
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Filtrar productos por categoría y búsqueda
  const filteredPlatillos = platillos.filter(platillo => {
    const matchesCategory = activeCategory === 'todas' || 
                           platillo.categoria.toLowerCase() === activeCategory.replace(' ', ' ')
    const matchesSearch = platillo.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleProductClick = (platillo: Platillo) => {
    console.log('Platillo seleccionado:', platillo)
    // Aquí puedes agregar lógica para editar producto
  }

  const handleCreatePlatillo = async (platilloData: Omit<Platillo, 'id'>) => {
    const result = await createPlatillo(platilloData)
    if (result.success) {
      setIsCreateModalOpen(false)
      // Puedes agregar un toast de éxito aquí
      console.log('✅ Platillo creado exitosamente')
    } else {
      // Mostrar error
      alert(result.error || 'Error al crear platillo')
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 bg-black min-h-screen text-white">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Cargando menú...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-black min-h-screen text-white">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <p className="text-red-400 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Menú del Restaurante</h1>
            <p className="text-gray-400 mt-1">
              Gestiona los platillos y categorías de tu menú
            </p>
          </div>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Platillo
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Buscar platillos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-3.5 h-5 w-5 text-gray-500"
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

      {/* Category Tabs */}
      <div className="mb-8">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id as CategoryType)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                activeCategory === category.id
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <h3 className="text-gray-400 text-sm font-medium">Total Platillos</h3>
          <p className="text-2xl font-bold text-white">{platillos.length}</p>
        </div>
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <h3 className="text-gray-400 text-sm font-medium">Disponibles</h3>
          <p className="text-2xl font-bold text-green-400">
            {platillos.filter(p => p.disponible).length}
          </p>
        </div>
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <h3 className="text-gray-400 text-sm font-medium">Categorías</h3>
          <p className="text-2xl font-bold text-blue-400">
            {new Set(platillos.map(p => p.categoria)).size}
          </p>
        </div>
      </div>

      {/* Platillos Grid */}
      <div>
        <h2 className="text-2xl font-semibold text-white mb-6">
          {categories.find(cat => cat.id === activeCategory)?.name}
          <span className="text-gray-400 text-lg ml-2">({filteredPlatillos.length})</span>
        </h2>
        
        {filteredPlatillos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlatillos.map((platillo) => (
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
          <div className="text-center py-12">
            <div className="text-6xl mb-4 text-gray-500">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No se encontraron platillos</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? `No hay platillos que coincidan con "${searchTerm}"` : 'No hay platillos en esta categoría'}
            </p>
            {activeCategory === 'todas' && !searchTerm && (
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Crear primer platillo
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create Platillo Modal */}
      <CreatePlatilloModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onConfirm={handleCreatePlatillo}
      />
    </div>
  )
}