/* eslint-disable react/no-unescaped-entities */
/**
 * Panel de Administración - Vecino's Pizzería
 * Solo accesible para el usuario administrador.
 * Permite crear, editar, activar/desactivar y eliminar productos,
 * ajustar precios en USD con equivalente automático en VES y asignar imágenes.
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { obtenerTipoCambioUSDVES, formatearVES } from '@/lib/tipoCambio';
import Boton from '@/components/ui/Boton';
import CampoTexto from '@/components/ui/CampoTexto';

interface Producto {
  id: number;
  codigo?: string | null;
  nombre: string;
  categoria?: string | null;
  descripcion?: string | null;
  precio_usd?: number | null;
  precio_ves?: number | null;
  imagen_url?: string | null;
  activo?: boolean | null;
}

export default function AdminPage() {
  const { user, isAdmin, signOut } = useAuth();
  const router = useRouter();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [tasa, setTasa] = useState<number>(36.5);
  const [editando, setEditando] = useState<Producto | null>(null);
  const [formulario, setFormulario] = useState({
    nombre: '',
    categoria: '',
    descripcion: '',
    precio_usd: '',
    precio_ves: '',
    imagen_url: '',
    activo: true,
  });

  const cargarProductos = useCallback(async () => {
    setCargando(true);
    try {
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .order('nombre', { ascending: true });
      if (error) throw error;
      setProductos((data ?? []) as Producto[]);
      setTasa(await obtenerTipoCambioUSDVES());
    } catch {
      toast.error("No se pudieron cargar los productos");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    let montado = true;
    void (async () => {
      await cargarProductos();
    })();
    return () => {
      montado = false;
    };
  }, [cargarProductos]);

  const actualizarPrecioVES = (usd: string) => {
    const valor = Number(usd);
    if (valor > 0 && tasa) {
      setFormulario((prev) => ({ ...prev, precio_ves: (valor * tasa).toFixed(2) }));
    }
  };

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        nombre: formulario.nombre.trim(),
        categoria: formulario.categoria.trim() || null,
        descripcion: formulario.descripcion.trim() || null,
        precio_usd: Number(formulario.precio_usd) || 0,
        precio_ves: Number(formulario.precio_ves) || 0,
        imagen_url: formulario.imagen_url.trim() || null,
        activo: formulario.activo,
      };

      if (editando) {
        const { error } = await supabase
          .from('productos')
          .update(payload)
          .eq('id', editando.id);
        if (error) throw error;
        toast.success('Producto actualizado');
      } else {
        const { error } = await supabase.from('productos').insert([payload]);
        if (error) throw error;
        toast.success('Producto creado');
      }
      setEditando(null);
      setFormulario({ nombre: '', categoria: '', descripcion: '', precio_usd: '', precio_ves: '', imagen_url: '', activo: true });
      await cargarProductos();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error guardando producto');
    }
  };

  const editar = (p: Producto) => {
    setEditando(p);
    setFormulario({
      nombre: p.nombre ?? '',
      categoria: p.categoria ?? '',
      descripcion: p.descripcion ?? '',
      precio_usd: String(p.precio_usd ?? ''),
      precio_ves: String(p.precio_ves ?? ''),
      imagen_url: p.imagen_url ?? '',
      activo: p.activo ?? true,
    });
  };

  const eliminar = async (id: number) => {
    if (!confirm('Eliminar este producto')) return;
    try {
      const { error } = await supabase.from('productos').delete().eq('id', id);
      if (error) throw error;
      toast.success('Producto eliminado');
      await cargarProductos();
    } catch {
      toast.error('No se pudo eliminar');
    }
  };

  const alternar = async (p: Producto) => {
    try {
      const { error } = await supabase
        .from('productos')
        .update({ activo: !(p.activo ?? true) })
        .eq('id', p.id);
      if (error) throw error;
      await cargarProductos();
    } catch {
      toast.error('No se pudo actualizar');
    }
  };

  if (!isAdmin) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-vecinos-crema text-vecinos-texto">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-vecinos-texto">
              Panel de Administracion
            </h1>
            <p className="text-vecinos-texto-claro">
              Gestion de productos, precios y menu digital
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-vecinos-texto-claro uppercase tracking-wider bg-white px-2 py-1 rounded border border-orange-200">
              Admin: {user?.email}
            </span>
            <Boton onClick={() => signOut().then(() => router.push('/'))} variante="secundario">
              Cerrar sesion
            </Boton>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl shadow-vecinos p-6">
              <h3 className="text-lg font-bold text-vecinos-texto mb-4">
                {editando ? 'Editar producto' : 'Nuevo producto'}
              </h3>
              <form onSubmit={guardar} className="space-y-4">
                <CampoTexto
                  etiqueta="Nombre del producto"
                  name="nombre"
                  value={formulario.nombre}
                  onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })}
                  placeholder="Ej: Pizza Pepperoni"
                />
                <CampoTexto
                  etiqueta="Categoria"
                  name="categoria"
                  value={formulario.categoria}
                  onChange={(e) => setFormulario({ ...formulario, categoria: e.target.value })}
                  placeholder="Ej: Pizza, Hamburguesa, Bebida"
                />
                <CampoTexto
                  etiqueta="Descripcion"
                  name="descripcion"
                  value={formulario.descripcion}
                  onChange={(e) => setFormulario({ ...formulario, descripcion: e.target.value })}
                  placeholder="Ingredientes..."
                />
                <div className="grid grid-cols-2 gap-4">
                  <CampoTexto
                    etiqueta="Precio (USD)"
                    name="precio_usd"
                    type="number"
                    step="0.01"
                    min="5"
                    max="20"
                    value={formulario.precio_usd}
                    onChange={(e) => {
                      setFormulario({ ...formulario, precio_usd: e.target.value });
                      actualizarPrecioVES(e.target.value);
                    }}
                    placeholder="5.00"
                  />
                  <CampoTexto
                    etiqueta="Precio (VES)"
                    name="precio_ves"
                    type="number"
                    step="0.01"
                    value={formulario.precio_ves ?? ''}
                    onChange={(e) => setFormulario({ ...formulario, precio_ves: e.target.value })}
                    placeholder={formatearVES(10, tasa)}
                    readOnly
                  />
                </div>
                <CampoTexto
                  etiqueta="URL de imagen"
                  name="imagen_url"
                  value={formulario.imagen_url}
                  onChange={(e) => setFormulario({ ...formulario, imagen_url: e.target.value })}
                  placeholder="https://ejemplo.com/pizza.jpg"
                />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formulario.activo}
                    onChange={(e) =>
                      setFormulario({ ...formulario, activo: e.target.checked })
                    }
                    className="rounded text-vecinos-naranja focus:ring-vecinos-naranja"
                  />
                  <span className="text-sm text-vecinos-texto">Producto disponible</span>
                </label>
                <Boton type="submit" anchoCompleto disabled={cargando}>
                  {editando ? 'Guardar cambios' : 'Crear producto'}
                </Boton>
                {editando && (
                  <Boton
                    type="button"
                    onClick={() => {
                      setEditando(null);
                      setFormulario({ nombre: '', categoria: '', descripcion: '', precio_usd: '', precio_ves: '', imagen_url: '', activo: true });
                    }}
                    variante="secundario"
                    anchoCompleto
                  >
                    Cancelar
                  </Boton>
                )}
              </form>
            </div>

            <div className="bg-white rounded-3xl shadow-vecinos p-4 text-center">
              <p className="text-xs text-vecinos-texto-claro mb-2">Tipo de cambio</p>
              <p className="text-xl font-bold text-vecinos-naranja">
                $1 USD = {tasa.toLocaleString('es-VE', { minimumFractionDigits: 2 })} VES
              </p>
              <p className="text-xs text-vecinos-texto-claro">
                Rango sugerido: 5 a 20 USD
              </p>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl shadow-vecinos overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-orange-50 border-b border-orange-100">
                  <tr>
                    <th className="px-4 py-3 text-xs font-bold text-vecinos-texto-claro uppercase">Imagen</th>
                    <th className="px-4 py-3 text-xs font-bold text-vecinos-texto-claro uppercase">Producto</th>
                    <th className="px-4 py-3 text-xs font-bold text-vecinos-texto-claro uppercase">Categoria</th>
                    <th className="px-4 py-3 text-xs font-bold text-vecinos-texto-claro uppercase text-right">USD</th>
                    <th className="px-4 py-3 text-xs font-bold text-vecinos-texto-claro uppercase text-right">VES</th>
                    <th className="px-4 py-3 text-xs font-bold text-vecinos-texto-claro uppercase">Estado</th>
                    <th className="px-4 py-3 text-xs font-bold text-vecinos-texto-claro uppercase text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-50">
                  {productos.map((p) => (
                    <tr key={p.id} className="hover:bg-orange-25 transition-colors">
                      <td className="px-4 py-3">
                        {p.imagen_url ? (
                          <img src={p.imagen_url} alt={p.nombre} className="w-12 h-12 rounded-xl object-cover border border-orange-100" />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-300">🍕</div>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-vecinos-texto">{p.nombre}</td>
                      <td className="px-4 py-3 text-sm text-vecinos-texto-claro">{p.categoria ?? '—'}</td>
                      <td className="px-4 py-3 text-sm font-bold text-vecinos-texto text-right">${Number(p.precio_usd ?? 0).toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-vecinos-texto-claro text-right">
                        {formatearVES(Number(p.precio_usd ?? 0), tasa)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                            p.activo
                              ? 'bg-green-50 text-green-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {p.activo ? 'Disponible' : 'Oculto'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => editar(p)}
                            className="text-vecinos-naranja hover:text-orange-600"
                            title="Editar"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => alternar(p)}
                            className={`text-sm ${p.activo ? 'text-orange-600' : 'text-green-600'}`}
                            title={p.activo ? 'Ocultar' : 'Publicar'}
                          >
                            {p.activo ? 'Ocultar' : 'Publicar'}
                          </button>
                          <button
                            onClick={() => eliminar(p.id)}
                            className="text-vecinos-rojo hover:text-red-600"
                            title="Eliminar"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {productos.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-vecinos-texto-claro">
                        No hay productos registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
