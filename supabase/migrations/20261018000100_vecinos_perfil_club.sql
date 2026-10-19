-- ============================================================================
-- Perfil automático de Vecinos Club
-- Cada vez que se registra un usuario en Supabase Auth, se crea su ficha
-- en el esquema vecinos_pizzeria con 100 puntos de bienvenida.
-- ============================================================================

CREATE OR REPLACE FUNCTION vecinos_pizzeria.crear_perfil_club()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = vecinos_pizzeria, public
AS $$
BEGIN
  INSERT INTO vecinos_pizzeria.clientes_vecinos (auth_id, nombre, telefono, puntos)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'nombre', new.email),
    new.raw_user_meta_data->>'telefono',
    100
  )
  ON CONFLICT (auth_id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS al_crear_usuario ON auth.users;

CREATE TRIGGER al_crear_usuario
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION vecinos_pizzeria.crear_perfil_club();
