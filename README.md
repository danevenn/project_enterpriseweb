# Carpintería Los Artesanos — project_enterpriseweb

Web unificada para un cliente de carpintería: **sitio público** + **panel de gestión privado**.
Unifica en un solo código tres proyectos previos (sitio `task6`, autenticación `task7`,
inventario `task8`).

## Qué incluye

- **Sitio público** (`/`, `/proyectos`, `/proyectos/[slug]`, `/sobre-nosotros`, `/contacto`):
  portfolio del taller, ahora servido desde Postgres.
- **Autenticación** (`/login`, `/register`): NextAuth v4 con Firebase (email/contraseña) y
  GitHub OAuth. El panel queda protegido por `proxy.ts`.
- **Panel de gestión** (`/panel`), tras login:
  - **Materiales** — inventario de taller (maderas, herrajes, acabados, consumibles) con
    unidades, stock, mínimo, coste y proveedor; aviso de stock bajo.
  - **Productos** — catálogo de muebles/piezas con precio, stock e imagen.
  - **Proyectos** — gestión del portfolio que se muestra en la web pública.
  - **Categorías** — de materiales y de productos.

## Stack

- **Next.js 16** (App Router, Server Components/Actions, `src/`). En Next 16 el antiguo
  `middleware.ts` se llama **`proxy.ts`**.
- **React 19.2** + **TypeScript 5** (strict)
- **Tailwind CSS v4** + shadcn / base-ui + **motion**
- **Prisma 6** + **PostgreSQL 16** (Docker local)
- **NextAuth v4** + **Firebase Auth** (identidades) — estrategia JWT
- **@tanstack/react-query**, **react-hook-form**, **zod 4**, **zustand**
- Gestor de paquetes: **pnpm**

> Dos orígenes de datos: las **identidades** viven en Firebase; el **negocio** (inventario y
> portfolio) en Postgres. NextAuth usa JWT, por lo que no requiere adaptador de BD.

## Desarrollo local

```bash
pnpm install                 # instalar dependencias (genera el cliente Prisma)
cp .env.local.example .env.local   # rellenar variables (ver abajo)
docker compose up -d         # Postgres 16 local (host:5433)
pnpm prisma migrate dev      # aplicar migraciones
pnpm db:seed                 # datos demo (categorías, materiales, productos, proyectos)
pnpm dev                     # servidor de desarrollo
```

### Variables de entorno (`.env.local`)

| Variable | Para qué |
| --- | --- |
| `DATABASE_URL` / `DIRECT_URL` | Postgres (runtime / migraciones) |
| `NEXTAUTH_URL` / `NEXTAUTH_SECRET` | NextAuth (sesión JWT) |
| `GITHUB_ID` / `GITHUB_SECRET` | OAuth de GitHub |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase Auth (email/contraseña) |

Con Docker local, `DATABASE_URL` y `DIRECT_URL` apuntan a
`postgresql://enterpriseweb:enterpriseweb@localhost:5433/enterpriseweb?schema=public`.

## Scripts

| Script | Acción |
| --- | --- |
| `pnpm dev` | Servidor de desarrollo |
| `pnpm build` | Build de producción |
| `pnpm typecheck` | `tsc --noEmit` (gate de tipos) |
| `pnpm lint` | ESLint |
| `pnpm db:migrate` | `prisma migrate dev` |
| `pnpm db:seed` | Sembrar datos demo |
| `pnpm db:studio` | Prisma Studio |

## Estructura

- `src/app/(site)/` — sitio público (Header/Footer propios).
- `src/app/login`, `src/app/register` — auth (sin chrome público).
- `src/app/panel/` — panel privado (layout con sidebar + guardia de sesión).
- `src/app/api/` — route handlers: `auth`, `products`, `materials`, `product-categories`,
  `material-categories`, `projects`.
- `src/components/` — UI (`ui/`, `site/`, `panel/`) y vistas del inventario/portfolio.
- `src/lib/` — `db`, `auth`, `firebase`, `validations` (zod), `types`, helpers.
- `prisma/` — `schema.prisma`, `seed.ts`, `seed-data/` (portfolio inicial).

## Pendiente / notas

- Los campos compuestos de proyecto (dimensiones, proceso, testimonio) se conservan al editar
  pero aún no son editables desde el formulario del panel.
- Subida de imágenes: por ahora se introducen como URL.
