/**
 * Servicio de menú: combina Supabase (nube) con la base local (offline-first).
 * Primero intenta traer el menú de Supabase; si falla, usa lo guardado en Dexie.
 */

'use client';

import { supabase } from './supabaseClient';
import { dbAdapter } from './db/dbAdapter';

export interface ProductoMenu {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  ingredientes: string[];
  imagen_url: string | null;
  categoria: string;
}

interface ProductoDB {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  ingredientes: string[];
  imagen_url: string | null;
  categorias: { nombre: string } | { nombre: string }[] | null;
}

/**
 * Normaliza la relación de categorías, que Supabase puede devolver
 * como objeto o como arreglo según la consulta.
 */
function nombreCategoria(
  categoria: ProductoDB['categorias']
): string {
  if (!categoria) return 'Sin categoría';
  if (Array.isArray(categoria)) {
    return categoria[0]?.nombre ?? 'Sin categoría';
  }
  return categoria.nombre ?? 'Sin categoría';
}

/**
 * Descarga el menú desde Supabase y lo guarda en la base local como respaldo.
 */
export async function obtenerMenu(): Promise<{
  productos: ProductoMenu[];
  origen: 'nube' | 'local';
}> {
  try {
    const { data, error } = await supabase
      .from('productos')
      .select(
        'id, codigo, nombre, descripcion, precio, ingredientes, imagen_url, categorias(nombre)'
      )
      .eq('disponible', true);

    if (error) throw error;

    const productos: ProductoMenu[] = (data as unknown as ProductoDB[]).map((p) => ({
      id: p.id,
      codigo: p.codigo,
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: Number(p.precio),
      ingredientes: p.ingredientes ?? [],
      imagen_url: p.imagen_url,
      categoria: nombreCategoria(p.categorias),
    }));

    // Guardar respaldo local para consultas offline
    await guardarMenuLocal(productos);

    return { productos, origen: 'nube' };
  } catch (error) {
    console.warn('No se pudo obtener el menú de la nube, usando respaldo local:', error);
    const locales = await obtenerMenuLocal();
    return { productos: locales, origen: 'local' };
  }
}

/**
 * Persiste el menú en la base de datos local, reemplazando lo anterior.
 */
async function guardarMenuLocal(productos: ProductoMenu[]): Promise<void> {
  try {
    const existentes = await dbAdapter.getAll('productos');
    for (const producto of existentes) {
      if (typeof producto.id === 'number') {
        await dbAdapter.delete('productos', producto.id);
      }
    }

    await dbAdapter.bulkAdd(
      'productos',
      productos.map((p) => ({
        codigo: p.codigo,
        nombre: p.nombre,
        descripcion: p.descripcion ?? '',
        categoria: p.categoria,
        precio: p.precio,
        ingredientes: p.ingredientes,
        disponible: true,
        imagen: p.imagen_url ?? undefined,
      }))
    );
  } catch (error) {
    console.warn('No se pudo guardar el menú en la base local:', error);
  }
}

/**
 * Lee el menú guardado localmente (Dexie/SQLite).
 */
async function obtenerMenuLocal(): Promise<ProductoMenu[]> {
  const registros = await dbAdapter.getAll('productos');
  return registros.map((registro) => ({
    id: String(registro.id ?? ''),
    codigo: String(registro.codigo ?? ''),
    nombre: String(registro.nombre ?? ''),
    descripcion: (registro.descripcion as string) ?? null,
    precio: Number(registro.precio ?? 0),
    ingredientes: Array.isArray(registro.ingredientes)
      ? (registro.ingredientes as string[])
      : [],
    imagen_url: (registro.imagen as string) ?? null,
    categoria: String(registro.categoria ?? 'Sin categoría'),
  }));
}
