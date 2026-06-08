# ADR-003: Pirámide de tests (Vitest + MSW + ntarh + Playwright)

## Estado: Aceptado

## Contexto

El inventario es la parte con más lógica de la aplicación (filtrado, ordenación,
stock bajo, validación, manejo de errores) y la que un equipo de contratación
mira para juzgar **criterio de calidad**. Necesito una red de tests que dé
confianza real sin convertirse en una carga lenta y frágil.

Dos riesgos a evitar:

- **Tests demasiado caros** (todo E2E con navegador): lentos, intermitentes,
  difíciles de mantener.
- **Tests que no prueban nada**: *mocks* tan profundos que validan la maqueta y
  no el comportamiento.

## Decisión

Adoptar la **pirámide de tests** clásica, con una herramienta por nivel:

| Nivel | Qué prueba | Herramienta |
| --- | --- | --- |
| **Unitario** | Lógica pura de inventario (`product-utils`, `material-utils`, `format`) y el wrapper de errores de la API (`api.ts`) | Vitest |
| **Componente** | `ProductList` / `CategoryFilter` con la red simulada | Vitest + Testing Library + **MSW** |
| **Integración** | Route Handlers reales (zod + Prisma) contra un Postgres efímero | **next-test-api-route-handler** |
| **E2E** | Flujos completos en navegador con **login real** | Playwright |

Las **utilidades puras** (la lógica de negocio aislada) se exigen al **100 %** de
cobertura vía umbrales en `vitest.config.ts`. En CI, los unitarios/componente y
los de integración corren en cada push; la integración usa un **Postgres efímero**
como *service container* (localhost, latencia ~0, sin tocar la BD de producción).

## Consecuencias positivas

- **Confianza proporcionada al coste**: mucho test unitario barato y rápido, poca
  integración, mínimo E2E.
- La lógica pura extraída de los componentes (p. ej. `material-utils`) es a la vez
  **más testeable y más reutilizable** que la lógica embebida en el JSX.
- **MSW** intercepta a nivel de red: los tests de componente ejercitan el código de
  *fetching* real (TanStack Query) sin un backend.
- La integración con un **Postgres real** detecta lo que un *mock* de Prisma no
  vería (constraints, errores P2002/P2025, serialización de `Decimal`).

## Compromisos

- **Cuatro herramientas** que configurar y mantener (más superficie de tooling).
- La integración y el E2E necesitan **infraestructura** (Postgres; Firebase + un
  usuario de test para el login real de Playwright).
- Los E2E son inherentemente más **lentos y frágiles**: por eso son pocos y cubren
  solo los caminos críticos.

## Alternativas descartadas

- **Solo E2E**: cubriría flujos completos, pero sería lento, intermitente y malo
  localizando *dónde* falla algo.
- **Sin tests / pruebas manuales**: inviable para demostrar criterio de calidad y
  para refactorizar (como esta misma fase de auditoría) sin miedo a romper.
- **Mockear Prisma en los tests de API**: probaría mis *mocks*, no el contrato real
  con la base de datos.
