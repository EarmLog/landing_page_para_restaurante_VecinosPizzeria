/**
 * Esquema SQLite para Tauri (.exe) y Capacitor (Android)
 * Base de datos local offline-first para continuidad en caja/menú
 */

export const SQLITE_SCHEMA = `
-- Tabla de productos
CREATE TABLE IF NOT EXISTS productos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  categoria TEXT NOT NULL,
  precio REAL NOT NULL,
  ingredientes TEXT,
  disponible INTEGER DEFAULT 1,
  imagen TEXT,
  sincronizado INTEGER DEFAULT 0,
  fechaCreacion TEXT NOT NULL,
  fechaActualizacion TEXT NOT NULL
);

-- Tabla de pedidos
CREATE TABLE IF NOT EXISTS pedidos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  numeroPedido TEXT UNIQUE NOT NULL,
  clienteNombre TEXT,
  clienteTelefono TEXT,
  clienteEmail TEXT,
  tipoPedido TEXT NOT NULL,
  productos TEXT NOT NULL,
  subtotal REAL NOT NULL,
  descuento REAL DEFAULT 0,
  total REAL NOT NULL,
  estado TEXT NOT NULL,
  notas TEXT,
  fechaCreacion TEXT NOT NULL,
  fechaActualizacion TEXT NOT NULL,
  sincronizado INTEGER DEFAULT 0,
  idSupabase TEXT
);

-- Tabla de clientes fieles (Vecinos Club)
CREATE TABLE IF NOT EXISTS clientes_fieles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  telefono TEXT UNIQUE NOT NULL,
  email TEXT,
  puntos INTEGER DEFAULT 0,
  fechaRegistro TEXT NOT NULL,
  sincronizado INTEGER DEFAULT 0
);

-- Tabla de configuración
CREATE TABLE IF NOT EXISTS configuracion (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  clave TEXT UNIQUE NOT NULL,
  valor TEXT NOT NULL,
  fechaActualizacion TEXT NOT NULL
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria);
CREATE INDEX IF NOT EXISTS idx_productos_disponible ON productos(disponible);
CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado);
CREATE INDEX IF NOT EXISTS idx_pedidos_fecha ON pedidos(fechaCreacion);
CREATE INDEX IF NOT EXISTS idx_clientes_telefono ON clientes_fieles(telefono);
`;
