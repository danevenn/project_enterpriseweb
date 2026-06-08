# Tests E2E con Playwright

Los E2E recorren el flujo completo en un navegador real (Chromium) contra el
servidor de Next y la base de datos reales. Cubren el inventario de
**Taller Sagra** desde el panel privado `/panel/productos`.

## El Page Object Model (POM)

Un **Page Object** es una clase que encapsula los selectores y las acciones de
una pantalla, exponiendo métodos con lenguaje de negocio en vez de detalles del
DOM. Aquí, `InventoryPage` (`e2e/pages/inventory.page.ts`):

```ts
const inventory = new InventoryPage(page);
await inventory.goto();
await inventory.addProduct({ name, price: 24.9, stock: 8, category: "Muebles a medida" });
await inventory.filterByCategory("Muebles a medida");
await inventory.incrementStock(name, 2);
```

En lugar de repetir en cada test `page.getByRole("button", { name: "Nuevo
producto" }).click()`, abrir el diálogo, rellenar campos y seleccionar la
categoría del `Select` de base-ui, todo eso vive **una sola vez** dentro del
método `addProduct`.

**Por qué es útil cuando los E2E crecen:**

- **Un único punto de cambio.** Si el botón pasa de *"Nuevo producto"* a
  *"Añadir"*, o el label *"Precio (€)"* cambia, lo arreglas en el Page Object y
  **todos** los tests siguen funcionando. Sin POM, ese cambio te obliga a editar
  cada spec que tocaba ese formulario.
- **Specs legibles.** El test describe *qué* hace el usuario (alta, filtro,
  ajuste de stock), no *cómo* se localiza cada elemento. Se lee como un caso de
  uso.
- **Reutilización.** `addProduct` se usa tanto en el flujo de alta como en el de
  stock (que primero crea el producto y luego lo incrementa).

## ¿Cuándo preferir E2E sobre integración para el mismo comportamiento?

Para el **mismo** comportamiento, el test de integración suele ser mejor opción
por defecto: más rápido, más estable y con diagnóstico más preciso. El E2E se
justifica cuando lo que quieres verificar **solo existe al juntar todas las
capas en un navegador real**:

- **Flujos que cruzan varias capas y la auth real.** "Inicio sesión, entro al
  panel protegido por NextAuth + Firebase, doy de alta un producto y lo veo en el
  listado." Eso ejercita middleware (`proxy.ts`), sesión, render de servidor,
  hidratación, React Query y la BD a la vez — ninguna prueba de integración lo
  cubre entero.
- **Comportamiento que vive en el navegador.** Que el `Select` de base-ui abra su
  popup, que el diálogo se cierre al guardar, que el contador de stock con
  **debounce optimista** muestre el incremento al instante tras dos clics en "+".
  Son cosas del DOM y del navegador reales, no de una función.
- **Confianza de "extremo a extremo" antes de soltar.** Un humo que confirma que
  la app **realmente arranca y el camino crítico funciona** en un navegador.

En cambio, si solo quieres validar reglas (precio negativo → 400, filtro por
nombre, "poco stock" por umbral), quédate en unitario/integración: misma garantía
por una fracción del coste y sin fragilidad.

## Cómo se ejecutan aquí

El panel está **protegido por NextAuth + Firebase**, así que el E2E hace **login
real** una sola vez y reutiliza la sesión:

- `e2e/auth.setup.ts` (proyecto `setup` de Playwright) entra en `/login` con un
  usuario de test y guarda el `storageState` en `e2e/.auth/user.json`. El
  proyecto `chromium` lo reutiliza para no re-loguear en cada test.
- Hacen falta credenciales de un **usuario Firebase de test**:

  ```bash
  E2E_USER_EMAIL=tester@artesanos.test E2E_USER_PASSWORD=••••••• pnpm test:e2e
  ```

  > ⚠️ Pendiente: las credenciales reales de Firebase del proyecto aún están sin
  > rellenar. Hasta que exista ese usuario de test, los specs del panel quedan
  > listos pero no se ejecutan (el `setup` falla con un mensaje claro).

- El listado de filtrado asume que hay productos sembrados en varias categorías;
  siembra el schema de E2E con `pnpm db:seed` antes de correrlos.

Comando: `pnpm test:e2e`. Reutiliza el servidor de dev si ya está corriendo
(puerto 3000); si no, lo levanta él.
