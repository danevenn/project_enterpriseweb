# ADR-004: Zustand para el estado de UI del inventario

## Estado: Aceptado

## Contexto

Las vistas del inventario (productos y materiales) tienen estado de **interfaz**
compartido entre varios componentes: el término de búsqueda, la categoría
seleccionada y el criterio de ordenación. Ese estado lo leen y lo escriben la
barra de filtros, la cabecera de la tabla y la propia lista.

Conviene distinguir dos tipos de estado:

- **Estado de servidor** (los datos del inventario): ya lo gestiona **TanStack
  Query** (caché, revalidación, estados de carga/error). No es lo que se discute aquí.
- **Estado de UI** (qué filtros tiene puestos el usuario): efímero, de cliente, y
  el que necesita compartirse entre componentes hermanos.

## Decisión

Usar **Zustand** para el estado de UI del inventario (`src/stores/`), separado del
estado de servidor que vive en TanStack Query.

## Consecuencias positivas

- **Evita el prop-drilling**: los filtros se comparten sin pasar props a través de
  varios niveles ni envolver el árbol en *providers*.
- **Re-renders selectivos**: con Zustand cada componente se suscribe solo al *slice*
  que usa; cambiar el orden no re-renderiza la barra de búsqueda. Con Context, todo
  consumidor del *provider* se re-renderiza ante cualquier cambio del valor.
- **API mínima y sin *boilerplate***: crear el store es una función; nada de
  *reducers*, *actions* ni *dispatch*.
- El estado de UI queda **fuera de los componentes**, lo que lo hace testeable de
  forma aislada (el store tiene sus propios tests unitarios).

## Compromisos

- **Una dependencia más** para algo que, a pequeña escala, Context podría cubrir.
- El estado de filtros **no se refleja en la URL**: no es compartible ni
  *bookmarkable* (decisión consciente; en el panel privado no aporta).

## Alternativas descartadas

- **React Context**: provoca re-renders de todos los consumidores ante cualquier
  cambio y obliga a *memoizar* con cuidado; para un estado que cambia con cada
  tecleo (búsqueda) es justo el peor caso.
- **Estado en la URL (search params)**: bueno para vistas públicas compartibles,
  pero innecesario en un panel interno; añadiría complejidad de *parsing* y
  sincronización sin beneficio aquí.
- **Levantar el estado al componente padre** (`useState` + props): degenera en
  prop-drilling en cuanto hay más de dos consumidores en distintos niveles.
