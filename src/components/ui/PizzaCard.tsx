/**
 * Card de Pizza reutilizable para el menú digital.
 * Muestra la imagen del producto (SVG profesional o emoji de respaldo).
 */

'use client';

import Link from 'next/link';
import Boton from './Boton';
import { formatearMoneda } from '@/lib/utils';

export interface PizzaCardProps {
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url?: string | null;
  categoria?: string;
  alPersonalizar?: () => void;
}

export default function PizzaCard({
  nombre,
  descripcion,
  precio,
  imagen_url,
  categoria,
  alPersonalizar,
}: PizzaCardProps) {
  return (
    <Link
      href={`/menu?producto=${encodeURIComponent(nombre)}`}
      className="block"
    >
      <div className="bg-white rounded-3xl shadow-vecinos overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-orange-100">
        <div className="relative h-48 bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center overflow-hidden">
          {imagen_url ? (
            <img
              src={imagen_url}
              alt={nombre}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl bg-orange-100">
              🍕
            </div>
          )}
          <span className="absolute top-3 left-3 bg-vecinos-rojo text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-tighter">
            {categoria?.toUpperCase()}
          </span>
        </div>
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-vecinos-texto">{nombre}</h3>
            <span className="text-lg font-bold text-vecinos-naranja">
              {formatearMoneda(precio)}
            </span>
          </div>
          <p className="text-sm text-vecinos-texto-claro mb-4 line-clamp-2">
            {descripcion}
          </p>
          <Boton
            tamano="sm"
            onClick={alPersonalizar}
            anchoCompleto
          >
            Personalizar
          </Boton>
        </div>
      </div>
    </Link>
  );
}
