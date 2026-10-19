/**
 * Widget del precio del dólar para el navbar
 * Muestra el tipo de cambio USD -> VES actualizado cada 5 minutos.
 */

'use client';

import { useEffect, useState } from 'react';
import { obtenerTipoCambioUSDVES } from '@/lib/tipoCambio';

export default function PrecioDolar() {
  const [tasa, setTasa] = useState<number | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let montado = true;
    obtenerTipoCambioUSDVES()
      .then((valor) => {
        if (montado) {
          setTasa(valor);
          setCargando(false);
        }
      })
      .catch(() => {
        if (montado) setCargando(false);
      });
    return () => {
      montado = false;
    };
  }, []);

  if (cargando || tasa === null) {
    return (
      <span className="text-xs text-vecinos-texto-claro bg-orange-50 px-2 py-1 rounded-full border border-orange-200 flex items-center gap-1">
        <span className="text-orange-500 animate-pulse rounded-full w-2 h-2"></span>
        Dólar …
      </span>
    );
  }

  return (
    <span className="text-xs font-semibold text-vecinos-texto bg-white/80 backdrop-blur px-2.5 py-1 rounded-full border border-orange-200 shadow-sm">
      $1 = {tasa.toLocaleString('es-VE', { minimumFractionDigits: 2 })} VES
    </span>
  );
}
