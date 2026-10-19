/**
 * Servicio de pedidos (comandera POS).
 * Guarda los pedidos en la base local primero (offline-first) y luego
 * intenta enviarlos a Supabase. Si no hay conexión, quedan pendientes.
 */

'use client';

import { supabase } from './supabaseClient';
import { dbAdapter } from './db/dbAdapter';

export interface NuevoPedido {
  numeroPedido: string;
  clienteNombre?: string;
  clienteTelefono?: string;
  tipoPedido: 'mesa' | 'domicilio' | 'recoger';
  items: { nombre: string; cantidad: number; precio: number }[];
  subtotal: number;
  descuento: number;
  total: number;
  notas?: string;
  direccion?: string;
}

export interface PedidoLocal extends NuevoPedido {
  id?: number;
  estado: string;
  creado_en: string;
}

/**
 * Genera un número de pedido legible para el mostrador.
 */
export function generarNumeroPedido(): string {
  const ahora = new Date();
  const marca = `${ahora.getHours()}${ahora.getMinutes()}${ahora.getSeconds()}`;
  return `VP-${marca}`;
}

/**
 * Registra un pedido de forma local y trata de sincronizarlo con la nube.
 */
export async function registrarPedido(pedido: NuevoPedido): Promise<{
  guardadoLocal: boolean;
  sincronizado: boolean;
}> {
  const idLocal = await dbAdapter.add('pedidos', {
    ...pedido,
    estado: 'pendiente',
    creado_en: new Date().toISOString(),
  });

  const sincronizado = await enviarPedido(pedido);
  if (sincronizado && typeof idLocal === 'number') {
    await dbAdapter.marcarSincronizado('pedidos', idLocal);
  }

  return { guardadoLocal: idLocal !== null, sincronizado };
}

/**
 * Envía un pedido a Supabase (pedido + su detalle).
 */
async function enviarPedido(pedido: NuevoPedido): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('pedidos')
      .insert({
        numero_pedido: pedido.numeroPedido,
        cliente_nombre: pedido.clienteNombre,
        cliente_telefono: pedido.clienteTelefono,
        tipo_pedido: pedido.tipoPedido,
        subtotal: pedido.subtotal,
        descuento: pedido.descuento,
        total: pedido.total,
        notas: pedido.notas,
        direccion: pedido.direccion,
      })
      .select('id')
      .single();

    if (error) throw error;

    if (data?.id && pedido.items.length > 0) {
      await supabase.from('pedido_items').insert(
        pedido.items.map((item) => ({
          pedido_id: data.id,
          nombre_producto: item.nombre,
          cantidad: item.cantidad,
          precio_unitario: item.precio,
        }))
      );
    }

    return true;
  } catch (error) {
    console.warn('El pedido no pudo enviarse a la nube, quedó pendiente:', error);
    return false;
  }
}

/**
 * Lista los pedidos guardados localmente, del más reciente al más antiguo.
 */
export async function listarPedidosLocales(): Promise<PedidoLocal[]> {
  const registros = await dbAdapter.getAll('pedidos');
  return registros
    .map((registro) => registro as unknown as PedidoLocal)
    .sort((a, b) => (a.creado_en < b.creado_en ? 1 : -1));
}
