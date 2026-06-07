# Carpintería Los Artesanos — project_enterpriseweb

[![CI](https://github.com/danevenn/project_enterpriseweb/actions/workflows/ci.yml/badge.svg)](https://github.com/danevenn/project_enterpriseweb/actions/workflows/ci.yml)

Web unificada para un cliente de carpintería: **sitio público** + **panel de gestión privado**.
Unifica en un solo código tres proyectos previos (sitio `task6`, autenticación `task7`,
inventario `task8`).

🔗 **En producción:** https://projectenterpriseweb.vercel.app

## Qué incluye

- **Sitio público** (`/`, `/proyectos`, `/proyectos/[slug]`, `/sobre-nosotros`, `/contacto`):
  portfolio del taller, servido desde Postgres.
- **Autenticación** (`/login`, `/register`): NextAuth v4 con Firebase (email/contraseña) y
  GitHub OAuth. El panel queda protegido por `proxy.ts`.
- **Panel de gestión** (`/panel`), tras login:
  - **Materiales** — inventario de taller (maderas, herrajes, acabados, consumibles) con
    unidades, stock, mínimo, coste y proveedor; aviso de stock bajo.
  - **Productos** — catálogo de muebles/piezas con precio, stock e imagen; ajuste de stock
    optimista y badge de "poco stock".
  - **Proyectos** — gestión del portfolio que se muestra en la web pública.
  - **Categorías** — de materiales y de productos.

## Stack

- **Next.js 16** (App Router, Server Components/Actions, `src/`). En Next 16 el antiguo
  `middleware.ts` se llama **`proxy.ts`**.
- **React 19.2** + **TypeScript 5** (strict)
- **Tailwind CSS v4** + shadcn / base-ui + **motion**
- **Prisma 6** + **PostgreSQL** — **Neon**, región EU (Frankfurt)
- **NextAuth v4** + **Firebase Auth** (identidades) — estrategia JWT
- **@tanstack/react-query**, **react-hook-form**, **zod 4**, **zustand**
- **Vitest** + **Testing Library** + **MSW**, **Playwright**, **next-test-api-route-handler**
- Gestor de paquetes: **pnpm** · Desplegado en **Vercel** (cómputo en `fra1`, junto a la BD)

> Dos orígenes de datos: las **identidades** viven en Firebase; el **negocio** (inventario y
> portfolio) en Postgres. NextAuth usa JWT, por lo que no requiere adaptador de BD.

## Testing

Suite siguiendo la **pirámide de tests** (documentada en [`docs/testing/`](docs/testing/)):

| Nivel | Qué cubre | Herramientas |
|------|-----------|--------------|
| **Unitario** (36) | `filterProducts`, `sortProducts`, `isLowStock`, `formatPrice`, store Zustand | Vitest |
| **Integración** (9) | `ProductList`/`CategoryFilter` con MSW · Route Handlers contra Postgres | Vitest · MSW · next-test-api-route-handler |
| **E2E** (4) | alta de producto, filtrado por categoría, ajuste de stock (login real) | Playwright |

```bash
pnpm test              # unitarios + componente (sin infraestructura, ~1s)
pnpm test:coverage     # cobertura (100% en utilidades de producto)
pnpm test:integration  # Route Handlers contra Postgres
pnpm test:e2e          # flujos completos en navegador (requiere Firebase + BD sembrada)
```

El CI (GitHub Actions) ejecuta typecheck, lint y los tests unitarios/integración en cada push y PR
(la integración usa un Postgres efímero como service container).

## Desarrollo local

**Requisitos:** Node 20+, pnpm 11.

```bash
pnpm install                       # instala dependencias (genera el cliente Prisma)
cp .env.local.example .env.local   # rellena las variables (ver abajo)
pnpm prisma migrate deploy         # aplica el esquema a tu BD
pnpm db:seed                       # datos demo (categorías, materiales, productos, proyectos)
pnpm dev                           # http://localhost:3000
```

> Alternativa con Postgres local en Docker: `docker compose up -d` levanta un Postgres 16 en el
> puerto 5433; apunta `DATABASE_URL`/`DIRECT_URL` a
> `postgresql://enterpriseweb:enterpriseweb@localhost:5433/enterpriseweb?schema=public`.

### Variables de entorno (`.env.local`)

| Variable | Para qué |
| --- | --- |
| `DATABASE_URL` / `DIRECT_URL` | Postgres (runtime pooled / migraciones directas) |
| `NEXTAUTH_URL` / `NEXTAUTH_SECRET` | NextAuth (sesión JWT) |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase Auth (email/contraseña) |
| `GITHUB_ID` / `GITHUB_SECRET` | OAuth de GitHub (opcional) |
| `E2E_USER_EMAIL` / `E2E_USER_PASSWORD` | Usuario de test para Playwright (opcional) |

## Scripts

| Script | Acción |
| --- | --- |
| `pnpm dev` / `pnpm build` | Desarrollo / build de producción |
| `pnpm typecheck` / `pnpm lint` | Gate de tipos / ESLint |
| `pnpm test` / `pnpm test:coverage` | Tests unitarios + componente |
| `pnpm test:integration` / `pnpm test:e2e` | Integración / E2E |
| `pnpm db:migrate` / `pnpm db:seed` / `pnpm db:studio` | Prisma |

## Estructura

- `src/app/(site)/` — sitio público (Header/Footer propios).
- `src/app/login`, `src/app/register` — auth (sin chrome público).
- `src/app/panel/` — panel privado (layout con sidebar + guardia de sesión).
- `src/app/api/` — route handlers: `auth`, `products`, `materials`, `product-categories`,
  `material-categories`, `projects`.
- `src/components/` — UI (`ui/`, `site/`, `panel/`) y vistas del inventario/portfolio.
- `src/lib/` — `db`, `auth`, `firebase`, `validations` (zod), `product-utils`, `format`, helpers.
- `src/stores/` — Zustand (filtros del inventario). `src/hooks/` — TanStack Query.
- `src/test/`, `e2e/` — mocks MSW, tests de integración y E2E (Playwright + Page Objects).
- `prisma/` — `schema.prisma`, `seed.ts`, `seed-data/`.

## Pendiente / notas

- Los campos compuestos de proyecto (dimensiones, proceso, testimonio) se conservan al editar
  pero aún no son editables desde el formulario del panel.
- Subida de imágenes: por ahora se introducen como URL.
