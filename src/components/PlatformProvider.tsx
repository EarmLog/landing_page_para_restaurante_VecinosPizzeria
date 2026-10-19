'use client';

import { createContext, useContext, useSyncExternalStore } from 'react';
import { Platform, getPlatform } from '@/lib/platformDetector';

interface PlatformContextType {
  platform: Platform;
  isMobile: boolean;
  isWeb: boolean;
  isTauri: boolean;
  isCapacitor: boolean;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

/**
 * Suscripción de plataforma. La plataforma no cambia durante la
 * ejecución, por lo que no requiere listeners reales.
 */
function subscribePlatform(callback: () => void) {
  return () => callback();
}

function getPlatformSnapshot(): Platform {
  return getPlatform();
}

function getPlatformServerSnapshot(): Platform {
  return 'web';
}

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  const platform = useSyncExternalStore(
    subscribePlatform,
    getPlatformSnapshot,
    getPlatformServerSnapshot
  );

  return (
    <PlatformContext.Provider
      value={{
        platform,
        isMobile: platform === 'capacitor',
        isWeb: platform === 'web',
        isTauri: platform === 'tauri',
        isCapacitor: platform === 'capacitor',
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatform() {
  const context = useContext(PlatformContext);
  if (context === undefined) {
    throw new Error('usePlatform debe ser usado dentro de PlatformProvider');
  }
  return context;
}
