/**
 * Menú Digital e Interactivo - Vecino's Pizzería
 * Carga el menú desde Supabase con respaldo offline y permite personalizar pizzas.
 */

'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import PizzaCard from '@/components/ui/PizzaCard';
import PizzaCustomizerModal from '@/components/PizzaCustomizerModal';
import { obtenerMenu, type ProductoMenu } from '@/lib/servicioMenu';
import { formatearMoneda } from '@/lib/utils';

export default function MenuPage() {
  const [productos, setProductos] = useState<ProductoMenu[]>([]);
  const [cargando, setCargando] = useState(true);
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');
  const [pizzaSeleccionada, setPizzaSeleccionada] = useState<ProductoMenu | null>(null);

  useEffect(() => {
    async function cargarMenu() {
      try {
        const { productos: menu, origen } = await obtenerMenu();
        setProductos(menu);
        if (origen === 'local') {
          toast.info('Mostrando el menú guardado sin conexión');
        }
      } catch {
        toast.error('No se pudo cargar el menú, inténtalo de nuevo');
      } finally {
        setCargando(false);
      }
    }
    cargarMenu();
  }, []);

  const categorias = useMemo(() => {
    const unicas = Array.from(new Set(productos.map((p) => p.categoria)));
    return ['Todas', ...unicas];
  }, [productos]);

  const productosFiltrados = useMemo(
    () =>
      categoriaActiva === 'Todas'
        ? productos
        : productos.filter((p) => p.categoria === categoriaActiva),
    [productos, categoriaActiva]
  );

  return (
    <div className="min-h-screen bg-vecinos-crema pt-6 md:pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-vecinos-texto mb-6">
          Menú Digital
        </h1>

        {/* Filtros por categoría */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categorias.map((categoria) => (
            <button
              key={categoria}
              onClick={() => setCategoriaActiva(categoria)}
              className={`px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-colors ${
                categoriaActiva === categoria
                  ? 'bg-vecinos-naranja text-white'
                  : 'bg-white text-vecinos-texto border border-orange-200'
              }`}
            >
              {categoria}
            </button>
          ))}
        </div>

        {cargando ? (
          <p className="text-vecinos-texto-claro">Cargando menú...</p>
        ) : productosFiltrados.length === 0 ? (
          <p className="text-vecinos-texto-claro">No hay productos disponibles por ahora.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productosFiltrados.map((producto) => (
              <PizzaCard
                key={producto.id || producto.codigo}
                nombre={producto.nombre}
                descripcion={producto.descripcion ?? ''}
                precio={producto.precio}
                alPersonalizar={() => setPizzaSeleccionada(producto)}
              />
            ))}
          </div>
        )}

      </div>

      {pizzaSeleccionada && (
        <PizzaCustomizerModal
          abierto={Boolean(pizzaSeleccionada)}
          alCerrar={() => setPizzaSeleccionada(null)}
          nombrePizza={pizzaSeleccionada.nombre}
          precioBase={pizzaSeleccionada.precio}
          alAgregar={(detalle) => {
            toast.success(
              `${detalle.nombre} (${detalle.tamano}) agregada por ${formatearMoneda(detalle.precio)}`
            );
          }}
        />
      )}
    </div>
  );
}
