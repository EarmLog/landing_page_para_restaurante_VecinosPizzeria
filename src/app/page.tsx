/**
 * Landing Page Comercial - Vecino's Pizzería
 * Hero Section con llamados a acción inmediatos
 */

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-vecinos-crema via-orange-50 to-orange-100">
      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-vecinos-texto mb-6 leading-tight">
            Bienvenido a{' '}
            <span className="text-vecinos-naranja">Vecinos</span>{' '}
            <span className="text-vecinos-rojo">Pizzería</span>
          </h1>
          <p className="text-xl md:text-2xl text-vecinos-texto-claro mb-8 max-w-2xl mx-auto">
            Las mejores pizzas artesanales, hechas con ingredientes frescos y mucho cariño. 
            ¡Pide ahora y recibe en la puerta de tu casa!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <a
              href="/menu"
              className="bg-vecinos-naranja text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-orange-600 transition-all transform hover:scale-105 shadow-vecinos w-full sm:w-auto"
            >
              🍕 Ver Menú
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent('Hola Vecino\'s Pizzería, quiero hacer un pedido!')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg w-full sm:w-auto"
            >
              📱 Pedir por WhatsApp
            </a>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-vecinos-naranja">100%</div>
              <div className="text-sm text-vecinos-texto-claro">Artesanal</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-vecinos-naranja">+500</div>
              <div className="text-sm text-vecinos-texto-claro">Clientes Felices</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-vecinos-naranja">30min</div>
              <div className="text-sm text-vecinos-texto-claro">Entrega Rápida</div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Menú Destacado */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-vecinos-texto mb-4">
            Nuestras Pizzas Más Pedidas
          </h2>
          <p className="text-center text-vecinos-texto-claro mb-12">
            Elaboradas con masa artesanal y los mejores ingredientes
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pizza Margarita */}
            <div className="bg-white rounded-3xl shadow-vecinos overflow-hidden hover:transform hover:scale-105 transition-all">
              <div className="h-48 bg-gradient-to-br from-orange-200 to-yellow-200 flex items-center justify-center text-6xl">
                🍕
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-vecinos-texto mb-2">Margarita</h3>
                <p className="text-vecinos-texto-claro mb-4">Salsa de tomate, mozzarella fresca y albahaca</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-vecinos-naranja">$149 MXN</span>
                  <button className="bg-vecinos-naranja text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition-colors">
                    Personalizar
                  </button>
                </div>
              </div>
            </div>

            {/* Pizza Pepperoni */}
            <div className="bg-white rounded-3xl shadow-vecinos overflow-hidden hover:transform hover:scale-105 transition-all">
              <div className="h-48 bg-gradient-to-br from-red-200 to-orange-200 flex items-center justify-center text-6xl">
                🍕
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-vecinos-texto mb-2">Pepperoni</h3>
                <p className="text-vecinos-texto-claro mb-4">Salsa de tomate, mozzarella y pepperoni</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-vecinos-naranja">$169 MXN</span>
                  <button className="bg-vecinos-naranja text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition-colors">
                    Personalizar
                  </button>
                </div>
              </div>
            </div>

            {/* Pizza Hawaiana */}
            <div className="bg-white rounded-3xl shadow-vecinos overflow-hidden hover:transform hover:scale-105 transition-all">
              <div className="h-48 bg-gradient-to-br from-yellow-200 to-orange-200 flex items-center justify-center text-6xl">
                🍕
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-vecinos-texto mb-2">Hawaiana</h3>
                <p className="text-vecinos-texto-claro mb-4">Jamón, piña, mozzarella y salsa de tomate</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-vecinos-naranja">$179 MXN</span>
                  <button className="bg-vecinos-naranja text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition-colors">
                    Personalizar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <a
              href="/menu"
              className="inline-block bg-vecinos-rojo text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-red-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Ver Menú Completo
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
