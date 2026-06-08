# Demo de la capa de usuario

Esta guía permite probar en vivo la **capa de usuario** (autenticación, sesión y
panel privado) sin necesidad de crear una cuenta.

## Acceso

- **Aplicación:** https://projectenterpriseweb.vercel.app
- **Entrada directa al panel:** [/login](https://projectenterpriseweb.vercel.app/login)

En la pantalla de acceso hay un botón **"Entrar como demostración"** que inicia
sesión con la cuenta de demo en un clic. Si prefieres escribir las credenciales:

| Campo | Valor |
| --- | --- |
| Email | `demo@carpinterialosartesanos.com` |
| Contraseña | `Artesanos.Demo.2026` |

## Qué se puede ver

Una vez dentro de `/panel`:

- **Sesión y rutas protegidas**: el panel solo es accesible con sesión iniciada;
  sin ella, `proxy.ts` redirige a `/login`.
- **Inventario**: módulos de **Materiales** (taller) y **Productos** (catálogo),
  con búsqueda, filtro por categoría, ordenación y aviso de stock bajo.
- **Portfolio**: gestión de los **Proyectos** que se muestran en la web pública.
- **Banner de modo demostración**: indica que la cuenta es de solo lectura.

## Modo solo lectura (importante)

La cuenta de demostración puede **navegar todo el panel**, pero **no puede
modificar datos**: cualquier alta, edición o borrado responde con un aviso y no
se guarda. Esto es deliberado y protege los datos de la demo pública.

Técnicamente, la cuenta demo se identifica por su correo
(`NEXT_PUBLIC_DEMO_EMAIL`) y el guard `requireWriteAccess()`
([`src/lib/api-auth.ts`](../src/lib/api-auth.ts)) responde:

- **401** si no hay sesión (la API de escritura **no** es pública),
- **403** si la sesión es la cuenta de demostración (solo lectura),
- y permite la operación a cualquier otro usuario autenticado.

Las lecturas (`GET`) siguen siendo públicas; solo se protegen las **mutaciones**
(`POST` / `PATCH` / `DELETE`).

> Para operar con escritura real (alta/edición/borrado), hace falta una cuenta de
> empleado normal. La de demostración existe únicamente para mostrar la capa de
> usuario sin riesgo para los datos.
