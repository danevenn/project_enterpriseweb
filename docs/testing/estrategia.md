# Estrategia de testing — Carpintería Los Artesanos

Esta suite cubre el **módulo de inventario de productos** (catálogo de muebles
terminados: `Product` / `ProductCategory`). En este proyecto los "materiales de
taller" (tableros, herrajes, barnices) son una **familia distinta** (`Material`),
así que aquí los ejemplos usan productos reales del catálogo y sus categorías de
seed: **Muebles a medida**, **Restauración** y **Complementos**.

## La pirámide de tests

La idea: **muchos** tests baratos y rápidos en la base, **algunos** de
integración en el medio y **pocos** E2E lentos en la cima. Se decide así por tres
variables: velocidad de ejecución, precisión del diagnóstico cuando algo falla y
coste de mantenimiento.

### 1. Unitario (la base — muchos, milisegundos)

Lógica pura, sin DOM ni red: entrada → salida determinista. Si falla, te señala
la línea exacta.

- **`filterProducts`** — buscar "aparador" devuelve solo *"Aparador nórdico de
  nogal"*; buscar "Restauración" (una categoría) **no** devuelve filas, porque,
  igual que la API, solo mira el `name` del producto.
- **`sortProducts`** — ordenar por `price` descendente coloca la *"Mesa de
  comedor en roble"* (1.290 €) antes que la *"Tabla de cortar de olivo"* (34,90 €).
- **`isLowStock`** — con umbral 5, la *"Mesa de comedor en roble"* (stock 3) está
  en "poco stock"; el *"Aparador"* agotado (stock 0) también; la *"Tabla de
  cortar"* (stock 22) no.
- **`formatPrice`** — `89.5 → "89,50 €"` con la convención española (coma
  decimal, € al final, sin separar millares hasta 5 cifras).
- **Store de Zustand** (`useUIStore`) — `resetFilters` devuelve `searchQuery` y
  `selectedCategoryId` a su estado inicial.

Archivos: `src/lib/product-utils.test.ts`, `src/lib/format.test.ts`,
`src/stores/ui-store.test.ts`.

### 2. Integración (el medio — algunos, decenas de ms)

Varias piezas colaborando: un componente con sus hooks y la red simulada, o una
Route Handler con la base de datos real.

- **`ProductList` + MSW** — render del componente, que llama a `/api/products`
  (interceptado por MSW): aparecen *"Mesa de comedor en roble"* y *"Aparador
  nórdico de nogal"*; si la red falla, sale el estado de error con botón
  *"Reintentar"*.
- **`CategoryFilter` + MSW** — pinta un botón por cada categoría devuelta por
  `/api/product-categories` y, al pulsar *"Muebles a medida"*, fija esa categoría
  en el store.
- **Route Handlers + Postgres** — `POST /api/products` con un precio negativo
  responde **400**; con datos válidos, **201** y el producto creado (ver
  `integracion.md`).

Archivos: `src/components/*.test.tsx`, `src/test/integration/*.test.ts`.

### 3. E2E (la cima — pocos, segundos)

El flujo completo en un navegador real, con auth, servidor y base de datos
reales. Da la máxima confianza pero es lento y frágil (una animación o un timeout
de red lo tumban) y, si falla, solo sabes que "algo fue mal" en la página.

- Dar de alta un producto nuevo y verlo aparecer en el listado con su precio.
- Filtrar por *"Muebles a medida"* y comprobar que **todas** las tarjetas
  visibles son de esa categoría.
- Pulsar "+" dos veces sobre un producto y ver el stock subir en 2.

Archivos: `e2e/product-management.spec.ts` (ver `e2e.md`).

## Hooks del ciclo de vida (`beforeAll`, `beforeEach`, `afterEach`, `afterAll`)

| Hook | Cuándo corre | Para qué lo usamos aquí |
|------|--------------|--------------------------|
| `beforeAll` | **una vez**, antes del primer test del archivo | Arrancar el servidor MSW (`server.listen()`); sembrar la categoría de test en la BD de integración. |
| `beforeEach` | **antes de cada** test | Resetear el store a su estado inicial; limpiar las filas `Test-` antes de cada caso de integración. |
| `afterEach` | **después de cada** test | Desmontar el DOM (`cleanup()`), resetear los handlers MSW añadidos con `server.use()` y restaurar los datos en memoria mutados por un POST. |
| `afterAll` | **una vez**, tras el último test | Cerrar MSW (`server.close()`); borrar los datos de test y desconectar Prisma. |

La regla práctica: lo **caro y compartido** (arrancar un servidor, abrir una
conexión) va en `beforeAll`/`afterAll` para hacerlo una sola vez; el **aislamiento
entre casos** (que un test no contamine al siguiente) va en
`beforeEach`/`afterEach`.

## ¿Por qué MSW y no `vi.mock("axios")`?

MSW intercepta la petición **a nivel de red** (la capa `fetch`/XHR), no a nivel de
módulo. La diferencia es **qué estás testeando realmente**:

- Con `vi.mock("axios")` (o mockear `fetch`) sustituyes la librería: el test pasa
  a verificar que *"llamo a axios con tal argumento"*. Si mañana cambias `axios`
  por `fetch` nativo —como hace este proyecto—, el mock deja de tener sentido
  aunque el comportamiento del usuario sea idéntico. Estás acoplado a la
  herramienta, no al comportamiento.
- Con MSW defines **handlers que se parecen a la API real**
  (`http.get("/api/products", …)`). El componente hace su `fetch` de verdad, con
  su URL, sus query params (`?search=…&sortBy=…`), su parseo de JSON y su manejo
  de errores. Testeas el **camino completo de datos** tal como ocurre en
  producción, sin importar la librería HTTP.

Ventaja extra: los mismos handlers se **reutilizan** entre tests unitarios de
componente, tests de error de red (`server.use(http.get(..., () =>
HttpResponse.error()))`) e incluso desarrollo en navegador. Un único contrato de
API simulado para todo.
