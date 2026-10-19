/**
 * Panel del cliente Vecinos Club
 * Muestra los puntos acumulados, el historial y las recompensas disponibles.
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';

interface PerfilClub {
  nombre: string | null;
  puntos: number;
}

export default function ClubPage() {
  const { user, loading } = useAuth();
  const [perfil, setPerfil] = useState<PerfilClub | null>(null);

  useEffect(() => {
    async function cargarPerfil() {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('clientes_vecinos')
          .select('nombre, puntos')
          .eq('auth_id', user.id)
          .maybeSingle();
        if (error) throw error;
        setPerfil({
          nombre: data?.nombre ?? user.email ?? 'Vecino',
          puntos: data?.puntos ?? 0,
        });
      } catch {
        // Si algo falla, mostramos los datos básicos del usuario
        setPerfil({ nombre: user.email ?? 'Vecino', puntos: 0 });
      }
    }
    cargarPerfil();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <p className="text-vecinos-texto-claro">Cargando tu cuenta...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 pt-20 px-4">
        <h1 className="text-2xl font-bold text-vecinos-texto text-center">
          Necesitas iniciar sesión para ver tus puntos
        </h1>
        <Link
          href="/login"
          className="bg-vecinos-naranja text-white px-6 py-3 rounded-2xl font-semibold hover:bg-orange-600 transition-colors"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  const puntos = perfil?.puntos ?? 0;
  const metaPizza = 600;
  const progreso = Math.min(100, Math.round((puntos / metaPizza) * 100));

  return (
    <div className="min-h-screen bg-gradient-to-br from-vecinos-crema to-orange-100 pt-20 md:pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-vecinos-texto mb-2">
          Hola, {perfil?.nombre ?? 'Vecino'}
        </h1>
        <p className="text-vecinos-texto-claro mb-6">Este es tu panel de Vecinos Club</p>

        {/* Tarjeta de puntos */}
        <div className="bg-gradient-to-r from-vecinos-naranja to-vecinos-rojo rounded-3xl shadow-vecinos p-6 md:p-8 text-white mb-6">
          <h2 className="text-xl font-semibold mb-2">Puntos acumulados</h2>
          <div className="text-5xl md:text-6xl font-bold mb-2">{puntos}</div>
          <p className="text-orange-100">
            {puntos >= metaPizza
              ? '¡Tienes una pizza gratis disponible!'
              : '¡Sigue sumando para tu próxima pizza gratis!'}
          </p>
          <div className="mt-4 bg-white/20 rounded-full h-2">
            <div className="bg-white h-2 rounded-full" style={{ width: `${progreso}%` }} />
          </div>
          <p className="text-sm text-orange-100 mt-2">
            {Math.max(0, metaPizza - puntos)} puntos para tu pizza gratis
          </p>
        </div>

        {/* Recompensas disponibles */}
        <div className="bg-white rounded-3xl shadow-vecinos p-6">
          <h2 className="text-xl font-bold text-vecinos-texto mb-4">
            Recompensas disponibles
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-vecinos-crema rounded-2xl">
              <div>
                <p className="font-semibold text-vecinos-texto">Pizza gratis mediana</p>
                <p className="text-sm text-vecinos-texto-claro">600 puntos</p>
              </div>
              <button
                onClick={() => toast.info('Canjea esta recompensa en caja al pedir')}
                disabled={puntos < metaPizza}
                className="bg-vecinos-naranja text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Canjear
              </button>
            </div>
            <div className="flex justify-between items-center p-4 bg-vecinos-crema rounded-2xl">
              <div>
                <p className="font-semibold text-vecinos-texto">2x1 en pizza Pepperoni</p>
                <p className="text-sm text-vecinos-texto-claro">400 puntos</p>
              </div>
              <button
                onClick={() => toast.info('Canjea esta recompensa en caja al pedir')}
                disabled={puntos < 400}
                className="bg-vecinos-naranja text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Canjear
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
