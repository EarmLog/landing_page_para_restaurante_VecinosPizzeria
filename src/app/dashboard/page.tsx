/**
 * Comandera / Punto de Venta (POS) de Vecino's Pizzería
 * Muestra los pedidos guardados en la base local y permite cambiar su estado.
 */

'use client';

import { useEffect, useState } from 'react';import { toast } from 'sonner';
import { useDb } from '@/context/DbContext';
import { listarPedidosLocales, type PedidoLocal } from '@/lib/servicioPedidos';
import { formatearMoneda } from '@/lib/utils';

const estados = [
  { id: 'pendiente', nombre: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'en_preparacion', nombre: 'En preparación', color: 'bg-blue-100 text-blue-800' },
  { id: 'listo', nombre: 'Listo', color: 'bg-green-100 text-green-800' },
  { id: 'entregado', nombre: 'Entregado', color: 'bg-gray-100 text-gray-700' },
  { id: 'cancelado', nombre: 'Cancelado', color: 'bg-red-100 text-red-700' },
];

const siguienteEstado: Record<string, string> = {
  pendiente: 'en_preparacion',
  en_preparacion: 'listo',
  listo: 'entregado',
};

export default function DashboardPage() {
  const { db, isReady } = useDb();
  const [pedidos, setPedidos] = useState<PedidoLocal[]>([]);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [cargando, setCargando] = useState(true);
  const [recarga, setRecarga] = useState(0);

  useEffect(() => {
    if (!isReady) return;
    let activo = true;

    const cargar = async () => {
      const locales = await listarPedidosLocales();
      if (!activo) return;
      setPedidos(locales);
      setCargando(false);
    };

    cargar();

    return () => {
      activo = false;
    };
  }, [isReady, recarga]);

  const avanzarEstado = async (pedido: PedidoLocal) => {
    const nuevoEstado = siguienteEstado[pedido.estado] ?? pedido.estado;
    if (pedido.id === undefined) return;

    const actualizado = await db.update('pedidos', pedido.id, { estado: nuevoEstado });
    if (actualizado) {
      toast.success(`Pedido ${pedido.numeroPedido} marcado como ${nuevoEstado.replace('_', ' ')}`);
      setRecarga((valor) => valor + 1);
    } else {
      toast.error('No se pudo actualizar el pedido');
    }
  };

  const pedidosFiltrados =
    filtroEstado === 'todos'
      ? pedidos
      : pedidos.filter((p) => p.estado === filtroEstado);

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
            Todos ({pedidos.length})
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

        {cargando ? (
          <p className="text-vecinos-texto-claro">Cargando pedidos...</p>
        ) : pedidosFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-vecinos-texto-claro">No hay pedidos con este estado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pedidosFiltrados.map((pedido) => {
              const estadoInfo = estados.find((e) => e.id === pedido.estado);
              const puedeAvanzar = Boolean(siguienteEstado[pedido.estado]);
              return (
                <div
                  key={pedido.id ?? pedido.numeroPedido}
                  className="bg-white rounded-2xl shadow-vecinos p-5"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-vecinos-texto">
                        {pedido.numeroPedido}
                      </h3>
                      <p className="text-sm text-vecinos-texto-claro capitalize">
                        {pedido.tipoPedido}
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
                      {pedido.clienteNombre || 'Cliente mostrador'}
                    </p>
                    <p className="text-sm text-vecinos-texto-claro">
                      {pedido.items?.map((item) => `${item.nombre} x${item.cantidad}`).join(', ')}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <span className="text-lg font-bold text-vecinos-naranja">
                      {formatearMoneda(pedido.total)}
                    </span>
                    <button
                      onClick={() => avanzarEstado(pedido)}
                      disabled={!puedeAvanzar}
                      className="bg-vecinos-naranja text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {puedeAvanzar ? 'Cambiar estado' : 'Finalizado'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
