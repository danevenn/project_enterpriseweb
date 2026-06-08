# Auditoría de calidad y deuda técnica

Registro de la auditoría de calidad realizada antes de dar el proyecto por
cerrado: qué se revisó, qué problemas se encontraron y cómo se resolvieron. El
objetivo no es solo "que pase el linter", sino dejar el código en un estado del
que pueda defender cada decisión.

## Checklist de auditoría (estado final)

| Comprobación | Comando | Resultado |
| --- | --- | --- |
| Linting | `pnpm lint` | ✅ 0 errores, 0 *warnings* |
| Tipos | `pnpm typecheck` (`tsc --noEmit`) | ✅ 0 errores (TypeScript `strict`) |
| Cobertura | `pnpm test:coverage` | ✅ 95 % líneas / 91 % funciones (módulos medidos) |
| Build de producción | `pnpm build` | ✅ Sin errores |

## Hallazgos y cómo se resolvieron

### 1. Manejo de errores de la API inconsistente

**Problema.** Cada Route Handler capturaba los errores de Prisma con un `try/catch`
repetido y, ante un error inesperado, hacía `throw`: Next respondía entonces con
un **500 genérico** (HTML), no con un JSON manejable por el cliente. Además el
cuerpo de los errores no tenía una forma única.

**Solución.** Se introdujo un formato único `ApiError { error, message, statusCode }`
y un envoltorio `withRouteErrors` en [`src/lib/api.ts`](../../src/lib/api.ts) que:

- captura el **JSON malformado** (→ 400),
- mapea los **errores conocidos de Prisma** (P2025 → 404, P2002 → 409, P2003 → 400),
  con mensajes a medida por recurso,
- y, como red de seguridad, convierte **cualquier excepción** en un 500
  estructurado y la registra con el *logger*.

Esto **eliminó el `try/catch` duplicado** de las 13 rutas (menos código y un único
punto de verdad) y garantiza que **ninguna** respuesta de error se escape sin el
formato estándar.

### 2. `console.*` en código de producción

**Problema.** Había llamadas sueltas a `console.error` / `console.info` (en el
*error boundary*, en `auth.ts` y en la Server Action de contacto).

**Solución.** Se creó un *logger* estructurado mínimo
([`src/lib/logger.ts`](../../src/lib/logger.ts)) como **único punto autorizado**
de salida de logs (emite JSON; es donde se enchufaría Sentry/Logtail sin tocar los
*call sites*). Todas las llamadas se migraron a `logger.*` y se activó la regla
**`no-console` como `error`** para impedir reincidencias.

### 3. ESLint no era estricto

**Problema.** Reglas clave heredadas de `eslint-config-next` estaban como *warning*
(no bloqueaban el CI) o no forzadas.

**Solución.** En [`eslint.config.mjs`](../../eslint.config.mjs), sobre `src/**`:

- `@typescript-eslint/no-explicit-any` → **error**
- `@typescript-eslint/no-unused-vars` → **error** (permitiendo `_` para parámetros
  intencionadamente ignorados)
- `no-console` → **error**

Verificado: el código ya no contenía ningún `any` (0 hallazgos), así que la regla
es preventiva.

### 4. Cobertura medida sobre una superficie estrecha

**Problema.** La cobertura solo medía el módulo **Product** (5 ficheros). El umbral
del 80 % se cumplía, pero sobre poca superficie.

**Solución.** Se extrajo la lógica pura de los materiales a
[`src/lib/material-utils.ts`](../../src/lib/material-utils.ts) (antes embebida en
`materials-view.tsx`), se añadieron tests unitarios del módulo **Material** y del
**wrapper de errores** (`api.ts`), y tests de **integración** de la API de
materiales. El `coverage.include` se amplió en consecuencia. Las utilidades puras
de inventario se mantienen al **100 %** por umbral.

> **Decisión consciente sobre el alcance de la cobertura.** La cobertura se mide
> sobre los módulos de **lógica** (utilidades de inventario, formato, manejo de
> errores) y los componentes de inventario, no sobre toda la app. Medir el 100 %
> de la app (incluyendo UI puramente presentacional y páginas estáticas de
> *marketing*) inflaría el número sin añadir confianza real. Se prefiere un umbral
> **significativo sobre lo que tiene lógica** a un porcentaje alto pero diluido.

### 5. Componentes largos

**Problema.** Varios componentes superan las ~200 líneas.

**Estado y criterio.** `materials-view.tsx` se redujo al extraer la lógica de stock
a `material-utils.ts`. Los siguientes quedan **conscientemente** por encima del
umbral, porque dividirlos solo movería código sin reducir complejidad real:

| Fichero | Líneas | Por qué se mantiene |
| --- | ---: | --- |
| `proyectos/[slug]/page.tsx` | 328 | Página de detalle: es sobre todo *markup* lineal (secciones del proyecto), no lógica ramificada |
| `project-form.tsx` / `material-form.tsx` / `product-form.tsx` | 326 / 251 / 190 | Formularios con muchos campos; la longitud viene de los campos, no de lógica anidada |
| `ui/select.tsx` | 201 | Primitiva de `base-ui` con sus subcomponentes; es código de librería |

Se documenta como deuda **aceptada**: si estos formularios crecieran en *lógica*
(no en campos), el siguiente paso sería extraer los campos compuestos a
subcomponentes.

## Reflexión

**¿Cuál fue el error más frecuente?** Aceptar los **valores por defecto** de las
herramientas sin cuestionarlos. El caso más caro fue la **región de la base de
datos** (`us-east-1` por defecto → latencia transatlántica desde España, ver
[ADR-002](../adr/ADR-002-neon-region-eu.md)), pero el patrón se repitió en pequeño:
reglas de ESLint en *warning* en vez de *error*, manejo de errores "lo que venga
por defecto de Next". El *default* casi nunca es la decisión correcta para *tu*
contexto.

**¿Qué haría diferente en un proyecto nuevo?** Establecer el *gate* de calidad
**desde el primer commit**, no al final: ESLint estricto, `tsc` en CI, un formato
de error de API y un *logger* antes de escribir la primera ruta. Auditar al final
funciona, pero es trabajo de limpieza que se evita si la disciplina está desde el
día uno. También **separaría la lógica de los componentes desde el inicio** (como
quedó `material-utils`), en lugar de extraerla a posteriori para poder testearla.
