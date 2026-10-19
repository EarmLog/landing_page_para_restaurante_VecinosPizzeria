/**
 * Login de Administrador - Vecino's Pizzería
 * Solo permite acceso al usuario administrador registrado en Supabase.
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import CampoTexto from '@/components/ui/CampoTexto';
import Boton from '@/components/ui/Boton';

export default function AdminLoginPage() {
  const router = useRouter();
  const { signIn, loading } = useAuth();
  const [enviando, setEnviando] = useState(false);
  const [formulario, setFormulario] = useState({ correo: '', contrasena: '' });

  const actualizar = (campo: string, valor: string) => {
    setFormulario((actual) => ({ ...actual, [campo]: valor }));
  };

  const enviar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setEnviando(true);
    try {
      const { error } = await signIn(formulario.correo.trim(), formulario.contrasena);
      if (error) throw error;
      // Solo el correo admin puede entrar al panel
      if (formulario.correo.trim().toLowerCase() !== 'earm2771@gmail.com') {
        toast.error('Acceso denegado: este panel es solo para el administrador');
        return;
      }
      toast.success('Bienvenido, administrador');
      router.push('/admin');
    } catch (error) {
      const mensaje =
        error instanceof Error ? error.message : 'Credenciales inválidas';
      toast.error(`No se pudo iniciar sesión: ${mensaje}`);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-vecinos-crema to-orange-100 pt-20 md:pt-32 pb-20 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-3xl shadow-vecinos p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <img
              src="/logo.jpeg"
              alt="Logo"
              className="h-10 w-auto rounded-full border-2 border-orange-200"
            />
            <span className="text-xl font-extrabold text-vecinos-texto italic">
              Vecino's<span className="text-vecinos-naranja">Pizzería</span>
            </span>
          </div>
          <h1 className="text-2xl font-bold text-vecinos-texto mb-2 text-center">
            Panel de Administración
          </h1>
          <p className="text-center text-vecinos-texto-claro mb-8">
            Inicia sesión como administrador para gestionar el menú y precios.
          </p>

          <form onSubmit={enviar} className="space-y-4">
            <CampoTexto
              etiqueta="Correo de administrador"
              name="correo"
              type="email"
              value={formulario.correo}
              onChange={(e) => actualizar('correo', e.target.value)}
              placeholder="Earm2771@gmail.com"
              autoComplete="email"
            />
            <CampoTexto
              etiqueta="Contraseña"
              name="contrasena"
              type="password"
              value={formulario.contrasena}
              onChange={(e) => actualizar('contrasena', e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <Boton type="submit" anchoCompleto disabled={enviando || loading}>
              {enviando ? 'Ingresando...' : 'Entrar al panel'}
            </Boton>
          </form>

          <div className="mt-8 p-4 bg-orange-50 rounded-2xl border border-orange-100">
            <p className="text-xs text-orange-800 font-semibold mb-2">
              Credenciales de administrador
            </p>
            <p className="text-xs text-orange-700">
              Correo: Earm2771@gmail.com
            </p>
            <p className="text-xs text-orange-700">
              Contraseña: E27712316e
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-vecinos-naranja text-sm font-semibold hover:underline"
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
