'use client'

import { useState } from 'react'
import { usePedidos } from '@/hooks/usePedidos'
import { useMenu } from '@/hooks/useMenu'
import { MagnifyingGlassIcon, PlusIcon, EyeIcon } from '@heroicons/react/24/outline'
import NewOrderModal from '@/components/NewOrderModal'
import OrderDetailsModal from '@/components/OrderDetailsModal'
import { Pedido } from '@/services/pedidosService'

export default function PedidosPage() {
  const { pedidos, isLoading: pedidosLoading, error: pedidosError, createPedido, updatePedido } = usePedidos()
  const { platillos, isLoading: platillosLoading } = useMenu()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'todos' | 'pendiente' | 'confirmado' | 'entregado'>('todos')
  const [selectedOrder, setSelectedOrder] = useState<Pedido | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false)

  const filteredPedidos = pedidos.filter(pedido => {
    const matchesSearch = pedido.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (pedido.notas && pedido.notas.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesTab = activeTab === 'todos' || pedido.estado === activeTab
    return matchesSearch && matchesTab
  })

  const handleViewOrder = (pedido: Pedido) => {
    setSelectedOrder(pedido)
    setIsDetailsModalOpen(true)
  }

  const handleStatusChange = async (pedidoId: string, newStatus: string) => {
    const result = await updatePedido(pedidoId, { estado: newStatus as any })
    if (result.success) {
      setIsDetailsModalOpen(false)
      setSelectedOrder(null)
      console.log('✅ Estado del pedido actualizado')
    } else {
      alert(result.error || 'Error al actualizar pedido')
    }
  }

  const handleNewOrder = async (customerName: string, items: any[]) => {
    const detalles = items.map(item => ({
      platilloId: item.id,
      cantidad: item.quantity,
      notasEspeciales: item.notes
    }))

    const result = await createPedido({
      notas: `Cliente: ${customerName}`,
      detalles
    })

    if (result.success) {
      setIsNewOrderModalOpen(false)
      console.log('✅ Pedido creado exitosamente')
    } else {
      alert(result.error || 'Error al crear pedido')
    }
  }

  if (pedidosLoading || platillosLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Cargando pedidos...</p>
          </div>
        </div>
      </div>
    )
  }

  if (pedidosError) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <p className="text-red-400 mb-4">{pedidosError}</p>
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
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Pedidos</h1>
          <p className="text-gray-400 mt-1">Gestión de pedidos activos y historial</p>
        </div>
        <button 
          onClick={() => setIsNewOrderModalOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          Nuevo Pedido
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar pedidos por ID o notas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <h3 className="text-gray-400 text-sm font-medium">Total Pedidos</h3>
          <p className="text-2xl font-bold text-white">{pedidos.length}</p>
        </div>
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <h3 className="text-gray-400 text-sm font-medium">Pendientes</h3>
          <p className="text-2xl font-bold text-yellow-400">
            {pedidos.filter(p => p.estado === 'pendiente').length}
          </p>
        </div>
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <h3 className="text-gray-400 text-sm font-medium">Confirmados</h3>
          <p className="text-2xl font-bold text-blue-400">
            {pedidos.filter(p => p.estado === 'confirmado').length}
          </p>
        </div>
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <h3 className="text-gray-400 text-sm font-medium">Entregados</h3>
          <p className="text-2xl font-bold text-green-400">
            {pedidos.filter(p => p.estado === 'entregado').length}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-900 p-1 rounded-xl border border-gray-800">
          {[
            { key: 'todos', label: 'Todos' },
            { key: 'pendiente', label: 'Pendientes' },
            { key: 'confirmado', label: 'Confirmados' },
            { key: 'entregado', label: 'Entregados' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                  ID Pedido
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredPedidos.length > 0 ? (
                filteredPedidos.map((pedido) => (
                  <tr key={pedido.id} className="hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      #{pedido.id.slice(-6)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        pedido.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                        pedido.estado === 'confirmado' ? 'bg-blue-100 text-blue-800' :
                        pedido.estado === 'entregado' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {pedido.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(pedido.createdAt).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {pedido.detalles.length} items
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      ${pedido.detalles.reduce((sum, item) => 
                        sum + (item.platillo.precio * item.cantidad), 0
                      ).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <button
                        onClick={() => handleViewOrder(pedido)}
                        className="text-orange-400 hover:text-orange-300 transition-colors"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-gray-400">
                      <div className="text-4xl mb-2">📋</div>
                      <p className="mb-4">No se encontraron pedidos</p>
                      <button 
                        onClick={() => setIsNewOrderModalOpen(true)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Crear primer pedido
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <NewOrderModal
        isOpen={isNewOrderModalOpen}
        onClose={() => setIsNewOrderModalOpen(false)}
        products={platillos.map(p => ({
          id: p.id,
          name: p.nombre,
          price: p.precio,
          category: p.categoria
        }))}
        onConfirm={handleNewOrder}
      />

      <OrderDetailsModal
        isOpen={isDetailsModalOpen}
        order={selectedOrder ? {
          id: selectedOrder.id,
          orderNumber: `#${selectedOrder.id.slice(-6)}`,
          customer: selectedOrder.notas?.includes('Cliente:') ? 
            selectedOrder.notas.split('Cliente:')[1].trim() : 'Cliente',
          time: new Date(selectedOrder.createdAt).toLocaleTimeString(),
          status: selectedOrder.estado as any,
          total: selectedOrder.detalles.reduce((sum, item) => 
            sum + (item.platillo.precio * item.cantidad), 0),
          items: selectedOrder.detalles.map(item => ({
            id: item.id,
            name: item.platillo.nombre,
            quantity: item.cantidad,
            price: item.platillo.precio,
            notes: item.notasEspeciales
          }))
        } : null}
        onClose={() => {
          setIsDetailsModalOpen(false)
          setSelectedOrder(null)
        }}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}