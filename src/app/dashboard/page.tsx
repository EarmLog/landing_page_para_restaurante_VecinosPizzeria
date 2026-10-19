/**
 * Panel de Control / Comandera para la Pizzería
 */

'use client';

import { useState } from 'react';

const estados = [
  { id: 'pendiente', nombre: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'en_preparacion', nombre: 'En Preparación', color: 'bg-blue-100 text-blue-800' },
  { id: 'listo', nombre: 'Listo', color: 'bg-green-100 text-green-800' },
  { id: 'entregado', nombre: 'Entregado', color: 'bg-gray-100 text-gray-600' },
];

const pedidosMock = [
  {
    id: 1,
    numeroPedido: '#VP-001',
    cliente: 'Juan Pérez',
    tipoPedido: 'Domicilio',
    estado: 'pendiente',
    total: 298,
    productos: ['Margarita x2'],
    hora: '19:45',
  },
  {
    id: 2,
    numeroPedido: '#VP-002',
    cliente: 'María López',
    tipoPedido: 'Recoger',
    estado: 'en_preparacion',
    total: 169,
    productos: ['Pepperoni x1'],
    hora: '19:50',
  },
];

export default function DashboardPage() {
  const [filtroEstado, setFiltroEstado] = useState('pendiente');

  const pedidosFiltrados = pedidosMock.filter(
    (p) => filtroEstado === 'todos' || p.estado === filtroEstado
  );

  return (
    <div className="min-h-screen bg-vecinos-crema pt-6 md:pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-vecinos-texto mb-6">
          Comandera - Punto de Venta
        </h1>

        {/* Filtros de estado */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setFiltroEstado('todos')}
            className={`px-4 py-2 rounded-full font-medium whitespace-nowrap ${
              filtroEstado === 'todos'
                ? 'bg-vecinos-naranja text-white'
                : 'bg-white text-vecinos-texto border border-orange-200'
            }`}
          >
            Todos
          </button>
          {estados.map((estado) => (
            <button
              key={estado.id}
              onClick={() => setFiltroEstado(estado.id)}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap ${
                filtroEstado === estado.id
                  ? 'bg-vecinos-naranja text-white'
                  : 'bg-white text-vecinos-texto border border-orange-200'
              }`}
            >
              {estado.nombre}
            </button>
          ))}
        </div>

        {/* Lista de pedidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pedidosFiltrados.map((pedido) => {
            const estadoInfo = estados.find((e) => e.id === pedido.estado);
            return (
              <div key={pedido.id} className="bg-white rounded-2xl shadow-vecinos p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-vecinos-texto">
                      {pedido.numeroPedido}
                    </h3>
                    <p className="text-sm text-vecinos-texto-claro">
                      {pedido.hora} • {pedido.tipoPedido}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      estadoInfo?.color || 'bg-gray-100'
                    }`}
                  >
                    {estadoInfo?.nombre}
                  </span>
                </div>

                <div className="mb-3">
                  <p className="text-sm font-medium text-vecinos-texto mb-1">
                    {pedido.cliente}
                  </p>
                  <p className="text-sm text-vecinos-texto-claro">
                    {pedido.productos.join(', ')}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <span className="text-lg font-bold text-vecinos-naranja">
                    ${pedido.total} MXN
                  </span>
                  <button className="bg-vecinos-naranja text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors">
                    Cambiar Estado
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {pedidosFiltrados.length === 0 && (
          <div className="text-center py-12">
            <p className="text-vecinos-texto-claro">
              No hay pedidos con este estado
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
