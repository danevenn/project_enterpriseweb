# Diagrama de arquitectura

Fuente editable del diagrama del sistema. GitHub renderiza el bloque Mermaid de
abajo automáticamente. El PNG (`diagrama.png`) que enlaza el README se exporta
desde este mismo grafo (con [mermaid.live](https://mermaid.live) o
`npx @mermaid-js/mermaid-cli -i diagrama.md -o diagrama.png`).

## Sistema completo

```mermaid
flowchart TB
    subgraph cliente["🧑 Navegador (cliente)"]
        ui["Sitio público + Panel<br/>React 19 · TanStack Query · Zustand"]
    end

    subgraph vercel["▲ Vercel — región fra1 (Frankfurt)"]
        proxy["proxy.ts<br/>(cabeceras de seguridad + guardia de /panel)"]
        rsc["Server Components<br/>(páginas públicas y panel)"]
        api["Route Handlers /api/*<br/>(zod + Prisma + withRouteErrors)"]
        authlib["NextAuth v4<br/>(sesión JWT)"]
    end

    subgraph firebase["🔥 Firebase"]
        fbauth["Identity Toolkit<br/>(email/contraseña)"]
    end

    subgraph neon["🐘 Neon — región fra1 (EU)"]
        pg[("PostgreSQL<br/>productos · materiales · proyectos")]
    end

    ui -->|"HTTP / navegación"| proxy
    proxy --> rsc
    proxy --> api
    rsc -->|"lectura SSR"| pg
    api -->|"Prisma (pooled, ~3 ms)"| pg
    ui -->|"login (credenciales)"| authlib
    authlib -->|"verifica identidad"| fbauth
    authlib -.->|"JWT firmado"| ui

    classDef eu fill:#e8f0ff,stroke:#3b6cb7,color:#15294d;
    class vercel,neon eu;
```

## Notas de lectura

- **`proxy.ts`** (el antiguo `middleware.ts` de Next ≤15) es el único punto de
  entrada: añade cabeceras de seguridad a todo y protege `/panel` con `withAuth`.
- **Dos orígenes de datos**: las **identidades** viven en Firebase; el **negocio**
  (inventario y portfolio) en PostgreSQL. NextAuth usa estrategia **JWT**, por lo
  que no necesita adaptador de base de datos ni tabla de usuarios.
- **Co-localización en `fra1`**: el cómputo de Vercel y la BD de Neon están en la
  misma región EU, de modo que cada query app↔BD viaja ~3 ms en vez de ~90 ms.
  Ver [ADR-002](../adr/ADR-002-neon-region-eu.md).
- El **JWT** firmado por NextAuth vuelve al navegador como cookie de sesión; las
  llamadas posteriores a `/api/*` y a `/panel` lo presentan y `proxy.ts` lo valida.
