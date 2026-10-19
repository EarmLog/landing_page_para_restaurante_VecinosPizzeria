-- ============================================================================
-- Extiende productos con precio USD/VES, imagen y estado
-- Y otorga permisos de escritura al usuario administrador autenticado.
-- ============================================================================

ALTER TABLE vecinos_pizzeria.productos
  ADD COLUMN IF NOT EXISTS precio_usd NUMERIC(6,2) DEFAULT 10,
  ADD COLUMN IF NOT EXISTS precio_ves NUMERIC(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS imagen_url TEXT,
  ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT TRUE;

-- Actualizar productos existentes con precios de referencia (Venezuela: 5$ a 20$)
UPDATE vecinos_pizzeria.productos
SET precio_usd = 12.00, precio_ves = 12.00 * 36.5, activo = TRUE
WHERE precio_usd IS NULL;

-- RLS: permitir lectura pública (ya existía) y escritura solo para admin autenticado
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'vecinos_pizzeria'
      AND tablename = 'productos'
      AND policyname = 'admin_gestiona_productos'
  ) THEN
    CREATE POLICY admin_gestiona_productos
      ON vecinos_pizzeria.productos
      FOR ALL
      TO authenticated
      USING (auth.jwt() ->> 'email' = 'Earm2771@gmail.com')
      WITH CHECK (auth.jwt() ->> 'email' = 'Earm2771@gmail.com');
  END IF;
END $$;
