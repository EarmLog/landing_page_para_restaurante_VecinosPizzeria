/**
 * Contexto para manejo de base de datos local
 * Proporciona acceso unificado a la capa de abstracción dbAdapter
 */

'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { dbAdapter, EstadoDB } from '@/lib/db/dbAdapter';

interface DbContextType {
  db: typeof dbAdapter;
  isReady: boolean;
  estadoDB: EstadoDB;
  refrescarEstado: () => Promise<void>;
}

const DbContext = createContext<DbContextType | undefined>(undefined);

export function DbProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [estadoDB, setEstadoDB] = useState<EstadoDB>({
    conectado: false,
    cantidadRegistros: {},
  });

  const refrescarEstado = async () => {
    try {
      const estado = await dbAdapter.getEstadoDB();
      setEstadoDB(estado);
    } catch (error) {
      console.error('Error al refrescar estado DB:', error);
    }
  };

  useEffect(() => {
    const inicializarDB = async () => {
      try {
        await refrescarEstado();
        setIsReady(true);
      } catch (error) {
        console.error('Error al inicializar base de datos:', error);
        setIsReady(true);
      }
    };

    inicializarDB();
  }, []);

  return (
    <DbContext.Provider
      value={{
        db: dbAdapter,
        isReady,
        estadoDB,
        refrescarEstado,
      }}
    >
      {children}
    </DbContext.Provider>
  );
}

export function useDb() {
  const context = useContext(DbContext);
  if (context === undefined) {
    throw new Error('useDb debe ser usado dentro de DbProvider');
  }
  return context;
}
