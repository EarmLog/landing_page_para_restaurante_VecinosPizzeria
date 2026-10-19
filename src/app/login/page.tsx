/**
 * Login / Registro de Vecinos Club (Supabase Auth)
 * Valida y sanitiza las entradas antes de enviarlas a Supabase.
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import CampoTexto from '@/components/ui/CampoTexto';
import Boton from '@/components/ui/Boton';
import { esCorreoValido, esTelefonoValido, sanitizarTexto } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signUp } = useAuth();
  const [esLogin, setEsLogin] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [formulario, setFormulario] = useState({
    nombre: '',
    telefono: '',
    correo: '',
    contrasena: '',
  });

  const actualizar = (campo: string, valor: string) => {
    setFormulario((actual) => ({ ...actual, [campo]: valor }));
  };

  const validar = (): string | null => {
    if (!esCorreoValido(formulario.correo)) {
      return 'Escribe un correo electrónico válido';
    }
    if (formulario.contrasena.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    if (!esLogin) {
      if (formulario.nombre.trim().length < 3) {
        return 'Escribe tu nombre completo';
      }
      if (!esTelefonoValido(formulario.telefono)) {
        return 'Escribe un teléfono de 10 dígitos';
      }
    }
    return null;
  };

  const enviar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    const errorValidacion = validar();
    if (errorValidacion) {
      toast.error(errorValidacion);
      return;
    }

    setEnviando(true);
    try {
      if (esLogin) {
        const { error } = await signIn(formulario.correo.trim(), formulario.contrasena);
        if (error) throw error;
        toast.success('¡Bienvenido de vuelta a Vecinos Club!');
        router.push('/dashboard/club');
      } else {
        const { error } = await signUp(
          formulario.correo.trim(),
          formulario.contrasena,
          {
            nombre: sanitizarTexto(formulario.nombre),
            telefono: sanitizarTexto(formulario.telefono),
            puntos: 100,
          }
        );
        if (error) throw error;
        toast.success('¡Listo! Ya eres parte de Vecinos Club');
        router.push('/dashboard/club');
      }
    } catch (error) {
      const mensaje =
        error instanceof Error ? error.message : 'Ocurrió un error inesperado';
      toast.error(`No pudimos completar la operación: ${mensaje}`);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-vecinos-crema to-orange-100 pt-20 md:pt-32 pb-20 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-3xl shadow-vecinos p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-vecinos-texto mb-6 text-center">
            {esLogin ? 'Iniciar Sesión' : 'Únete a Vecinos Club'}
          </h1>

          <form onSubmit={enviar} className="space-y-4">
            {!esLogin && (
              <>
                <CampoTexto
                  etiqueta="Nombre Completo"
                  name="nombre"
                  value={formulario.nombre}
                  onChange={(e) => actualizar('nombre', e.target.value)}
                  placeholder="Ej: Juan Pérez"
                  autoComplete="name"
                />
                <CampoTexto
                  etiqueta="Teléfono"
                  name="telefono"
                  type="tel"
                  value={formulario.telefono}
                  onChange={(e) => actualizar('telefono', e.target.value)}
                  placeholder="Ej: 5512345678"
                  autoComplete="tel"
                />
              </>
            )}

            <CampoTexto
              etiqueta="Correo Electrónico"
              name="correo"
              type="email"
              value={formulario.correo}
              onChange={(e) => actualizar('correo', e.target.value)}
              placeholder="tu@email.com"
              autoComplete="email"
            />

            <CampoTexto
              etiqueta="Contraseña"
              name="contrasena"
              type="password"
              value={formulario.contrasena}
              onChange={(e) => actualizar('contrasena', e.target.value)}
              placeholder="Mínimo 6 caracteres"
              autoComplete={esLogin ? 'current-password' : 'new-password'}
            />

            <Boton type="submit" anchoCompleto disabled={enviando}>
              {enviando ? 'Procesando...' : esLogin ? 'Iniciar Sesión' : 'Registrarme'}
            </Boton>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setEsLogin(!esLogin)}
              className="text-vecinos-naranja font-semibold hover:underline"
            >
              {esLogin
                ? '¿No tienes cuenta? Únete a Vecinos Club'
                : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>

          <div className="mt-6 p-4 bg-vecinos-crema rounded-xl">
            <h3 className="font-semibold text-vecinos-texto mb-2 text-sm">
              Beneficios del Vecinos Club
            </h3>
            <ul className="text-sm text-vecinos-texto-claro space-y-1">
              <li>Acumula puntos por cada compra</li>
              <li>Pases de pizza gratis</li>
              <li>Promociones exclusivas</li>
              <li>Notificaciones de ofertas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
