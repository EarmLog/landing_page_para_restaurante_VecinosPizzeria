/**
 * Botón reutilizable de Vecino's Pizzería
 * Soporta variantes de color y tamaños responsivos.
 */

'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

type Variante = 'naranja' | 'rojo' | 'verde' | 'fantasma' | 'secundario';
type Tamano = 'sm' | 'md' | 'lg';

export interface BotonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
  tamano?: Tamano;
  anchoCompleto?: boolean;
}

const variantes: Record<Variante, string> = {
  naranja:
    'bg-vecinos-naranja text-white hover:bg-orange-600 focus-visible:ring-vecinos-naranja',
  rojo: 'bg-vecinos-rojo text-white hover:bg-red-700 focus-visible:ring-vecinos-rojo',
  verde: 'bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-600',
  secundario:
    'bg-white text-vecinos-texto border border-orange-200 hover:bg-vecinos-crema focus-visible:ring-vecinos-naranja',
  fantasma:
    'bg-transparent text-vecinos-naranja hover:bg-orange-100 focus-visible:ring-vecinos-naranja',
};

const tamanos: Record<Tamano, string> = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-5 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

const Boton = forwardRef<HTMLButtonElement, BotonProps>(
  (
    {
      variante = 'naranja',
      tamano = 'md',
      anchoCompleto = false,
      className,
      children,
      ...resto
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-2xl font-semibold',
          'transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
          variantes[variante],
          tamanos[tamano],
          anchoCompleto && 'w-full',
          className
        )}
        {...resto}
      >
        {children}
      </button>
    );
  }
);

Boton.displayName = 'Boton';

export default Boton;
