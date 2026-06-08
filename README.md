# Taller Sagra · Ebanistería de autor

[![CI](https://github.com/danevenn/project_enterpriseweb/actions/workflows/ci.yml/badge.svg)](https://github.com/danevenn/project_enterpriseweb/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/danevenn/project_enterpriseweb/branch/main/graph/badge.svg)](https://codecov.io/gh/danevenn/project_enterpriseweb)
[![TypeScript strict](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](tsconfig.json)

Presencia digital completa para un taller de ebanistería: una **web pública** que presenta el
oficio y el portfolio, y un **panel de gestión privado** desde el que el taller administra su
inventario y los proyectos que se muestran al público. Un solo producto, dos audiencias —el cliente
final y el equipo del taller— sobre una base técnica moderna y probada.

🔗 **Demo en vivo:** **https://projectenterpriseweb.vercel.app**
🔑 **Acceso de solo lectura al panel:** botón *"Entrar como demostración"* en
[`/login`](https://projectenterpriseweb.vercel.app/login) — ver [`docs/demo.md`](docs/demo.md).

> *Taller Sagra es una marca ficticia, ambientada en Illescas (La Sagra, Toledo), creada para
> mostrar el producto de principio a fin: diseño, contenido, datos reales en base de datos,
> autenticación y operativa de panel.*

## El producto

Un taller artesanal necesita transmitir oficio y, a la vez, gestionar su día a día sin fricción.
Esta aplicación cubre ambas cosas:

- **Para el visitante** — una web cuidada que cuenta quién es el taller, qué hace y qué ha hecho,
  con un portfolio de proyectos detallado y un canal de contacto directo.
- **Para el taller** — un panel privado donde mantener el inventario (materiales y catálogo) y
  publicar o editar el portfolio que ve el público, con control de acceso por sesión.

El contenido público se sirve **desde base de datos**: lo que el taller edita en el panel es lo que
ve el cliente, sin tocar código ni volver a desplegar.

## Qué incluye

- **Sitio público** (`/`, `/proyectos`, `/proyectos/[slug]`, `/sobre-nosotros`, `/contacto`):
  presentación del taller y portfolio servido desde Postgres.
- **Autenticación** (`/login`, `/register`): NextAuth v4 con Firebase (email/contraseña) y
  GitHub OAuth. El panel queda protegido a nivel de servidor por `proxy.ts`.
- **Panel de gestión** (`/panel`), tras iniciar sesión:
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

## Arquitectura

![Diagrama de arquitectura del sistema](docs/arquitectura/diagrama.png)

> Fuente editable del diagrama: [`docs/arquitectura/diagrama.md`](docs/arquitectura/diagrama.md)
> (Mermaid, se renderiza en GitHub). El PNG se exporta desde ahí.

| Capa | Tecnología | Dónde se ejecuta |
| --- | --- | --- |
| Navegador (cliente) | React 19 + TanStack Query + Zustand | Dispositivo del usuario |
| Renderizado y API | Next.js 16 (Server Components, Route Handlers) | Vercel Functions · región `fra1` |
| Autenticación | NextAuth v4 (JWT) + Firebase Identity Toolkit | Vercel (sesión) · Firebase (identidades) |
| Persistencia | Prisma 6 → PostgreSQL | Neon · región EU `fra1` (Frankfurt) |

El cómputo de Vercel y la base de datos Neon están **co-localizados en `fra1`**: cada query
app↔BD paga ~3 ms en lugar de los ~90 ms que costaba con la BD en EE. UU. (ver
[ADR-002](docs/adr/ADR-002-neon-region-eu.md)).

## Decisiones técnicas

Las decisiones de arquitectura relevantes están documentadas como
**[ADRs](docs/adr/)** (Architecture Decision Records). Resumen:

| Decisión | Alternativas descartadas | Razón principal |
| --- | --- | --- |
| [NextAuth v4 + Firebase](docs/adr/ADR-001-nextauth-firebase.md) | Firebase Auth puro en cliente · tabla de usuarios en Postgres | Identidades gestionadas (verificación, reset) sin guardar credenciales; sesión propia con JWT y rutas protegidas en el servidor |
| [Neon en EU `fra1`](docs/adr/ADR-002-neon-region-eu.md) | Neon en `us-east-1` · Postgres local | Latencia desde España: suite de integración 12,5 s → 3,1 s al mover la BD a Frankfurt |
| [Pirámide de tests](docs/adr/ADR-003-estrategia-testing.md) | Solo E2E · sin tests | Confianza con coste proporcionado: mucho unitario barato, poca integración, mínimo E2E |
| [Zustand para UI](docs/adr/ADR-004-zustand-estado-ui.md) | React Context · estado en URL | Evitar re-renders en cascada y prop-drilling de los filtros del inventario |

## Calidad y testing

Suite siguiendo la **pirámide de tests** (documentada en [`docs/testing/`](docs/testing/)):

| Nivel | Qué cubre | Herramientas |
|------|-----------|--------------|
| **Unitario / componente** (54) | utilidades puras de inventario (`product-utils`, `material-utils`), formato, store Zustand, formato y wrapper de errores de API (`api.ts`), y `ProductList`/`CategoryFilter` con MSW | Vitest · Testing Library · MSW |
| **Integración** | Route Handlers de productos y materiales (zod + Prisma) contra un Postgres real | next-test-api-route-handler |
| **E2E** (4) | alta de producto, filtrado por categoría, ajuste de stock (login real) | Playwright |

Las utilidades puras de inventario (`product-utils`, `material-utils`, `format`) están al **100 %**
de cobertura (umbral forzado en `vitest.config.ts`); el resto de módulos medidos, por encima del 80 %.

```bash
pnpm test              # unitarios + componente (sin infraestructura, ~1s)
pnpm test:coverage     # cobertura (100% en utilidades de producto)
pnpm test:integration  # Route Handlers contra Postgres
pnpm test:e2e          # flujos completos en navegador (requiere Firebase + BD sembrada)
```

El CI (GitHub Actions) ejecuta en cada push y PR: **typecheck**, **lint**, **tests
unitarios/componente** (con cobertura), **integración** y **E2E** (Playwright). La integración y el
E2E usan un **Postgres efímero** como *service container* (sembrado para el E2E); el E2E hace **login
real** contra Firebase con un usuario de test y se omite en PRs de *forks* (sin acceso a los secrets).

## Seguridad de acceso

- El panel (`/panel`) está protegido en el **servidor** por `src/proxy.ts` (`withAuth`).
- Las **mutaciones** de la API (`POST`/`PATCH`/`DELETE`) exigen sesión vía `requireWriteAccess()`
  ([`src/lib/api-auth.ts`](src/lib/api-auth.ts)): **401** sin sesión, **403** para la cuenta de
  demostración (solo lectura) y permitido al resto. Las lecturas (`GET`) son públicas.
- `proxy.ts` añade además cabeceras de seguridad a todas las respuestas.

## Desarrollo local

**Requisitos:** Node 22+, pnpm 11.

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
- `src/components/` — UI por dominio:
  - `ui/` — design system (shadcn / base-ui).
  - `site/` — componentes del sitio público (hero, secciones, fichas de proyecto).
  - `panel/` — chrome del panel (sidebar, barra móvil).
  - `inventory/` — gestión de productos, materiales y categorías.
  - `portfolio/` — gestión del portfolio de proyectos.
  - `motion/`, `icons/` — animaciones e iconos.
- `src/lib/` — `db`, `auth`, `firebase`, `validations` (zod), `product-utils`, `format`, helpers.
- `src/stores/` — Zustand (filtros del inventario). `src/hooks/` — TanStack Query.
- `src/test/`, `e2e/` — mocks MSW, tests de integración y E2E (Playwright + Page Objects).
- `prisma/` — `schema.prisma`, `seed.ts`, `seed-data/`.

## Documentación

| Documento | Contenido |
| --- | --- |
| [`docs/demo.md`](docs/demo.md) | Demo de la capa de usuario (acceso, cuenta demo de solo lectura) |
| [`docs/arquitectura/`](docs/arquitectura/) | Diagrama del sistema (fuente Mermaid + PNG) |
| [`docs/adr/`](docs/adr/) | Architecture Decision Records (4 decisiones clave) |
| [`docs/testing/`](docs/testing/) | Estrategia de tests, integración y E2E |
| [`docs/auditoria/deuda-tecnica.md`](docs/auditoria/deuda-tecnica.md) | Auditoría de calidad: hallazgos y cómo se resolvieron |
| [`docs/portfolio/reflexion-final.md`](docs/portfolio/reflexion-final.md) | Reflexión técnica sobre el proyecto |

## Hoja de ruta

- Edición de los campos compuestos de proyecto (dimensiones, proceso, testimonio) desde el
  formulario del panel: hoy se conservan al editar, pero aún no son editables.
- Subida de imágenes: por ahora las imágenes se introducen como URL.
