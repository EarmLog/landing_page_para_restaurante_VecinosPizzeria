/**
 * Adaptador unificado para base de datos local (Offline-First)
 * Detecta plataforma y ejecuta transacciones: Dexie.js para Web/PWA, SQLite para Tauri/Capacitor
 * Interfaz unificada: get, add, update, delete, bulkAdd
 */

'use client';

import { Platform, getPlatform } from '@/lib/platformDetector';
import { dexieDB } from './dexieSchema';

export type NombreTabla = 'productos' | 'pedidos' | 'clientesFieles';

export interface EstadoDB {
  conectado: boolean;
  cantidadRegistros: {
    productos?: number;
    pedidos?: number;
    clientes?: number;
  };
}

/**
 * Obtiene la colección de Dexie correspondiente al nombre de tabla lógico.
 */
function obtenerColeccion(table: NombreTabla) {
  if (table === 'productos') return dexieDB.productos;
  if (table === 'pedidos') return dexieDB.pedidos;
  if (table === 'clientesFieles') return dexieDB.clientesFieles;
  return null;
}

/**
 * Convierte cualquier registro en un objeto plano serializable.
 */
function aRegistroPlano(registro: unknown): Record<string, unknown> {
  if (registro && typeof registro === 'object') {
    return { ...(registro as Record<string, unknown>) };
  }
  return {};
}

export class DbAdapter {
  private platform: Platform;

  constructor() {
    this.platform = getPlatform();
  }

  /**
   * Obtener todos los registros de una tabla
   */
  async getAll(table: NombreTabla, limit?: number): Promise<Record<string, unknown>[]> {
    try {
      if (this.platform === 'web') {
        const coleccion = obtenerColeccion(table);
        if (!coleccion) throw new Error(`La tabla ${table} no existe`);
        const registros = limit
          ? await coleccion.limit(limit).toArray()
          : await coleccion.toArray();
        return registros.map(aRegistroPlano);
      }
      // Tauri y Capacitor usarán SQLite en una próxima iteración
      return [];
    } catch (error) {
      console.error('Error al obtener datos:', error);
      return [];
    }
  }

  /**
   * Obtener un registro por ID
   */
  async getById(table: NombreTabla, id: number): Promise<Record<string, unknown> | null> {
    try {
      if (this.platform === 'web') {
        const coleccion = obtenerColeccion(table);
        if (!coleccion) throw new Error(`La tabla ${table} no existe`);
        const registro = await coleccion.get(id);
        return registro ? aRegistroPlano(registro) : null;
      }
      return null;
    } catch (error) {
      console.error('Error al obtener registro:', error);
      return null;
    }
  }

  /**
   * Agregar un registro nuevo
   */
  async add(table: NombreTabla, datos: Record<string, unknown>): Promise<number | null> {
    try {
      if (this.platform === 'web') {
        const coleccion = obtenerColeccion(table);
        if (!coleccion) throw new Error(`La tabla ${table} no existe`);
        const entrada = {
          ...datos,
          fechaCreacion: datos.fechaCreacion ?? new Date(),
          fechaActualizacion: new Date(),
          sincronizado: false,
        };
        return (await coleccion.add(entrada as never)) as number;
      }
      return null;
    } catch (error) {
      console.error('Error al agregar registro:', error);
      return null;
    }
  }

  /**
   * Actualizar un registro existente
   */
  async update(
    table: NombreTabla,
    id: number,
    datos: Record<string, unknown>
  ): Promise<boolean> {
    try {
      if (this.platform === 'web') {
        const coleccion = obtenerColeccion(table);
        if (!coleccion) throw new Error(`La tabla ${table} no existe`);
        await coleccion.update(id, {
          ...datos,
          fechaActualizacion: new Date(),
        } as never);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al actualizar registro:', error);
      return false;
    }
  }

  /**
   * Eliminar un registro
   */
  async delete(table: NombreTabla, id: number): Promise<boolean> {
    try {
      if (this.platform === 'web') {
        const coleccion = obtenerColeccion(table);
        if (!coleccion) throw new Error(`La tabla ${table} no existe`);
        await coleccion.delete(id);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al eliminar registro:', error);
      return false;
    }
  }

  /**
   * Agregar múltiples registros de una sola vez
   */
  async bulkAdd(
    table: NombreTabla,
    registros: Record<string, unknown>[]
  ): Promise<number> {
    try {
      if (this.platform === 'web') {
        const coleccion = obtenerColeccion(table);
        if (!coleccion) throw new Error(`La tabla ${table} no existe`);
        const entradas = registros.map((registro) => ({
          ...registro,
          fechaCreacion: registro.fechaCreacion ?? new Date(),
          fechaActualizacion: new Date(),
          sincronizado: false,
        }));
        return await (coleccion.bulkAdd as (items: unknown[]) => Promise<number>)(entradas);
      }
      return 0;
    } catch (error) {
      console.error('Error al agregar múltiples registros:', error);
      return 0;
    }
  }

  /**
   * Obtener registros pendientes de sincronizar con Supabase
   */
  async getPendientesSincronizar(table: NombreTabla): Promise<Record<string, unknown>[]> {
    try {
      if (this.platform === 'web') {
        const coleccion = obtenerColeccion(table);
        if (!coleccion) throw new Error(`La tabla ${table} no existe`);
        const registros = await coleccion.filter((registro) => {
          const plano = aRegistroPlano(registro);
          return plano.sincronizado === false || plano.sincronizado === 0;
        }).toArray();
        return registros.map(aRegistroPlano);
      }
      return [];
    } catch (error) {
      console.error('Error al obtener pendientes de sincronizar:', error);
      return [];
    }
  }

  /**
   * Marcar un registro como sincronizado
   */
  async marcarSincronizado(
    table: NombreTabla,
    id: number,
    idSupabase?: string
  ): Promise<boolean> {
    try {
      if (this.platform === 'web') {
        const coleccion = obtenerColeccion(table);
        if (!coleccion) throw new Error(`La tabla ${table} no existe`);
        await coleccion.update(id, {
          sincronizado: true,
          idSupabase,
          fechaActualizacion: new Date(),
        } as never);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al marcar como sincronizado:', error);
      return false;
    }
  }

  /**
   * Obtener el estado de la base de datos local
   */
  async getEstadoDB(): Promise<EstadoDB> {
    try {
      if (this.platform === 'web') {
        const productos = await dexieDB.productos.count();
        const pedidos = await dexieDB.pedidos.count();
        const clientes = await dexieDB.clientesFieles.count();
        return {
          conectado: true,
          cantidadRegistros: { productos, pedidos, clientes },
        };
      }
      return { conectado: false, cantidadRegistros: {} };
    } catch (error) {
      console.error('Error al obtener el estado de la base de datos:', error);
      return { conectado: false, cantidadRegistros: {} };
    }
  }
}

export const dbAdapter = new DbAdapter();
