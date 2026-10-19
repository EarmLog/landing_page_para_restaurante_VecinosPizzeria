/**
 * Card de Pizza reutilizable para el menú digital.
 */

'use client';

import Boton from './Boton';
import { formatearMoneda } from '@/lib/utils';

export interface PizzaCardProps {
  nombre: string;
  descripcion: string;
  precio: number;
  emoji?: string;
  alPersonalizar?: () => void;
}

export default function PizzaCard({
  nombre,
  descripcion,
  precio,
  emoji = '🍕',
  alPersonalizar,
}: PizzaCardProps) {
  return (
    <div className="bg-white rounded-3xl shadow-vecinos overflow-hidden hover:transform hover:scale-105 transition-all">
      <div className="h-40 bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center text-6xl">
        {emoji}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-vecinos-texto mb-1">{nombre}</h3>
        <p className="text-sm text-vecinos-texto-claro mb-3">{descripcion}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-vecinos-naranja">
            {formatearMoneda(precio)}
          </span>
          <Boton tamano="sm" onClick={alPersonalizar}>
            Personalizar
          </Boton>
        </div>
      </div>
    </div>
  );
}
