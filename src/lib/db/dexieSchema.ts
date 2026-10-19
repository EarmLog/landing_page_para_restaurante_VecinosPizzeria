/**
 * Esquema IndexedDB usando Dexie.js para Web/PWA
 * Base de datos local offline-first para continuidad en caja/menú
 */

import Dexie, { Table } from 'dexie';

export interface Producto {
  id?: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  precio: number;
  ingredientes: string[];
  disponible: boolean;
  imagen?: string;
  sincronizado: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export interface Pedido {
  id?: number;
  numeroPedido: string;
  clienteNombre?: string;
  clienteTelefono?: string;
  clienteEmail?: string;
  tipoPedido: 'mesa' | 'domicilio' | 'recoger';
  productos: any[];
  subtotal: number;
  descuento: number;
  total: number;
  estado: 'pendiente' | 'en_preparacion' | 'listo' | 'entregado' | 'cancelado';
  notas?: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  sincronizado: boolean;
  idSupabase?: string;
}

export interface ClienteFiel {
  id?: number;
  nombre: string;
  telefono: string;
  email?: string;
  puntos: number;
  fechaRegistro: Date;
  sincronizado: boolean;
}

export interface Configuracion {
  id?: number;
  clave: string;
  valor: string;
  fechaActualizacion: Date;
}

export class VecinosPizzeriaDB extends Dexie {
  productos!: Table<Producto>;
  pedidos!: Table<Pedido>;
  clientesFieles!: Table<ClienteFiel>;
  configuracion!: Table<Configuracion>;

  constructor() {
    super('vecinos_pizzeria_db');
    this.version(1).stores({
      productos: '++id, codigo, nombre, categoria, disponible, sincronizado',
      pedidos: '++id, numeroPedido, estado, tipoPedido, fechaCreacion, sincronizado',
      clientesFieles: '++id, telefono, email, puntos, sincronizado',
      configuracion: '++id, clave, &valor, fechaActualizacion',
    });
  }
}

export const dexieDB = new VecinosPizzeriaDB();
