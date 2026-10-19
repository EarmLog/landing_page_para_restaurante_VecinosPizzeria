/**
 * Script temporal: asigna imágenes profesionales SVG a los productos
 * en Supabase (esquema vecinos_pizzeria).
 */

import { createClient } from '@supabase/supabase-js';
import {
  IMG_MARGARITA,
  IMG_PEPPERONI,
  IMG_HAWAIANA,
  IMG_HELADO,
  IMG_REFRESCO,
} from '@/lib/imagenesProductos';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  db: { schema: 'vecinos_pizzeria' },
});

const IMAGENES: Record<string, string> = {
  Margarita: IMG_MARGARITA,
  Pepperoni: IMG_PEPPERONI,
  Hawaiana: IMG_HAWAIANA,
  Helado: IMG_HELADO,
  'Refresco Cola': IMG_REFRESCO,
};

async function main() {
  const { data: productos, error } = await supabase
    .from('productos')
    .select('id, nombre');

  if (error) {
    console.error('Error obteniendo productos:', error);
    return;
  }

  for (const p of productos ?? []) {
    const imagen = IMAGENES[p.nombre];
    if (!imagen) {
      console.warn(`Sin imagen para: ${p.nombre}`);
      continue;
    }
    const { error: updErr } = await supabase
      .from('productos')
      .update({ imagen_url: imagen })
      .eq('id', p.id);
    if (updErr) {
      console.error(`Error actualizando ${p.nombre}:`, updErr);
    } else {
      console.log(`✅ ${p.nombre} -> imagen asignada`);
    }
  }

  console.log('Listo. Imágenes asignadas a los productos.');
}

main().catch(console.error);
