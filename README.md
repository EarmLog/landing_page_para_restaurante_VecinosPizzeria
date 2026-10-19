# Vecino's Pizzería

Aplicación multiplataforma (Web, Escritorio y Android) para la pizzería Vecino's.
Una sola base de código con Next.js, pensada para funcionar incluso sin internet
gracias a su capa local offline-first.

## ¿Qué incluye?

- **Landing page comercial** con menú digital interactivo y personalizador de pizzas.
- **Vecinos Club**: registro e inicio de sesión de clientes con Supabase Auth y puntos.
- **Comandera / POS** para recepción de pedidos en cocina.
- **Base de datos local híbrida**: IndexedDB (Dexie) en web, SQLite en Tauri y Capacitor.
- **Aislamiento multi-app**: todas las tablas viven en el esquema `vecinos_pizzeria`
  dentro de un proyecto Supabase compartido con otras aplicaciones.

## Tecnologías

- Next.js (App Router, `output: 'export'`) + React + Tailwind CSS
- Supabase (`@supabase/supabase-js`) con esquema personalizado
- Dexie.js (IndexedDB) / SQLite (Tauri + Capacitor)
- Tauri 2.0 (escritorio) y Capacitor 6 (Android)
- Docker (Node.js 20 LTS)

## Requisitos

- Node.js 20 o superior
- npm 9 o superior
- Opcional: Rust (para escritorio), Android Studio (para Android), Docker

## Configuración

1. Copia el archivo de ejemplo y completa las variables:

```bash
cp .env.example .env.local
```

Variables principales:

```
NEXT_PUBLIC_SUPABASE_URL=https://qqqpmabsdvqrjygvgfqy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
NEXT_PUBLIC_SUPABASE_SCHEMA=vecinos_pizzeria
```

2. Instala las dependencias:

```bash
npm install
```

3. Levanta el entorno de desarrollo:

```bash
npm run dev
```

## Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compila el sitio estático en `out/` |
| `npm run lint` | Revisa el estilo con ESLint |
| `npm run typecheck` | Verifica los tipos de TypeScript |
| `npm run tauri:dev` | Escritorio en modo desarrollo |
| `npm run tauri:build` | Genera el ejecutable portable |
| `npm run cap:sync` | Sincroniza assets con Capacitor |
| `npm run cap:android` | Ejecuta la app en Android |

## Base de datos Supabase

La migración con el esquema completo está en:

```
supabase/migrations/20261018000000_vecinos_pizzeria_schema.sql
```

Crea el esquema `vecinos_pizzeria` con tablas de productos, pedidos, clientes
del club y promociones, además de las políticas de seguridad (RLS).

## Docker

```bash
docker compose up
```

Levanta la app en `http://localhost:3000` dentro de un contenedor Node 20.

## Despliegue

- **Web:** Vercel (workflow `.github/workflows/vercel-deploy.yml`).
- **Escritorio:** GitHub Actions `.github/workflows/tauri-build.yml` genera el `.exe`.

## Licencia

Uso privado para Vecino's Pizzería.
