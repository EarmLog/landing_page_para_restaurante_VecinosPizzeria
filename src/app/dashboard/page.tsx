/**
 * Comandera / Punto de Venta (POS) de Vecino's Pizzería
 * Muestra los pedidos guardados en la base local y permite editar:
 * estado, cantidad de items, notas del cliente, tipo de pedido y exportar a PDF.
 */

'use client';

import { useEffect, useState } from 'react';
import { useDb } from '@/context/DbContext';
import { listarPedidosLocales, type PedidoLocal } from '@/lib/servicioPedidos';
import { formatearMoneda } from '@/lib/utils';
import { toast } from 'sonner';
import Boton from '@/components/ui/Boton';
import ModalContainer from '@/components/ModalContainer';
import { jsPDF } from 'jspdf';

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
  const [pedidoEditando, setPedidoEditando] = useState<PedidoLocal | null>(null);

  useEffect(() => {
    if (!isReady) return;
    let montado = true;

    const cargar = async () => {
      setCargando(true);
      try {
        const locales = await listarPedidosLocales();
        if (!montado) return;
        setPedidos(locales);
      } finally {
        if (!montado) return;
        setCargando(false);
      }
    };

    cargar();

    return () => {
      montado = false;
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

  const editarPedido = async (pedido: PedidoLocal, cambios: Partial<PedidoLocal>) => {
    if (pedido.id === undefined) return;
    try {
      const actualizado = await db.update('pedidos', pedido.id, cambios);
      if (actualizado) {
        toast.success('Pedido actualizado');
        setPedidoEditando(null);
        setRecarga((valor) => valor + 1);
      } else {
        toast.error('No se pudo actualizar el pedido');
      }
    } catch {
      toast.error('Error actualizando el pedido');
    }
  };

  const eliminarPedido = async (id: number) => {
    if (!confirm('¿Eliminar este pedido permanentemente?')) return;
    try {
      const ok = await db.delete('pedidos', id);
      if (ok) {
        toast.success('Pedido eliminado');
        setRecarga((valor) => valor + 1);
      } else {
        toast.error('No se pudo eliminar');
      }
    } catch {
      toast.error('Error eliminando el pedido');
    }
  };

  const exportarPDF = (pedido: PedidoLocal) => {
    const doc = new jsPDF();
    const fecha = new Date(pedido.creado_en ?? Date.now()).toLocaleString('es-VE');

    doc.setFontSize(20);
    doc.setTextColor(230, 88, 12);
    doc.text("Vecino's Pizzería", 20, 20);
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text('Comprobante de Pedido', 20, 35);
    doc.text('Fecha: ' + fecha, 20, 45);
    doc.text('Número: ' + pedido.numeroPedido, 20, 55);
    doc.text('Cliente: ' + (pedido.clienteNombre || 'Mostrador'), 20, 65);
    doc.text('Tipo: ' + pedido.tipoPedido, 20, 75);

    doc.setFontSize(14);
    doc.setTextColor(31, 41, 55);
    doc.text('Items:', 20, 90);

    let y = 100;
    (pedido.items ?? []).forEach((item) => {
      doc.setFontSize(11);
      doc.text(item.nombre + ' x' + item.cantidad, 20, y);
      doc.text(formatearMoneda(item.precio * item.cantidad), 160, y, { align: 'right' });
      y += 10;
    });

    doc.setLineWidth(0.5);
    doc.line(20, y + 5, 190, y + 5);
    y += 15;
    doc.setFontSize(12);
    doc.setTextColor(230, 88, 12);
    doc.text('Total:', 20, y);
    doc.text(formatearMoneda(pedido.total), 160, y, { align: 'right' });

    const nombreArchivo = `pedido-${pedido.numeroPedido}.pdf`;
    doc.save(nombreArchivo);
    toast.success('PDF descargado: ' + nombreArchivo);
  };

  const pedidosFiltrados =
    filtroEstado === 'todos'
      ? pedidos
      : pedidos.filter((p) => p.estado === filtroEstado);

  return (
    <div className="min-h-screen bg-vecinos-crema pt-6 md:pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-vecinos-texto mb-1">
              Comandera - Punto de Venta
            </h1>
            <p className="text-vecinos-texto-claro">
              Gestión de pedidos en caja y edición de órdenes
            </p>
          </div>
          <div className="flex gap-2">
            <Boton onClick={() => setFiltroEstado('todos')}>
              Refrescar
            </Boton>
          </div>
        </div>

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
                  className="bg-white rounded-2xl shadow-vecinos p-5 border border-orange-50"
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
                      {(pedido.items ?? []).map((item) => `${item.nombre} x${item.cantidad}`).join(', ') || 'Sin items'}
                    </p>
                    {pedido.notas && (
                      <p className="text-xs text-vecinos-texto-claro italic mt-1">
                        Notas: {pedido.notas}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-100 mb-3">
                    <span className="text-lg font-bold text-vecinos-naranja">
                      {formatearMoneda(pedido.total)}
                    </span>
                    <button
                      onClick={() => avanzarEstado(pedido)}
                      disabled={!puedeAvanzar}
                      className="bg-vecinos-naranja text-white px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {puedeAvanzar ? 'Cambiar estado' : 'Finalizado'}
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setPedidoEditando(pedido)}
                      className="flex-1 bg-white text-vecinos-naranja border border-orange-200 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => exportarPDF(pedido)}
                      className="flex-1 bg-vecinos-rojo text-white px-3 py-2 rounded-xl text-xs font-semibold hover:bg-red-700 transition-colors"
                    >
                      📄 PDF
                    </button>
                    <button
                      onClick={() => eliminarPedido(pedido.id ?? 0)}
                      className="flex-1 bg-red-50 text-red-600 border border-red-100 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-red-100 transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de edición de pedido */}
      {pedidoEditando && (
        <ModalContainer
          abierto={Boolean(pedidoEditando)}
          alCerrar={() => setPedidoEditando(null)}
          titulo={`Editar ${pedidoEditando.numeroPedido}`}
        >
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-vecinos-texto-claro uppercase mb-1">
                Cliente
              </label>
              <input
                name="clienteNombre"
                value={pedidoEditando.clienteNombre ?? ''}
                onChange={(e) =>
                  setPedidoEditando({ ...pedidoEditando, clienteNombre: e.target.value })
                }
                placeholder="Nombre del cliente"
                className="w-full px-4 py-3 rounded-xl border border-orange-200 bg-white text-sm text-vecinos-texto focus:ring-2 focus:ring-vecinos-naranja"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-vecinos-texto-claro uppercase mb-1">
                Tipo de pedido
              </label>
              <select
                value={pedidoEditando.tipoPedido}
                onChange={(e) =>
                  setPedidoEditando({
                    ...pedidoEditando,
                    tipoPedido: e.target.value as 'mesa' | 'domicilio' | 'recoger',
                  })
                }
                className="w-full px-4 py-2 rounded-xl border border-orange-200 bg-white text-sm text-vecinos-texto focus:ring-2 focus:ring-vecinos-naranja"
              >
                <option value="mesa">Mesa</option>
                <option value="domicilio">Domicilio</option>
                <option value="recoger">Para llevar</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-vecinos-texto-claro uppercase mb-1">
                Notas del pedido
              </label>
              <textarea
                value={pedidoEditando.notas ?? ''}
                onChange={(e) =>
                  setPedidoEditando({ ...pedidoEditando, notas: e.target.value })
                }
                placeholder="Notas adicionales..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-orange-200 bg-white text-sm text-vecinos-texto focus:ring-2 focus:ring-vecinos-naranja"
              />
            </div>
            <div className="pt-4 border-t border-orange-100">
              <p className="text-xs font-bold text-vecinos-texto-claro uppercase mb-3">
                Items del pedido
              </p>
              <div className="space-y-3">
                {(pedidoEditando.items ?? []).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-orange-25 rounded-xl border border-orange-100"
                  >
                    <span className="text-sm font-medium text-vecinos-texto">
                      {item.nombre}
                    </span>
                    <div className="flex-1"></div>
                    <span className="text-sm text-vecinos-texto-claro">
                      x{item.cantidad}
                    </span>
                    <span className="text-sm font-bold text-vecinos-naranja">
                      {formatearMoneda(item.precio * item.cantidad)}
                    </span>
                    <button
                      onClick={() => {
                        const nuevos = [...(pedidoEditando.items ?? [])];
                        nuevos.splice(idx, 1);
                        setPedidoEditando({ ...pedidoEditando, items: nuevos });
                      }}
                      className="text-red-500 hover:text-red-700"
                      title="Eliminar item"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-orange-100">
              <span className="text-lg font-bold text-vecinos-naranja">
                Total: {formatearMoneda(pedidoEditando.total)}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    editarPedido(pedidoEditando, {
                      clienteNombre: pedidoEditando.clienteNombre,
                      tipoPedido: pedidoEditando.tipoPedido,
                      notas: pedidoEditando.notas,
                      items: pedidoEditando.items,
                    })
                  }
                  className="bg-vecinos-naranja text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-orange-600"
                >
                  Guardar cambios
                </button>
                <button
                  onClick={() => setPedidoEditando(null)}
                  className="bg-white text-vecinos-texto border border-orange-200 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-orange-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </ModalContainer>
      )}
    </div>
  );
}
