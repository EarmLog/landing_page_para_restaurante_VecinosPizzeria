/**
 * Vista del Programa de Puntos del Cliente (Vecinos Club)
 */

'use client';

export default function ClubPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-vecinos-crema to-orange-100 pt-20 md:pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-vecinos-texto mb-6">
          Mi Vecinos Club
        </h1>

        {/* Tarjeta de puntos */}
        <div className="bg-gradient-to-r from-vecinos-naranja to-vecinos-rojo rounded-3xl shadow-vecinos p-6 md:p-8 text-white mb-6">
          <h2 className="text-xl font-semibold mb-2">Puntos Acumulados</h2>
          <div className="text-5xl md:text-6xl font-bold mb-2">450</div>
          <p className="text-orange-100">¡Muy cerca de tu próxima pizza gratis!</p>
          <div className="mt-4 bg-white/20 rounded-full h-2">
            <div className="bg-white h-2 rounded-full w-3/4"></div>
          </div>
          <p className="text-sm text-orange-100 mt-2">150 puntos más para obtener 1 pizza gratis</p>
        </div>

        {/* Historial de puntos */}
        <div className="bg-white rounded-3xl shadow-vecinos p-6 mb-6">
          <h2 className="text-xl font-bold text-vecinos-texto mb-4">
            Historial de Puntos
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <div>
                <p className="font-medium text-vecinos-texto">Compra #VP-001</p>
                <p className="text-sm text-vecinos-texto-claro">19/Oct/2026</p>
              </div>
              <span className="text-green-600 font-bold">+45 pts</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <div>
                <p className="font-medium text-vecinos-texto">Compra #VP-002</p>
                <p className="text-sm text-vecinos-texto-claro">15/Oct/2026</p>
              </div>
              <span className="text-green-600 font-bold">+85 pts</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <div>
                <p className="font-medium text-vecinos-texto">Registro Vecinos Club</p>
                <p className="text-sm text-vecinos-texto-claro">01/Oct/2026</p>
              </div>
              <span className="text-green-600 font-bold">+100 pts</span>
            </div>
          </div>
        </div>

        {/* Recompensas disponibles */}
        <div className="bg-white rounded-3xl shadow-vecinos p-6">
          <h2 className="text-xl font-bold text-vecinos-texto mb-4">
            Recompensas Disponibles
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-vecinos-crema rounded-2xl">
              <div>
                <p className="font-semibold text-vecinos-texto">Pizza Gratis (Tamaño Mediano)</p>
                <p className="text-sm text-vecinos-texto-claro">600 puntos</p>
              </div>
              <button className="bg-vecinos-naranja text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50" disabled>
                Canjear
              </button>
            </div>
            <div className="flex justify-between items-center p-4 bg-vecinos-crema rounded-2xl">
              <div>
                <p className="font-semibold text-vecinos-texto">2x1 en Pizza Pepperoni</p>
                <p className="text-sm text-vecinos-texto-claro">400 puntos</p>
              </div>
              <button className="bg-vecinos-naranja text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors">
                Canjear
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
