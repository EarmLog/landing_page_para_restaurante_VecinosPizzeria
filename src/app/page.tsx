/**
 * Landing Page Comercial - Vecino's Pizzería
 * Diseño profesional inspirado en 1page.jpeg
 * Logo: public/logo.jpeg (Icono.jpeg)
 * Paleta: naranja #EA580C, rojo #991B1B, crema #FFFBEB, texto #1F2937, claro #6B7280
 */

export default function Home() {
  const navLinks = [
    { href: '/', label: 'HOME', active: true },
    { href: '/menu', label: 'MENÚ' },
    { href: '/dashboard/club', label: 'VECINOS CLUB' },
    { href: '/dashboard/configuracion', label: 'DELIVERY' },
    { href: '/dashboard', label: 'CONTACTO' },
  ];

  return (
    <div className="min-h-screen bg-vecinos-crema text-vecinos-texto font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-3 cursor-pointer">
              <img
                src="/logo.jpeg"
                alt="Logo Vecino's Pizzería"
                className="h-12 md:h-16 w-auto rounded-full border-2 border-orange-200 shadow-sm"
              />
              <span className="text-2xl md:text-3xl font-extrabold text-vecinos-texto tracking-tight italic">
                Vecino&apos;s<span className="text-vecinos-naranja">Pizzería</span>
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-wider">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`px-4 py-2 rounded-xl transition-colors ${
                    link.active
                      ? 'bg-vecinos-naranja text-white'
                      : 'text-vecinos-texto-claro hover:text-vecinos-naranja hover:bg-orange-50'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <a
                href="/menu"
                className="bg-vecinos-naranja text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors whitespace-nowrap"
              >
                Pedir Online
              </a>
              <button
                className="md:hidden text-vecinos-texto p-2"
                aria-label="Menú"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-20 md:pt-32 pb-24 px-6 overflow-hidden">
        {/* decoración bricks en laterales mediante gradiente */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iNiIgZmlsbD0iI0VDVDU4MEMvIiBvcGFjaXR5PSIwLjA2Ii8+PC9zdmc+')] bg-repeat opacity-80" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="space-y-6 md:space-y-8">
              <div className="flex items-center gap-2 text-vecinos-naranja font-bold text-sm md:text-base uppercase tracking-wider">
                Vecino&apos;s Pizzería
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-vecinos-texto leading-tight">
                ¡Bienvenidos a{' '}
                <span className="text-vecinos-naranja">Vecinos</span>{' '}
                <span className="text-vecinos-rojo">Pizzería</span>!
              </h1>
              <p className="text-xl md:text-2xl text-vecinos-texto-claro max-w-lg">
                Las Mejores Pizzas de La Victoria, Directo a tu Mesa.{' '}
                <span className="block mt-2 text-lg md:text-xl">
                  Prueba el sabor auténtico de nuestro barrio. Haz tu pedido online o visítanos!
                </span>
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="/menu"
                  className="bg-vecinos-naranja text-white px-7 py-4 rounded-2xl font-bold text-base shadow-vecinos hover:bg-orange-600 hover:scale-105 transition-all whitespace-nowrap"
                >
                  Pedir Online (Web/Wa)
                </a>
                <a
                  href="/menu"
                  className="border-2 border-vecinos-naranja text-vecinos-naranja px-7 py-4 rounded-2xl font-bold text-base hover:bg-vecinos-naranja hover:text-white transition-all whitespace-nowrap"
                >
                  Nuestro Menú Digital
                </a>
              </div>
            </div>

            <div className="relative hidden md:block">
              <div
                className="relative inline-block rounded-[30%] shadow-[0_25px_50px_-12px_rgba(153,27,27,0.35)]"
                style={{ aspectRatio: 1 }}
              >
                <img
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'%3E%3Cdefs%3E%3CradialGradient id='c' cx='50%25' cy='50%25' r='50%25'%3E%3Cstop offset='0%25' stop-color='%23fbbf24'/%3E%3Cstop offset='100%25' stop-color='%23d97706'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='600' height='600' fill='%23991b1b'/%3E%3Cpath d='M300 100 C 200 100 140 180 140 300 C 140 420 220 500 300 500 C 380 500 460 420 460 300 C 460 180 400 100 300 100 Z' fill='url(%23c)'/%3E%3Ccircle cx='300' cy='300' r='210' fill='none' stroke='%237f1d1d' stroke-width='14'/%3E%3Ccircle cx='300' cy='300' r='130' fill='%23fef3c7' opacity='0.9'/%3E%3Ccircle cx='300' cy='300' r='120' fill='none' stroke='%23fcd34d' stroke-width='6' stroke-dasharray='8 8'/%3E%3Cg fill='%23991b1b'%3E%3Ccircle cx='210' cy='230' r='14'/%3E%3Ccircle cx='390' cy='230' r='14'/%3E%3Ccircle cx='300' cy='340' r='14'/%3E%3Ccircle cx='200' cy='360' r='12'/%3E%3Ccircle cx='400' cy='360' r='12'/%3E%3Ccircle cx='250' cy='420' r='10'/%3E%3Ccircle cx='350' cy='420' r='10'/%3E%3C/g%3E%3Cpath d='M220 260 Q 300 200 380 260' fill='none' stroke='%237f1d1d' stroke-width='8'/%3E%3Cpath d='M250 340 Q 300 400 350 340' fill='none' stroke='%237f1d1d' stroke-width='8'/%3E%3Cpath d='M180 300 Q 260 220 340 300 Q 420 380 340 460 Q 260 540 180 300' fill='none' stroke='%237f1d1d' stroke-width='6'/%3E%3Cpath d='M300 160 L 270 130 M300 440 L 330 410 M160 300 L 130 300 M440 300 L 470 300' stroke='%237f1d1d' stroke-width='6' stroke-linecap='round'/%3E%3C/svg%3E"
                  alt="Pizza artesanal"
                  className="w-full h-auto block"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-20 px-6 bg-white border-y border-orange-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-vecinos-texto mb-4">
              Sabor que nos une, Beneficios que te encantan.
            </h2>
            <p className="text-vecinos-texto-claro">¿Por qué elegir Vecino&apos;s Pizzería?</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Menú Interactivo',
                desc: 'Crea tu pizza ideal y ordénala rápido.',
                icon: 'pizza',
              },
              {
                title: 'Vecinos Club',
                desc: 'Acumula puntos con cada compra para pizzas gratis.',
                icon: 'club',
              },
              {
                title: 'Delivery Rápido',
                desc: 'Tu pizza caliente en minutos. Consulta cobertura.',
                icon: 'delivery',
              },
            ].map((b) => (
              <div key={b.title} className="p-8 rounded-3xl bg-orange-50 border border-orange-100 shadow-sm hover:shadow-vecinos transition-shadow">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-3xl mb-6 shadow-sm mx-auto">
                  {b.icon === 'pizza' ? '🍕' : b.icon === 'club' ? '🏆' : '🛵'}
                </div>
                <h3 className="text-xl font-bold text-vecinos-texto mb-3">{b.title}</h3>
                <p className="text-vecinos-texto-claro leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promociones */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-vecinos-texto">
                Últimas Promociones
              </h2>
              <p className="text-vecinos-naranja font-bold uppercase tracking-wide">
                ¡Aprovecha Ahora!
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: '2x1 los Martes en Pepperoni',
                badge: '2x1',
                cta: 'Aprovecha Ahora',
              },
              {
                title: 'Combo Familiar Vecinos',
                badge: 'Familiar',
                cta: 'Aprovecha Ahora',
              },
            ].map((p) => (
              <div key={p.title} className="rounded-3xl overflow-hidden border border-orange-200 shadow-sm group">
                <div className="h-48 bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center text-6xl relative">
                  <span className="absolute top-4 left-4 bg-vecinos-rojo text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tighter">
                    {p.badge}
                  </span>
                  🍕
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-vecinos-texto mb-2">{p.title}</h3>
                  <button className="bg-vecinos-naranja text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-orange-600 transition-colors w-full">
                    {p.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-orange-100 bg-white py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p className="text-vecinos-texto-claro">
            Vecino&apos;s Pizzería · Sabor de tu barrio, calidad de casa
          </p>
          <div className="flex gap-6 text-vecinos-texto-claro">
            <a href="/dashboard/configuracion" className="hover:text-vecinos-naranja transition-colors">
              Contacto
            </a>
            <a href="/dashboard/club" className="hover:text-vecinos-naranja transition-colors">
              Vecinos Club
            </a>
            <a href="/menu" className="hover:text-vecinos-naranja transition-colors">
              Menú
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
