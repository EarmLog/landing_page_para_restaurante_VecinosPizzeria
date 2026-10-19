-- ============================================================================
-- Esquema dedicado para la aplicación Vecino's Pizzería
-- Aislado del resto de apps que comparten el mismo proyecto Supabase.
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS vecinos_pizzeria;

-- Exponer el esquema a la API de Supabase (PostgREST)
GRANT USAGE ON SCHEMA vecinos_pizzeria TO anon, authenticated, service_role;

-- ----------------------------------------------------------------------------
-- Tabla: categorias
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vecinos_pizzeria.categorias (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre      text NOT NULL UNIQUE,
  orden       integer NOT NULL DEFAULT 0,
  activa      boolean NOT NULL DEFAULT true,
  creado_en   timestamptz NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- Tabla: productos (pizzas, bebidas, postres)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vecinos_pizzeria.productos (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria_id   uuid REFERENCES vecinos_pizzeria.categorias(id) ON DELETE SET NULL,
  codigo         text NOT NULL UNIQUE,
  nombre         text NOT NULL,
  descripcion    text,
  precio         numeric(10,2) NOT NULL DEFAULT 0,
  ingredientes   text[] NOT NULL DEFAULT '{}',
  imagen_url     text,
  disponible     boolean NOT NULL DEFAULT true,
  creado_en      timestamptz NOT NULL DEFAULT now(),
  actualizado_en timestamptz NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- Tabla: clientes_vecinos (programa de fidelización Vecinos Club)
-- Se vincula con auth.users mediante auth_id
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vecinos_pizzeria.clientes_vecinos (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id        uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre         text NOT NULL,
  telefono       text,
  correo         text,
  puntos         integer NOT NULL DEFAULT 0,
  nivel          text NOT NULL DEFAULT 'vecino' CHECK (nivel IN ('vecino', 'frecuente', 'vip')),
  creado_en      timestamptz NOT NULL DEFAULT now(),
  actualizado_en timestamptz NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- Tabla: pedidos
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vecinos_pizzeria.pedidos (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_pedido    text NOT NULL UNIQUE,
  cliente_id       uuid REFERENCES vecinos_pizzeria.clientes_vecinos(id) ON DELETE SET NULL,
  cliente_nombre   text,
  cliente_telefono text,
  tipo_pedido      text NOT NULL CHECK (tipo_pedido IN ('mesa', 'domicilio', 'recoger')),
  subtotal         numeric(10,2) NOT NULL DEFAULT 0,
  descuento        numeric(10,2) NOT NULL DEFAULT 0,
  total            numeric(10,2) NOT NULL DEFAULT 0,
  estado           text NOT NULL DEFAULT 'pendiente'
                   CHECK (estado IN ('pendiente', 'en_preparacion', 'listo', 'entregado', 'cancelado')),
  notas            text,
  direccion        text,
  creado_en        timestamptz NOT NULL DEFAULT now(),
  actualizado_en   timestamptz NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- Tabla: pedido_items (detalle de cada pedido)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vecinos_pizzeria.pedido_items (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id        uuid NOT NULL REFERENCES vecinos_pizzeria.pedidos(id) ON DELETE CASCADE,
  producto_id      uuid REFERENCES vecinos_pizzeria.productos(id) ON DELETE SET NULL,
  nombre_producto  text NOT NULL,
  cantidad         integer NOT NULL DEFAULT 1 CHECK (cantidad > 0),
  precio_unitario  numeric(10,2) NOT NULL DEFAULT 0,
  personalizacion  jsonb NOT NULL DEFAULT '{}'::jsonb,
  creado_en        timestamptz NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- Tabla: promociones
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vecinos_pizzeria.promociones (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo            text NOT NULL,
  descripcion       text,
  descuento         numeric(10,2) NOT NULL DEFAULT 0,
  puntos_requeridos integer NOT NULL DEFAULT 0,
  activa            boolean NOT NULL DEFAULT true,
  valida_desde      timestamptz,
  valida_hasta      timestamptz,
  creado_en         timestamptz NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- Índices de rendimiento
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON vecinos_pizzeria.productos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_productos_disponible ON vecinos_pizzeria.productos(disponible);
CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON vecinos_pizzeria.pedidos(estado);
CREATE INDEX IF NOT EXISTS idx_pedidos_creado ON vecinos_pizzeria.pedidos(creado_en DESC);
CREATE INDEX IF NOT EXISTS idx_clientes_auth ON vecinos_pizzeria.clientes_vecinos(auth_id);

-- ----------------------------------------------------------------------------
-- Permisos de acceso por rol
-- ----------------------------------------------------------------------------
GRANT SELECT ON vecinos_pizzeria.categorias, vecinos_pizzeria.productos,
  vecinos_pizzeria.promociones TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA vecinos_pizzeria TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA vecinos_pizzeria TO service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA vecinos_pizzeria
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA vecinos_pizzeria
  GRANT SELECT ON TABLES TO anon;

-- ============================================================================
-- Seguridad a nivel de fila (RLS)
-- ============================================================================
ALTER TABLE vecinos_pizzeria.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE vecinos_pizzeria.productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE vecinos_pizzeria.promociones ENABLE ROW LEVEL SECURITY;
ALTER TABLE vecinos_pizzeria.clientes_vecinos ENABLE ROW LEVEL SECURITY;
ALTER TABLE vecinos_pizzeria.pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE vecinos_pizzeria.pedido_items ENABLE ROW LEVEL SECURITY;

-- Lectura pública del menú
CREATE POLICY "menu_publico_categorias" ON vecinos_pizzeria.categorias
  FOR SELECT TO anon, authenticated USING (activa = true);
CREATE POLICY "menu_publico_productos" ON vecinos_pizzeria.productos
  FOR SELECT TO anon, authenticated USING (disponible = true);
CREATE POLICY "promociones_publicas" ON vecinos_pizzeria.promociones
  FOR SELECT TO anon, authenticated USING (activa = true);

-- Cada cliente solo ve y edita su propio registro de Vecinos Club
CREATE POLICY "cliente_ve_su_perfil" ON vecinos_pizzeria.clientes_vecinos
  FOR SELECT TO authenticated USING (auth_id = auth.uid());
CREATE POLICY "cliente_edita_su_perfil" ON vecinos_pizzeria.clientes_vecinos
  FOR UPDATE TO authenticated USING (auth_id = auth.uid());

-- El personal autenticado puede gestionar todo el menú y los pedidos
CREATE POLICY "personal_gestiona_categorias" ON vecinos_pizzeria.categorias
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "personal_gestiona_productos" ON vecinos_pizzeria.productos
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "personal_gestiona_promociones" ON vecinos_pizzeria.promociones
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "personal_gestiona_clientes" ON vecinos_pizzeria.clientes_vecinos
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "personal_gestiona_pedidos" ON vecinos_pizzeria.pedidos
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "personal_gestiona_items" ON vecinos_pizzeria.pedido_items
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================================
-- Datos iniciales de ejemplo (menú base)
-- ============================================================================
INSERT INTO vecinos_pizzeria.categorias (nombre, orden) VALUES
  ('Pizzas', 1),
  ('Bebidas', 2),
  ('Postres', 3)
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO vecinos_pizzeria.productos (codigo, nombre, descripcion, precio, ingredientes, categoria_id)
SELECT datos.codigo, datos.nombre, datos.descripcion, datos.precio, datos.ingredientes,
       (SELECT id FROM vecinos_pizzeria.categorias WHERE nombre = datos.categoria)
FROM (VALUES
  ('PZ-001', 'Margarita', 'Salsa de tomate, mozzarella fresca y albahaca', 149.00,
    ARRAY['salsa de tomate','mozzarella','albahaca'], 'Pizzas'),
  ('PZ-002', 'Pepperoni', 'Salsa de tomate, mozzarella y pepperoni', 169.00,
    ARRAY['salsa de tomate','mozzarella','pepperoni'], 'Pizzas'),
  ('PZ-003', 'Hawaiana', 'Jamón, piña, mozzarella y salsa de tomate', 179.00,
    ARRAY['salsa de tomate','mozzarella','jamón','piña'], 'Pizzas'),
  ('BB-001', 'Refresco Cola', 'Refresco de cola 355ml', 25.00,
    ARRAY[]::text[], 'Bebidas'),
  ('PT-001', 'Helado', 'Vaso de helado de vainilla', 35.00,
    ARRAY['vainilla'], 'Postres')
) AS datos(codigo, nombre, descripcion, precio, ingredientes, categoria)
ON CONFLICT (codigo) DO NOTHING;
