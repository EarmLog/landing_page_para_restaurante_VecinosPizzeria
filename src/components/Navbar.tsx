/**
 * Navegación profesional de Vecino's Pizzería
 * Escritorio: barra superior centrada con iconos, precio del dólar y CTA
 * Móvil: navegación inferior táctil
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import PrecioDolar from '@/components/PrecioDolar';

const ICONOS: Record<string, string> = {
  Inicio: '🏠',
  Menu: '🍕',
  Comandera: '🧾',
  'Vecinos Club': '👥',
  Estado: '⚙️',
  'Pedir Ahora': '🚚',
  Admin: '🔐',
  Salir: '🚪',
};

const escritorioItems = [
  { href: '/', label: 'Inicio', key: 'Inicio' },
  { href: '/menu', label: 'Menú', key: 'Menu' },
  { href: '/dashboard', label: 'Comandera', key: 'Comandera' },
  { href: '/dashboard/club', label: 'Vecinos Club', key: 'Vecinos Club' },
  { href: '/dashboard/configuracion', label: 'Estado', key: 'Estado' },
];

const movilItems = [
  { href: '/', label: 'Inicio', key: 'Inicio', destacado: false },
  { href: '/menu', label: 'Menú', key: 'Menu', destacado: false },
  { href: '/dashboard', label: 'Comandera', key: 'Comandera', destacado: true },
  { href: '/dashboard/club', label: 'Club', key: 'Vecinos Club', destacado: false },
  { href: '/dashboard/configuracion', label: 'Estado', key: 'Estado', destacado: false },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, signOut, loading } = useAuth();
  const esAdmin = user?.email === 'Earm2771@gmail.com';

  const activo = (href: string) => pathname === href;

  return (
    <>
      {/* Navbar escritorio */}
      <nav className="hidden md:block fixed top-4 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-vecinos px-5 py-3 flex items-center gap-3 border border-orange-200">
          <Link
            href="/"
            className="flex items-center gap-2 cursor-pointer"
          >
            <img
              src="/logo.jpeg"
              alt="Logo Vecino's Pizzería"
              className="h-8 w-auto rounded-full border-2 border-orange-200"
            />
            <span className="text-sm md:text-base font-extrabold text-vecinos-texto tracking-tight italic">
              Vecino's<span className="text-vecinos-naranja">Pizzería</span>
            </span>
          </Link>

          <div className="flex-1 flex items-center justify-center gap-2 overflow-x-auto md:overflow-visible pb-1 scrollbar-hide">
            {escritorioItems.map((item) => {
              const act = activo(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs md:text-sm font-medium transition-all ${
                    act
                      ? 'bg-vecinos-naranja text-white shadow-md'
                      : 'text-vecinos-texto-claro hover:bg-orange-50 hover:text-vecinos-naranja'
                  }`}
                >
                  <span>{ICONOS[item.key]}</span>
                  <span className="whitespace-nowrap">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <PrecioDolar />
            {user ? (
              <div className="flex items-center gap-2 rounded-xl border border-orange-200 bg-white/60 px-2 py-1">
                <span className="text-[10px] font-bold text-vecinos-texto-claro uppercase tracking-tighter">
                  {esAdmin ? 'ADMINISTRADOR' : 'CLIENTE'}
                </span>
                <button
                  onClick={() => signOut()}
                  className="text-xs text-vecinos-rojo hover:bg-red-50 rounded px-2 py-1 transition-colors"
                  title="Cerrar sesión"
                >
                  {ICONOS.Salir}
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-vecinos-naranja text-white px-3 py-1.5 rounded-xl text-[10px] md:text-xs font-bold hover:bg-orange-600 transition-colors whitespace-nowrap"
              >
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
        <div className="flex justify-center mt-2">
          <Link
            href="/menu"
            className="bg-vecinos-naranja text-white px-6 py-2.5 rounded-2xl font-bold text-sm shadow-lg hover:bg-orange-600 hover:scale-105 transition-all transform whitespace-nowrap"
          >
            {ICONOS['Pedir Ahora']} Pedir Ahora
          </Link>
        </div>
      </nav>

      {/* Navegación inferior móvil */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-orange-200 shadow-xl">
        <div className="grid grid-cols-5 h-16">
          {movilItems.map((item) => {
            const act = activo(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                  item.destacado
                    ? 'bg-vecinos-naranja text-white -mt-2 rounded-t-full shadow-vecinos'
                    : act
                    ? 'text-vecinos-naranja'
                    : 'text-vecinos-texto-claro'
                }`}
              >
                <span className="text-lg">{ICONOS[item.key]}</span>
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
