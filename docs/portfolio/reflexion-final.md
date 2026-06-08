# Reflexión final

Una mirada honesta al proyecto: qué me costó, qué cambiaría y cómo lo explicaría.

## ¿Cuál fue la parte que más me costó? ¿Cómo la resolví?

La **autenticación** y, sobre todo, decidir **dónde vive cada cosa**. El proyecto
nace de fusionar tres trabajos previos, y uno traía Firebase Auth mientras otro
traía el inventario en Postgres. La tentación era unificar todo en un solo sitio:
o meter los usuarios en Postgres, o llevar el negocio a Firebase.

Lo que me costó fue entender que **no tenían por qué vivir juntos**. La identidad
(¿quién eres?) y el negocio (¿qué materiales hay en stock?) son problemas
distintos con dueños distintos. Lo resolví dejando las **identidades en Firebase**
y el **negocio en Postgres**, con NextAuth emitiendo una sesión **JWT** que no
necesita tabla de usuarios ni adaptador de base de datos. Una vez acepté esa
separación, el esquema de Prisma quedó limpio y `proxy.ts` protegiendo `/panel` fue
casi trivial. La decisión está documentada en
[ADR-001](../adr/ADR-001-nextauth-firebase.md).

El segundo punto difícil fue de **rendimiento**, y fue revelador porque el síntoma
("la app va lenta") no apuntaba a la causa. La app estaba bien; la **base de datos
estaba en EE. UU.** y yo desarrollo desde España. Cada query cruzaba el Atlántico.
Lo medí (la suite de integración tardaba ~12,5 s), moví la BD a Frankfurt y bajó a
~3,1 s. La lección: **medir antes de optimizar** (ver
[ADR-002](../adr/ADR-002-neon-region-eu.md)).

## Si rehiciera el proyecto desde cero mañana, ¿qué decisión técnica cambiaría?

Pondría el **gate de calidad desde el primer commit**, no al final. En esta entrega
la auditoría (ESLint estricto, formato único de errores de API, *logger*
estructurado, cobertura) fue una **fase de limpieza** posterior. Funciona, pero es
trabajo que te ahorras si la disciplina está desde el día uno: cuesta mucho menos
no escribir un `console.log` que ir a quitarlo después.

En lo arquitectónico, **separaría la lógica de los componentes desde el principio**.
Acabé extrayendo la lógica de stock de materiales a `material-utils.ts` para poder
testearla; si la hubiera escrito así desde el inicio, habría tenido componentes más
pequeños y tests más fáciles sin un paso de refactor.

Lo que **no** cambiaría: la separación identidad/negocio, la región EU y la
estrategia de tests en pirámide. Esas tres aguantan bien.

## ¿Cómo explicaría la arquitectura en una entrevista técnica?

Empezaría por el **diagrama** ([`docs/arquitectura/`](../arquitectura/diagrama.md))
y contaría el recorrido de una petición, de fuera hacia dentro:

1. **El navegador** carga una app Next.js (React 19). El estado de **servidor** (los
   datos) lo gestiona TanStack Query; el estado de **UI** (filtros del inventario),
   Zustand. Son dos tipos de estado distintos y por eso uso dos herramientas
   distintas.
2. Toda petición entra por **`proxy.ts`** en Vercel (el *middleware* de Next 16):
   añade cabeceras de seguridad y, si la ruta es `/panel`, exige sesión.
3. Las páginas se renderizan como **Server Components** y las mutaciones pasan por
   **Route Handlers** (`/api/*`), que validan con **zod** y hablan con Postgres por
   **Prisma**. Todos los errores salen con un **formato único** gracias a un
   *wrapper* común.
4. La **autenticación** la resuelve NextAuth sobre Firebase: Firebase verifica la
   identidad, NextAuth emite un **JWT** en cookie. No guardo contraseñas.
5. Los datos viven en **PostgreSQL (Neon)**, y aquí viene el detalle que demuestra
   criterio: **base de datos y cómputo están en la misma región europea**, porque
   medí que la latencia transatlántica multiplicaba por cuatro los tiempos.

El mensaje que querría transmitir es que **cada pieza responde a un porqué**: no usé
Zustand porque sí, ni Firebase porque estaba de moda, ni Frankfurt por casualidad.
Y cuando algo fue una decisión de compromiso, está escrita en un
[ADR](../adr/) con sus alternativas descartadas.
