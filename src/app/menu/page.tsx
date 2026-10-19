/**
 * Menú Digital e Interactivo - Vecino's Pizzería
 */

'use client';

import { useState } from 'react';

const categorias = [
  { id: 'pizzas', nombre: 'Pizzas' },
  { id: 'bebidas', nombre: 'Bebidas' },
  { id: 'postres', nombre: 'Postres' },
];

const productos = [
  {
    id: 1,
    categoria: 'pizzas',
    nombre: 'Margarita',
    descripcion: 'Salsa de tomate, mozzarella fresca y albahaca',
    precio: 149,
    imagen: '🍕',
  },
  {
    id: 2,
    categoria: 'pizzas',
    nombre: 'Pepperoni',
    descripcion: 'Salsa de tomate, mozzarella y pepperoni',
    precio: 169,
    imagen: '🍕',
  },
  {
    id: 3,
    categoria: 'pizzas',
    nombre: 'Hawaiana',
    descripcion: 'Jamón, piña, mozzarella y salsa de tomate',
    precio: 179,
    imagen: '🍕',
  },
  {
    id: 4,
    categoria: 'bebidas',
    nombre: 'Refresco Cola',
    descripcion: '355ml',
    precio: 25,
    imagen: '🥤',
  },
  {
    id: 5,
    categoria: 'postres',
    nombre: 'Helado',
    descripcion: 'Vaso de helado de vainilla',
    precio: 35,
    imagen: '🍨',
  },
];

export default function MenuPage() {
  const [categoriaActiva, setCategoriaActiva] = useState('pizzas');

  const productosFiltrados = productos.filter(
    (p) => p.categoria === categoriaActiva
  );

  return (
    <div className="min-h-screen bg-vecinos-crema pt-6 md:pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-vecinos-texto mb-6">
          Menú Digital
        </h1>

        {/* Filtros por categoría */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categorias.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoriaActiva(cat.id)}
              className={`px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-colors ${
                categoriaActiva === cat.id
                  ? 'bg-vecinos-naranja text-white'
                  : 'bg-white text-vecinos-texto border border-orange-200'
              }`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>

        {/* Lista de productos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productosFiltrados.map((producto) => (
            <div
              key={producto.id}
              className="bg-white rounded-3xl shadow-vecinos overflow-hidden hover:transform hover:scale-105 transition-all"
            >
              <div className="h-40 bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center text-6xl">
                {producto.imagen}
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-vecinos-texto mb-1">
                  {producto.nombre}
                </h3>
                <p className="text-sm text-vecinos-texto-claro mb-3">
                  {producto.descripcion}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-vecinos-naranja">
                    ${producto.precio} MXN
                  </span>
                  <button className="bg-vecinos-naranja text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors">
                    Agregar al Pedido
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
