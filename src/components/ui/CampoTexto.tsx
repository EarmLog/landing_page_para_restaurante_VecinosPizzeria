/**
 * Campo de entrada reutilizable con etiqueta y validación visual.
 */

'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface CampoTextoProps extends InputHTMLAttributes<HTMLInputElement> {
  etiqueta?: string;
  error?: string;
}

const CampoTexto = forwardRef<HTMLInputElement, CampoTextoProps>(
  ({ etiqueta, error, className, id, ...props }, ref) => {
    const identificador = id || props.name;

    return (
      <div className="w-full">
        {etiqueta && (
          <label
            htmlFor={identificador}
            className="block text-sm font-medium text-vecinos-texto mb-1"
          >
            {etiqueta}
          </label>
        )}
        <input
          ref={ref}
          id={identificador}
          className={cn(
            'w-full px-4 py-3 rounded-xl border bg-white text-vecinos-texto',
            'focus:outline-none focus:ring-2 focus:ring-vecinos-naranja transition',
            error ? 'border-red-400' : 'border-orange-200',
            className
          )}
          aria-invalid={Boolean(error)}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

CampoTexto.displayName = 'CampoTexto';

export default CampoTexto;
