/**
 * Detector de plataforma para la aplicación híbrida Vecino's Pizzería
 * Detecta si la app se ejecuta en Web (PWA), Tauri (Escritorio) o Capacitor (Android)
 */

export type Platform = 'web' | 'tauri' | 'capacitor';

export function getPlatform(): Platform {
  if (typeof window === 'undefined') {
    return 'web';
  }

  // Detección para Tauri 2.0
  if ((window as any).__TAURI__ !== undefined) {
    return 'tauri';
  }

  // Detección para Capacitor
  if ((window as any).Capacitor !== undefined || (window as any).cordova !== undefined) {
    return 'capacitor';
  }

  return 'web';
}

export function isTauri(): boolean {
  return getPlatform() === 'tauri';
}

export function isCapacitor(): boolean {
  return getPlatform() === 'capacitor';
}

export function isWeb(): boolean {
  return getPlatform() === 'web';
}
