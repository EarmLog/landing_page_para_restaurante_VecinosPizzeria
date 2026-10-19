/**
 * Navegación adaptativa para Vecino's Pizzería
 * Móviles: Navegación inferior táctil con botón destacado
 * Escritorio: Navbar superior flotante
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Inicio', icon: '🏠' },
    { href: '/menu', label: 'Menú', icon: '🍕' },
    { href: '/dashboard', label: 'Comandera', icon: '📋', destacado: true },
    { href: '/login', label: 'Club', icon: '👥' },
    { href: '/dashboard/club', label: 'Mis Puntos', icon: '🎯' },
  ];

  return (
    <>
      {/* Navbar para escritorio */}
      <nav className="hidden md:block fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white/95 backdrop-blur-md rounded-full shadow-vecinos px-6 py-3 flex items-center gap-8 border border-orange-200">
          <Link href="/" className="font-bold text-xl text-vecinos-naranja">
            Vecinos Pizzería
          </Link>
          <div className="flex gap-6">
            <Link 
              href="/menu" 
              className={`font-medium transition-colors hover:text-vecinos-naranja ${
                pathname === '/menu' ? 'text-vecinos-naranja' : 'text-vecinos-texto'
              }`}
            >
              Menú
            </Link>
            <Link 
              href="/dashboard" 
              className={`font-medium transition-colors hover:text-vecinos-naranja ${
                pathname === '/dashboard' ? 'text-vecinos-naranja' : 'text-vecinos-texto'
              }`}
            >
              Comandera
            </Link>
            <Link 
              href="/login" 
              className={`font-medium transition-colors hover:text-vecinos-naranja ${
                pathname === '/login' ? 'text-vecinos-naranja' : 'text-vecinos-texto'
              }`}
            >
              Vecinos Club
            </Link>
          </div>
          <Link 
            href="/menu" 
            className="bg-vecinos-naranja text-white px-6 py-2 rounded-full font-semibold hover:bg-orange-600 transition-colors shadow-lg"
          >
            Pedir Ahora
          </Link>
        </div>
      </nav>

      {/* Navegación inferior para móvil */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-orange-200 shadow-lg">
        <div className="grid grid-cols-5 h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                  item.destacado
                    ? 'bg-vecinos-naranja text-white -mt-2 rounded-t-full shadow-vecinos'
                    : isActive
                    ? 'text-vecinos-naranja'
                    : 'text-vecinos-texto-claro'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
