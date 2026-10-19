/**
 * Contenedor Modal Universal con fondo difuminado (backdrop-blur)
 * Se usa para personalizar pizzas, login y confirmación de pedidos.
 */

'use client';

import { useEffect, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ModalContainerProps {
  abierto: boolean;
  alCerrar: () => void;
  titulo?: string;
  children: ReactNode;
  className?: string;
}

export default function ModalContainer({
  abierto,
  alCerrar,
  titulo,
  children,
  className,
}: ModalContainerProps) {
  // Cerrar el modal con la tecla Escape y bloquear el scroll de fondo
  useEffect(() => {
    if (!abierto) return;

    const manejarTecla = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') alCerrar();
    };

    document.addEventListener('keydown', manejarTecla);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', manejarTecla);
      document.body.style.overflow = '';
    };
  }, [abierto, alCerrar]);

  if (!abierto) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label={titulo || 'Diálogo'}
      onClick={alCerrar}
    >
      <div
        className={cn(
          'w-full max-w-lg bg-white rounded-3xl shadow-vecinos p-6',
          'max-h-[90vh] overflow-y-auto animate-[aparecer_0.2s_ease-out]',
          className
        )}
        onClick={(evento) => evento.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          {titulo && (
            <h2 className="text-xl font-bold text-vecinos-texto">{titulo}</h2>
          )}
          <button
            onClick={alCerrar}
            aria-label="Cerrar"
            className="ml-auto text-vecinos-texto-claro hover:text-vecinos-texto text-2xl leading-none"
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
