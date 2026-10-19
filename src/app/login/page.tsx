/**
 * Login / Registro de Vecinos Club (Supabase Auth)
 */

'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Formulario enviado:', { email, password, nombre, telefono });
    // TODO: Integrar con Supabase Auth
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-vecinos-crema to-orange-100 pt-20 md:pt-32 pb-20 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-3xl shadow-vecinos p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-vecinos-texto text-center mb-6">
            {isLogin ? 'Iniciar Sesión' : 'Unirse al Vecinos Club'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-vecinos-texto mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-vecinos-naranja"
                    placeholder="Ej: Juan Pérez"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-vecinos-texto mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-vecinos-naranja"
                    placeholder="Ej: 55 1234 5678"
                    required
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-vecinos-texto mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-vecinos-naranja"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-vecinos-texto mb-1">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-vecinos-naranja"
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-vecinos-naranja text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
            >
              {isLogin ? 'Iniciar Sesión' : 'Registrarme'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-vecinos-naranja font-semibold hover:underline"
            >
              {isLogin
                ? '¿No tienes cuenta? Únete al Vecinos Club'
                : '¿Ya tienes cuenta? Iniciar Sesión'}
            </button>
          </div>

          <div className="mt-6 p-4 bg-vecinos-crema rounded-xl">
            <h3 className="font-semibold text-vecinos-texto mb-2 text-sm">
              Beneficios del Vecinos Club
            </h3>
            <ul className="text-sm text-vecinos-texto-claro space-y-1">
              <li>✓ Acumula puntos por cada compra</li>
              <li>✓ Pases de pizza gratis</li>
              <li>✓ Promociones exclusivas</li>
              <li>✓ Notificaciones de ofertas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
