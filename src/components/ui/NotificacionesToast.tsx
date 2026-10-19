/**
 * Notificaciones tipo Toast en español para toda la aplicación
 * Envuelve el componente Toaster de Sonner con el estilo de Vecino's.
 */

'use client';

import { Toaster } from 'sonner';

export default function NotificacionesToast() {
  return (
    <Toaster
      position="top-center"
      richColors
      closeButton
      toastOptions={{
        style: {
          borderRadius: '1rem',
          fontFamily: 'inherit',
        },
      }}
    />
  );
}
