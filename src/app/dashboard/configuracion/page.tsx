/**
 * Módulo de Configuración y Estado
 * Verifica la conexión con Supabase (esquema vecinos_pizzeria),
 * muestra el estado de la base local y permite descargar un respaldo en JSON.
 */

'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useDb } from '@/context/DbContext';
import { supabase } from '@/lib/supabaseClient';

type EstadoConexion = 'sin_verificar' | 'verificando' | 'conectado' | 'error';

export default function ConfiguracionPage() {
  const { estadoDB, refrescarEstado } = useDb();
  const [estadoConexion, setEstadoConexion] = useState<EstadoConexion>('sin_verificar');

  const esquema = process.env.NEXT_PUBLIC_SUPABASE_SCHEMA || 'vecinos_pizzeria';

  const verificarConexion = async () => {
    setEstadoConexion('verificando');
    try {
      const { error } = await supabase
        .from('productos')
        .select('codigo')
        .limit(1);
      if (error) throw error;
      setEstadoConexion('conectado');
      toast.success(`Conexión correcta al esquema ${esquema}`);
    } catch (error) {
      setEstadoConexion('error');
      const mensaje = error instanceof Error ? error.message : 'Error desconocido';
      toast.error(`No se pudo conectar: ${mensaje}`);
    }
  };

  const descargarRespaldo = async () => {
    try {
      const [productos, pedidos, clientes] = await Promise.all([
        fetchLocal('productos'),
        fetchLocal('pedidos'),
        fetchLocal('clientesFieles'),
      ]);

      const respaldo = {
        aplicacion: "Vecino's Pizzería",
        esquema,
        generado: new Date().toISOString(),
        datos: { productos, pedidos, clientes },
      };

      const blob = new Blob([JSON.stringify(respaldo, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const enlace = document.createElement('a');
      enlace.href = url;
      enlace.download = `respaldo-vecinos-${Date.now()}.json`;
      enlace.click();
      URL.revokeObjectURL(url);
      toast.success('Respaldo descargado correctamente');
    } catch {
      toast.error('No se pudo generar el respaldo');
    }
  };

  const indicadores: Record<EstadoConexion, { texto: string; color: string }> = {
    sin_verificar: { texto: 'Sin verificar', color: 'bg-gray-100 text-gray-700' },
    verificando: { texto: 'Verificando...', color: 'bg-yellow-100 text-yellow-800' },
    conectado: { texto: 'Conectado', color: 'bg-green-100 text-green-800' },
    error: { texto: 'Sin conexión', color: 'bg-red-100 text-red-700' },
  };

  return (
    <div className="min-h-screen bg-vecinos-crema pt-6 md:pt-24 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-vecinos-texto mb-6">
          Configuración y Estado
        </h1>

        <div className="bg-white rounded-3xl shadow-vecinos p-6 mb-6">
          <h2 className="text-xl font-bold text-vecinos-texto mb-4">Conexión a Supabase</h2>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-vecinos-texto-claro">Esquema activo</p>
              <p className="font-semibold text-vecinos-texto">{esquema}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${indicadores[estadoConexion].color}`}
            >
              {indicadores[estadoConexion].texto}
            </span>
          </div>
          <button
            onClick={verificarConexion}
            disabled={estadoConexion === 'verificando'}
            className="bg-vecinos-naranja text-white px-5 py-3 rounded-2xl font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            Verificar conexión
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-vecinos p-6 mb-6">
          <h2 className="text-xl font-bold text-vecinos-texto mb-4">Base de datos local</h2>
          <ul className="space-y-2 mb-4">
            <li className="flex justify-between text-vecinos-texto">
              <span>Productos guardados</span>
              <span className="font-semibold">{estadoDB.cantidadRegistros.productos ?? 0}</span>
            </li>
            <li className="flex justify-between text-vecinos-texto">
              <span>Pedidos guardados</span>
              <span className="font-semibold">{estadoDB.cantidadRegistros.pedidos ?? 0}</span>
            </li>
            <li className="flex justify-between text-vecinos-texto">
              <span>Clientes del club</span>
              <span className="font-semibold">{estadoDB.cantidadRegistros.clientes ?? 0}</span>
            </li>
          </ul>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={refrescarEstado}
              className="bg-white text-vecinos-texto border border-orange-200 px-5 py-3 rounded-2xl font-semibold hover:bg-vecinos-crema transition-colors"
            >
              Actualizar estado
            </button>
            <button
              onClick={descargarRespaldo}
              className="bg-vecinos-rojo text-white px-5 py-3 rounded-2xl font-semibold hover:bg-red-700 transition-colors"
            >
              Descargar respaldo (JSON)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Lectura simple de una tabla local usando la API de IndexedDB vía fetchLocal.
 * Se evita acoplar el módulo al adaptador para mantenerlo liviano.
 */
async function fetchLocal(tabla: string): Promise<unknown[]> {
  const { dbAdapter } = await import('@/lib/db/dbAdapter');
  return dbAdapter.getAll(tabla as 'productos' | 'pedidos' | 'clientesFieles');
}
