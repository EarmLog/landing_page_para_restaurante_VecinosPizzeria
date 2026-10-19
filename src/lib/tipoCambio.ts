/**
 * Tipo de cambio USD -> VES para Vecino's Pizzería
 * Fuente: exchangerate-api.com (Servicio Cambio USD VES)
 * API key configurada para el plan gratuito.
 */

const API_KEY = 'becfb2759aa20c88eea88fc3';
const BASE = 'USD';
let cache: { valor: number; actualizado: number } | null = null;
const CACHE_MS = 5 * 60 * 1000; // 5 minutos

export async function obtenerTipoCambioUSDVES(): Promise<number> {
  const ahora = Date.now();
  if (cache && ahora - cache.actualizado < CACHE_MS) {
    return cache.valor;
  }

  try {
    const respuesta = await fetch(
      `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${BASE}/VES`,
      { next: { revalidate: 300 } }
    );
    if (!respuesta.ok) throw new Error('Respuesta no válida del servicio de cambio');
    const datos = await respuesta.json();
    if (datos.result !== 'success') throw new Error(datos['error-type'] || 'Error de cambio');
    const valor = Number(datos.conversion_rate);
    if (!valor || valor <= 0) throw new Error('Tasa inválida');
    cache = { valor, actualizado: ahora };
    return valor;
  } catch (error) {
    console.error('No se pudo obtener el tipo de cambio:', error);
    // Valor de referencia si falla la API
    return 36.5;
  }
}

export function formatearVES(usd: number, tasa: number): string {
  const ves = usd * tasa;
  return new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'VES',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(ves);
}
