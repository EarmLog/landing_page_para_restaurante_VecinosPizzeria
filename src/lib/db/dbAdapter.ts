/**
 * Adaptador unificado para base de datos local (Offline-First)
 * Detecta plataforma y ejecuta transacciones: Dexie.js para Web/PWA, SQLite para Tauri/Capacitor
 * Interfaz unificada: get, add, update, delete, bulkAdd
 */

'use client';

import { Platform, getPlatform } from '@/lib/platformDetector';
import { dexieDB } from './dexieSchema';

export class DbAdapter {
  private platform: Platform;

  constructor() {
    this.platform = getPlatform();
  }

  /**
   * Obtener todos los registros de una tabla
   */
  async getAll(table: string, limit?: number): Promise<any[]> {
    try {
      if (this.platform === 'web') {
        const collection = (dexieDB as any)[table];
        if (!collection) throw new Error(`Tabla ${table} no existe`);
        let query = collection.toArray();
        if (limit) query = collection.limit(limit).toArray();
        return await query;
      } else if (this.platform === 'tauri') {
        // TODO: Implementar con @tauri-apps/plugin-sql
        console.warn('SQLite para Tauri aún no implementado completamente');
        return [];
      } else if (this.platform === 'capacitor') {
        // TODO: Implementar con @capacitor-community/sqlite
        console.warn('SQLite para Capacitor aún no implementado completamente');
        return [];
      }
      return [];
    } catch (error) {
      console.error('Error al obtener datos:', error);
      return [];
    }
  }

  /**
   * Obtener un registro por ID
   */
  async getById(table: string, id: any): Promise<any | null> {
    try {
      if (this.platform === 'web') {
        const collection = (dexieDB as any)[table];
        if (!collection) throw new Error(`Tabla ${table} no existe`);
        return await collection.get(id) || null;
      }
      return null;
    } catch (error) {
      console.error('Error al obtener registro:', error);
      return null;
    }
  }

  /**
   * Agregar un registro
   */
  async add(table: string, data: any): Promise<any> {
    try {
      if (this.platform === 'web') {
        const collection = (dexieDB as any)[table];
        if (!collection) throw new Error(`Tabla ${table} no existe`);
        const id = await collection.add({
          ...data,
          fechaCreacion: data.fechaCreacion || new Date(),
          fechaActualizacion: new Date(),
          sincronizado: false,
        });
        return { id, ...data };
      }
      return null;
    } catch (error) {
      console.error('Error al agregar registro:', error);
      throw error;
    }
  }

  /**
   * Actualizar un registro
   */
  async update(table: string, id: any, data: any): Promise<boolean> {
    try {
      if (this.platform === 'web') {
        const collection = (dexieDB as any)[table];
        if (!collection) throw new Error(`Tabla ${table} no existe`);
        await collection.update(id, {
          ...data,
          fechaActualizacion: new Date(),
        });
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
  async delete(table: string, id: any): Promise<boolean> {
    try {
      if (this.platform === 'web') {
        const collection = (dexieDB as any)[table];
        if (!collection) throw new Error(`Tabla ${table} no existe`);
        await collection.delete(id);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al eliminar registro:', error);
      return false;
    }
  }

  /**
   * Agregar múltiples registros
   */
  async bulkAdd(table: string, items: any[]): Promise<number> {
    try {
      if (this.platform === 'web') {
        const collection = (dexieDB as any)[table];
        if (!collection) throw new Error(`Tabla ${table} no existe`);
        const itemsWithDates = items.map(item => ({
          ...item,
          fechaCreacion: item.fechaCreacion || new Date(),
          fechaActualizacion: new Date(),
          sincronizado: false,
        }));
        return await collection.bulkAdd(itemsWithDates);
      }
      return 0;
    } catch (error) {
      console.error('Error al agregar múltiples registros:', error);
      return 0;
    }
  }

  /**
   * Obtener registros no sincronizados
   */
  async getPendientesSincronizar(table: string): Promise<any[]> {
    try {
      if (this.platform === 'web') {
        const collection = (dexieDB as any)[table];
        if (!collection) throw new Error(`Tabla ${table} no existe`);
        return await collection.where('sincronizado').equals(0).toArray();
      }
      return [];
    } catch (error) {
      console.error('Error al obtener pendientes:', error);
      return [];
    }
  }

  /**
   * Marcar registro como sincronizado
   */
  async marcarSincronizado(table: string, id: any, idSupabase?: string): Promise<boolean> {
    try {
      if (this.platform === 'web') {
        const collection = (dexieDB as any)[table];
        if (!collection) throw new Error(`Tabla ${table} no existe`);
        await collection.update(id, {
          sincronizado: true,
          idSupabase: idSupabase || undefined,
          fechaActualizacion: new Date(),
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al marcar sincronizado:', error);
      return false;
    }
  }

  /**
   * Obtener el estado de la base de datos
   */
  async getEstadoDB(): Promise<{ conectado: boolean; cantidadRegistros: any }> {
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
      console.error('Error al obtener estado DB:', error);
      return { conectado: false, cantidadRegistros: {} };
    }
  }
}

export const dbAdapter = new DbAdapter();
