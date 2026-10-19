/**
 * Modal responsivo para armar una pizza personalizada
 * Permite elegir masa, tamaño e ingredientes extra con cálculo de precio en vivo.
 */

'use client';

import { useMemo, useState } from 'react';
import ModalContainer from './ModalContainer';
import Boton from './ui/Boton';
import { formatearMoneda } from '@/lib/utils';

interface PizzaCustomizerModalProps {
  abierto: boolean;
  alCerrar: () => void;
  nombrePizza: string;
  precioBase: number;
  alAgregar?: (detalle: DetallePizza) => void;
}

export interface DetallePizza {
  nombre: string;
  masa: string;
  tamano: string;
  extras: string[];
  precio: number;
}

const MASAS = [
  { id: 'tradicional', nombre: 'Tradicional', precio: 0 },
  { id: 'delgada', nombre: 'Delgada', precio: 0 },
  { id: 'gruesa', nombre: 'Gruesa (borde de queso)', precio: 30 },
];

const TAMANOS = [
  { id: 'personal', nombre: 'Personal', factor: 0.7 },
  { id: 'mediana', nombre: 'Mediana', factor: 1 },
  { id: 'familiar', nombre: 'Familiar', factor: 1.4 },
];

const EXTRAS = [
  { id: 'queso', nombre: 'Doble queso', precio: 25 },
  { id: 'pepperoni', nombre: 'Pepperoni extra', precio: 30 },
  { id: 'champinones', nombre: 'Champiñones', precio: 20 },
  { id: 'tocino', nombre: 'Tocino', precio: 30 },
  { id: 'jalapeno', nombre: 'Jalapeño', precio: 15 },
];

export default function PizzaCustomizerModal({
  abierto,
  alCerrar,
  nombrePizza,
  precioBase,
  alAgregar,
}: PizzaCustomizerModalProps) {
  const [masa, setMasa] = useState('tradicional');
  const [tamano, setTamano] = useState('mediana');
  const [extras, setExtras] = useState<string[]>([]);

  // Cálculo del precio final sumando masa, tamaño e ingredientes extra
  const precioCalculado = useMemo(() => {
    const masaSeleccionada = MASAS.find((item) => item.id === masa);
    const tamanoSeleccionado = TAMANOS.find((item) => item.id === tamano);
    const extrasSeleccionados = EXTRAS.filter((item) => extras.includes(item.id));

    const precioTamano = precioBase * (tamanoSeleccionado?.factor ?? 1);
    const precioExtras = extrasSeleccionados.reduce(
      (total, extra) => total + extra.precio,
      0
    );

    return precioTamano + precioExtras + (masaSeleccionada?.precio ?? 0);
  }, [masa, tamano, extras, precioBase]);

  const alternarExtra = (id: string) => {
    setExtras((actuales) =>
      actuales.includes(id)
        ? actuales.filter((item) => item !== id)
        : [...actuales, id]
    );
  };

  const confirmar = () => {
    alAgregar?.({
      nombre: nombrePizza,
      masa,
      tamano,
      extras,
      precio: precioCalculado,
    });
    alCerrar();
  };

  return (
    <ModalContainer abierto={abierto} alCerrar={alCerrar} titulo={`Personalizar ${nombrePizza}`}>
      <div className="space-y-6">
        <section>
          <h3 className="font-semibold text-vecinos-texto mb-2">Masa</h3>
          <div className="grid grid-cols-1 gap-2">
            {MASAS.map((item) => (
              <label
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl border border-orange-200 cursor-pointer hover:bg-vecinos-crema"
              >
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="masa"
                    value={item.id}
                    checked={masa === item.id}
                    onChange={() => setMasa(item.id)}
                    className="accent-vecinos-naranja"
                  />
                  {item.nombre}
                </span>
                {item.precio > 0 && (
                  <span className="text-sm text-vecinos-texto-claro">
                    +{formatearMoneda(item.precio)}
                  </span>
                )}
              </label>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-semibold text-vecinos-texto mb-2">Tamaño</h3>
          <div className="grid grid-cols-3 gap-2">
            {TAMANOS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTamano(item.id)}
                className={`p-3 rounded-xl border text-center transition ${
                  tamano === item.id
                    ? 'border-vecinos-naranja bg-vecinos-naranja text-white'
                    : 'border-orange-200 bg-white text-vecinos-texto hover:bg-vecinos-crema'
                }`}
              >
                <span className="block text-sm font-medium">{item.nombre}</span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-semibold text-vecinos-texto mb-2">Ingredientes extra</h3>
          <div className="grid grid-cols-1 gap-2">
            {EXTRAS.map((item) => (
              <label
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl border border-orange-200 cursor-pointer hover:bg-vecinos-crema"
              >
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={extras.includes(item.id)}
                    onChange={() => alternarExtra(item.id)}
                    className="accent-vecinos-naranja"
                  />
                  {item.nombre}
                </span>
                <span className="text-sm text-vecinos-texto-claro">
                  +{formatearMoneda(item.precio)}
                </span>
              </label>
            ))}
          </div>
        </section>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-lg font-bold text-vecinos-naranja">
            {formatearMoneda(precioCalculado)}
          </span>
          <Boton onClick={confirmar}>Agregar al Pedido</Boton>
        </div>
      </div>
    </ModalContainer>
  );
}
