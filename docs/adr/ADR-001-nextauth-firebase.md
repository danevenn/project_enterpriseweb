# ADR-001: NextAuth v4 + Firebase para la autenticación

## Estado: Aceptado

## Contexto

La aplicación tiene una zona pública (portfolio del taller) y un **panel privado**
(`/panel`) desde el que se gestiona el inventario. Hace falta autenticar a los
empleados y proteger las rutas y los endpoints del panel.

Restricciones del proyecto:

- El proyecto nace de la fusión de tres trabajos previos; uno de ellos (`task7`)
  ya usaba **Firebase Auth** como proveedor de identidades.
- Despliego en **Vercel** (serverless): no hay un servidor persistente donde
  mantener sesiones en memoria.
- No quiero **almacenar contraseñas** en mi base de datos (responsabilidad y
  superficie de ataque que prefiero delegar).
- El negocio (productos, materiales, proyectos) vive en PostgreSQL, pero los
  **usuarios no son una entidad de negocio**: solo necesito saber quién entra.

## Decisión

Usar **NextAuth v4** como capa de sesión sobre **Firebase Identity Toolkit** como
proveedor de identidades:

- Firebase valida email/contraseña (y gestiona verificación y reset de contraseña).
- NextAuth emite una sesión con estrategia **JWT** (cookie firmada), sin tabla de
  sesiones ni adaptador de base de datos.
- `proxy.ts` (el `middleware` de Next 16) protege `/panel` con `withAuth`.

Las **identidades viven en Firebase** y el **negocio en PostgreSQL**: son dos
orígenes de datos deliberadamente separados, sin tabla de usuarios en la BD.

## Consecuencias positivas

- **Sin contraseñas en mi BD**: Firebase asume el almacenamiento seguro y los
  flujos sensibles (reset, verificación).
- **Compatible con serverless**: el JWT es autocontenido; cada Function valida la
  cookie sin estado compartido.
- **Reaprovecho** el proveedor que ya tenía configurado en `task7`.
- El esquema de Prisma queda **limpio de autenticación**: solo modela el dominio.

## Compromisos

- **Dos sistemas que coordinar** (Firebase + NextAuth): más piezas mentales que
  una solución única.
- NextAuth **v4** (no v5/Auth.js) por compatibilidad ya verificada con Next 16 /
  React 19; hay que vigilar los *peers* (relajados en `pnpm-workspace.yaml`).
- Si en el futuro un usuario necesitara datos de negocio propios (permisos finos,
  preferencias), haría falta una tabla puente `firebaseUid → …`.

## Alternativas descartadas

- **Firebase Auth puro en el cliente**: dejaría la protección de rutas en manos
  del cliente; quería el *guard* en el servidor (`proxy.ts`) y sesión en cookie
  httpOnly, no un token accesible desde JS.
- **Tabla de usuarios + credenciales en Postgres**: me obligaría a almacenar y
  rotar hashes de contraseña y a implementar verificación/reset yo mismo. Más
  superficie de ataque para cero valor diferencial.
- **Auth.js v5 (NextAuth 5)**: aún arrastraba fricción de *peers* con Next 16 en
  el momento de decidir; preferí la v4, ya validada en build.
