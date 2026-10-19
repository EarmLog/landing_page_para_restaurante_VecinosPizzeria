/**
 * Cliente de Supabase para Vecino's Pizzería
 * Configurado con esquema personalizado 'vecinos_pizzeria' para aislamiento multi-app
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseSchema = process.env.NEXT_PUBLIC_SUPABASE_SCHEMA || 'vecinos_pizzeria';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: supabaseSchema,
  },
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'x-application-name': 'vecinos-pizzeria',
    },
  },
});
