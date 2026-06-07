# Tests de integración de las API Routes

## Unitario vs. integración: la diferencia con un ejemplo

Ambos validan comportamiento, pero a distinta escala y aislamiento.

- **Unitario** — prueba **una pieza aislada**, sin dependencias externas.
  Ejemplo: `isLowStock({ stock: 3 }, 5)` devuelve `true`. No hay red, ni base de
  datos, ni framework: es una función pura. Corre en milisegundos y, si falla,
  el problema está en esa función y en ninguna otra parte.

- **Integración** — prueba **varias piezas colaborando de verdad**. Ejemplo:
  `POST /api/products` con `{ name: "Test-Aparador", price: 980.5, categoryId }`
  ejecuta la Route Handler completa: parsea el body, lo valida con el
  `createProductSchema` de zod, inserta con Prisma en **Postgres real** y
  devuelve **201** con el producto (incluida su `category` por el `include`). Si
  el precio es negativo, el mismo camino devuelve **400** vía `validationError`.
  Aquí no mockeamos ni la validación ni la base de datos: comprobamos que esas
  capas encajan.

Regla práctica: el unitario te dice *"esta función es correcta"*; el de
integración te dice *"estas piezas, juntas, hacen lo que el cliente espera"*.

## ¿Por qué no se puede usar Supertest con Next.js?

**Supertest** envuelve un servidor HTTP de Node (típicamente una app de Express:
`request(app).post("/products")`). Necesita una **instancia de servidor** a la
que conectarse.

Las **API Routes de Next.js no son eso**: son funciones (`export async function
GET(request: Request)`, `POST`, `PATCH`…) que el runtime de Next ejecuta
internamente, resolviendo por su cuenta el enrutado, los `params` de las rutas
dinámicas (`/api/products/[id]/stock`), el `Request`/`Response` de la plataforma
web y el contexto del App Router. No hay un `app` de Express que pasarle a
Supertest, así que no encaja.

## Qué resuelve `next-test-api-route-handler` (NTARH)

NTARH **monta el entorno que Next pondría alrededor del handler** y te deja
lanzarle peticiones HTTP reales:

```ts
import { testApiHandler } from "next-test-api-route-handler";
import * as productsHandler from "@/app/api/products/route";

await testApiHandler({
  appHandler: productsHandler,           // el módulo de la Route Handler tal cual
  async test({ fetch }) {
    const res = await fetch({ method: "GET" });   // petición real al handler
    expect(res.status).toBe(200);
  },
});
```

- **`appHandler`** recibe el módulo de la ruta (sus `GET`/`POST`/…) tal como lo
  exporta el App Router.
- **`fetch`** dentro de `test` hace una petición HTTP de verdad contra ese
  handler, con sus headers y su body.
- Para rutas dinámicas se le pasan los `params`:
  `testApiHandler({ appHandler, params: { id }, test })`, de modo que
  `PATCH /api/products/[id]/stock` recibe su `id`.

Así testeamos el handler **como lo invoca Next en producción**, sin levantar el
servidor completo ni inventar un Express.

## Cómo se ejecutan aquí

- Base de datos: el **mismo Postgres de Docker** (puerto 5433) pero un **schema
  `test` aislado**, configurado en `.env.test`. No es Neon (eso es de otro
  proyecto). Preparar el schema una vez:

  ```bash
  pnpm exec dotenv -e .env.test -- prisma db push   # o migrate deploy
  ```

- Aislamiento: cada producto de test se prefija con `Test-`. `beforeEach` borra
  esas filas antes de cada caso; `afterAll` limpia y desconecta Prisma. Los datos
  de desarrollo nunca se tocan.

- Comando: `pnpm test:integration` (usa `vitest.integration.config.ts`, entorno
  Node y carga de `.env.test`). Requiere Docker arriba.

Archivos: `src/test/integration/products-api.test.ts`,
`src/test/integration/product-stock-api.test.ts`.
