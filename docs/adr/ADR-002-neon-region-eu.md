# ADR-002: PostgreSQL gestionado (Neon) en región EU `fra1`

## Estado: Aceptado

## Contexto

La aplicación necesita una base de datos PostgreSQL en producción. El desarrollo
se hace **desde España** y el despliegue es en **Vercel** (serverless). Durante el
desarrollo la BD fue primero un Postgres local en Docker y luego una instancia
gestionada en la nube.

La primera versión gestionada se provisionó con el **valor por defecto** de la
herramienta: región **`us-east-1`** (Virginia, EE. UU.). Síntomas observados:

- La app se sentía **lenta** en operaciones del panel.
- La **suite de integración** (Route Handlers contra la BD real) tardaba **~12,5 s**.

La causa: cada *roundtrip* aplicación↔BD cruzaba el Atlántico (~120 ms). En
serverless, donde una request hace varias queries, ese coste se multiplica.

## Decisión

Usar **Neon** (PostgreSQL gestionado y serverless) en la región **EU `fra1`
(Frankfurt, eu-central-1)** y **co-localizar el cómputo** de Vercel en la misma
región con `vercel.json`:

```json
{ "regions": ["fra1"] }
```

La conexión usa el **pooler** de Neon (`DATABASE_URL` con `pgbouncer=true`) para
runtime serverless, y una **conexión directa** (`DIRECT_URL`) para migraciones.

## Consecuencias positivas

- El *roundtrip* bajó de **~120 ms a ~33 ms**; la suite de integración pasó de
  **~12,5 s a ~3,1 s** (~4× más rápida).
- El cómputo y la BD están **en la misma región**: se elimina la latencia
  transatlántica app↔BD en producción.
- Neon es **serverless** (escala a cero, *branching*), coherente con Vercel.

## Compromisos

- **Dependencia de un proveedor** gestionado (Neon) y de su plan gratuito.
- El pooler obliga a `pgbouncer=true` y a separar `DIRECT_URL` para que Prisma no
  falle con *prepared statements*.
- Neon **no reubica** un proyecto entre regiones: corregir la región implicó
  **recrear** el proyecto y volver a migrar/sembrar.

## Alternativas descartadas

- **Neon en `us-east-1`** (el *default*): descartada por la latencia medida desde
  España. El *default* de las herramientas (US) es la causa raíz; hay que fijar la
  región EU explícitamente desde el inicio.
- **Postgres local en Docker**: válido para desarrollo *offline* (se conserva el
  `docker-compose.yml`), pero no sirve como BD de producción accesible por Vercel.
- **AWS RDS autogestionado**: más control, pero más operación (parches, backups,
  pooling manual) de la que este proyecto justifica.
