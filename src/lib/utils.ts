/**
 * Utilidad para combinar clases de Tailwind de forma segura
 * Evita conflictos entre clases condicionales.
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...entradas: ClassValue[]): string {
  return twMerge(clsx(entradas));
}

/**
 * Sanitiza un texto proveniente del usuario para evitar inyección de HTML.
 * Elimina etiquetas y caracteres peligrosos.
 */
export function sanitizarTexto(texto: string): string {
  return texto
    .replace(/<[^>]*>/g, '')
    .replace(/[<>]/g, '')
    .trim();
}

/**
 * Valida un correo electrónico con una expresión regular estricta.
 */
export function esCorreoValido(correo: string): boolean {
  const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return patron.test(correo.trim());
}

/**
 * Valida un teléfono local mexicano (10 dígitos permitiendo espacios y guiones).
 */
export function esTelefonoValido(telefono: string): boolean {
  const soloDigitos = telefono.replace(/[\s-()]/g, '');
  return /^\d{10}$/.test(soloDigitos);
}

/**
 * Formatea un número como moneda en pesos mexicanos.
 */
export function formatearMoneda(cantidad: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(cantidad);
}
