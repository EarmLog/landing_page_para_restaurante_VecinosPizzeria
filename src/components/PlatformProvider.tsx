'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Platform, getPlatform } from '@/lib/platformDetector';

interface PlatformContextType {
  platform: Platform;
  isMobile: boolean;
  isWeb: boolean;
  isTauri: boolean;
  isCapacitor: boolean;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  const [platform, setPlatform] = useState<Platform>('web');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setPlatform(getPlatform());
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <PlatformContext.Provider
      value={{
        platform,
        isMobile: platform === 'capacitor' || (typeof window !== 'undefined' && window.innerWidth < 768),
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
