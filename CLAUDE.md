# project_enterpriseweb

Web unificada de "Carpintería Los Artesanos": sitio público + panel privado. Unifica los
antiguos task6 (sitio), task7 (auth) y task8 (inventario). Next.js 16 App Router.

## Stack
- **Next.js 16** (App Router, Server Components/Actions, `src/`) + **React 19.2** + **TS 5** strict
- **Prisma 6** + **PostgreSQL 16** (Docker local, puerto **5433**)
- **NextAuth v4** + **Firebase Auth** (identidades, estrategia JWT) · **zod 4**
- **@tanstack/react-query** · **react-hook-form** · **zustand** · **motion**
- **Tailwind v4** · shadcn/base-ui · ESLint · **pnpm**

## Importante (Next 16)
- El antiguo `middleware.ts` se llama **`proxy.ts`** en Next 16. Aquí `src/proxy.ts` combina
  cabeceras de seguridad + protección de `/panel` con `withAuth` de NextAuth.
- Si dudas de una API de Next, consulta `node_modules/next/dist/docs/` (ver `AGENTS.md`).

## Modelo de datos (fuente canónica: `prisma/schema.prisma`)
- `ProductCategory` / `Product` (catálogo, tabla `products`).
- `MaterialCategory` / `Material` (inventario de taller; `unit` enum, `stock` Decimal).
- `Project` (portfolio público; arrays `String[]` + JSON para dimensions/process/testimonial).

## Estructura
- `src/app/(site)/` — público (layout con Header/Footer).
- `src/app/{login,register}` — auth. `src/app/panel/` — privado (layout con sidebar + guardia).
- `src/app/api/` — `auth`, `products`, `materials`, `product-categories`, `material-categories`,
  `projects` (patrón: zod `safeParse` + `validationError` de `src/lib/api.ts`).
- `src/data/projects.ts` — tipos de dominio + getters Prisma (las páginas públicas no cambian).
  Los datos semilla del portfolio viven en `prisma/seed-data/projects.ts`.
- `src/lib/` — `db`, `auth`, `firebase`, `validations` (zod), `types`, `format`, `http`.

## Comandos
- `pnpm dev` · `pnpm build` · `pnpm typecheck` (gate) · `pnpm lint`
- `docker compose up -d` — Postgres local · `pnpm prisma migrate dev` · `pnpm db:seed`
- Tras editar `schema.prisma`: `pnpm prisma generate`.

## Convenciones
- Validación con **zod** en `src/lib/validations.ts`; valida en las Route Handlers.
- Dos familias paralelas (productos / materiales): al tocar una, replica en la otra.
- Identidades en Firebase, negocio en Postgres: no hay tabla de usuarios en la BD.
