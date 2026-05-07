# Requirements — SOAP POS Frontend

## Descripción General

**SOAP POS** es una aplicación web de punto de venta (Point of Sale) construida con React 18 + TypeScript 5 bajo arquitectura hexagonal. Permite a los operadores realizar ventas, emitir facturas y administrar el inventario desde una interfaz web optimizada para terminal de caja.

Dos roles de usuario: **Cajero (USER)** y **Administrador (ADMIN)**.

---

## Requisitos Funcionales

### RF-01 — Autenticación y Roles

- **RF-01.1** El sistema debe permitir el inicio de sesión con credenciales (usuario y contraseña).
- **RF-01.2** El sistema debe soportar dos roles: `USER` (Cajero) y `ADMIN` (Administrador).
- **RF-01.3** El rol `USER` puede realizar ventas, consultar productos y clientes, y ver su propio historial de ventas.
- **RF-01.4** El rol `ADMIN` tiene acceso a todo lo anterior más la gestión de productos, clientes, usuarios y reportes completos.
- **RF-01.5** Las rutas protegidas deben redirigir al login si el usuario no está autenticado.
- **RF-01.6** Las rutas de administración deben redirigir con error 403 si el usuario autenticado no tiene rol `ADMIN`.

### RF-02 — Terminal de Ventas

- **RF-02.1** El cajero debe poder buscar productos por nombre o SKU mediante un campo de búsqueda con debounce de 300 ms.
- **RF-02.2** Los productos deben poder filtrarse por categoría mediante pestañas.
- **RF-02.3** Al seleccionar un producto, el sistema debe validar que haya stock disponible antes de agregarlo al carrito.
- **RF-02.4** El cajero debe poder ajustar la cantidad de cada ítem del carrito (incrementar, decrementar o ingresar valor directo).
- **RF-02.5** El cajero debe poder eliminar ítems individuales del carrito.
- **RF-02.6** El cajero debe poder limpiar el carrito completo.
- **RF-02.7** El cajero debe poder asociar un cliente al carrito para emitir factura con NIT.
- **RF-02.8** El sistema debe mostrar subtotal, IVA (19 %) y total en tiempo real conforme se modifica el carrito.
- **RF-02.9** El cajero debe poder retener una venta en curso para atender otra.
- **RF-02.10** El cajero debe poder aplicar descuentos a ítems o al total del carrito.

### RF-03 — Checkout y Facturación

- **RF-03.1** Al iniciar el checkout, el sistema debe mostrar un modal con el resumen del pedido.
- **RF-03.2** El sistema debe soportar tres métodos de pago: efectivo, tarjeta y transferencia.
- **RF-03.3** Para pago en efectivo, el sistema debe calcular y mostrar el cambio a devolver.
- **RF-03.4** Para pago con tarjeta, el sistema debe solicitar los últimos cuatro dígitos y el código de autorización.
- **RF-03.5** Para pago por transferencia, el sistema debe solicitar la referencia del comprobante.
- **RF-03.6** Al completar la venta, el sistema debe generar una factura con número único, detalle de productos, subtotal, IVA y total.
- **RF-03.7** Tras completar la venta, el stock de cada producto vendido debe decrementarse automáticamente.
- **RF-03.8** Tras completar la venta, el carrito debe limpiarse y quedar listo para la siguiente operación.

### RF-04 — Gestión de Productos (ADMIN)

- **RF-04.1** El administrador debe poder crear productos con los campos: SKU, nombre, descripción, precio, costo, stock, stock mínimo, categoría e imagen (opcional).
- **RF-04.2** El administrador debe poder editar cualquier campo de un producto existente.
- **RF-04.3** El administrador debe poder desactivar (borrado lógico) un producto; no se puede eliminar si tiene ventas asociadas.
- **RF-04.4** El sistema debe mostrar una alerta visual cuando el stock de un producto esté por debajo del stock mínimo.
- **RF-04.5** El listado de productos debe soportar búsqueda, filtros por categoría y paginación.

### RF-05 — Gestión de Clientes (ADMIN)

- **RF-05.1** El administrador debe poder registrar clientes con los campos: nombre, NIT, email (opcional), teléfono (opcional), dirección (opcional) y tipo (regular, VIP, corporativo).
- **RF-05.2** El NIT debe ser único en el sistema; el formulario debe validarlo antes de guardar.
- **RF-05.3** El administrador debe poder editar los datos de un cliente existente.
- **RF-05.4** El listado de clientes debe soportar búsqueda por nombre o NIT y filtro por tipo.

### RF-06 — Historial de Ventas

- **RF-06.1** El sistema debe mostrar el historial de ventas con filtros por fecha, cliente, método de pago y estado.
- **RF-06.2** El cajero solo puede ver sus propias ventas; el administrador puede ver todas.
- **RF-06.3** El administrador debe poder cancelar una venta, lo que revierte el stock de los productos involucrados.
- **RF-06.4** El historial debe soportar paginación.

### RF-07 — Reportes (ADMIN)

- **RF-07.1** El panel de reportes debe mostrar resúmenes de ingresos diarios, semanales y mensuales.
- **RF-07.2** El panel debe mostrar los productos más vendidos por período.
- **RF-07.3** Las métricas deben presentarse con gráficos visuales.

### RF-08 — Atajos de Teclado

- **RF-08.1** `Ctrl+K` debe enfocar el campo de búsqueda de productos.
- **RF-08.2** `Ctrl+Enter` debe iniciar el proceso de checkout.
- **RF-08.3** `F2` debe abrir el selector de cliente.
- **RF-08.4** `F3` debe navegar a la gestión de productos.
- **RF-08.5** `Escape` debe cerrar el modal activo.
- **RF-08.6** `+` / `-` deben aumentar o disminuir la cantidad del ítem seleccionado en el carrito.
- **RF-08.7** `Delete` debe eliminar el ítem seleccionado del carrito.

---

## Requisitos No Funcionales

### RNF-01 — Rendimiento

- **RNF-01.1** El First Contentful Paint debe ser inferior a 3 segundos en conexión estándar.
- **RNF-01.2** Las interacciones frecuentes (agregar al carrito, actualizar cantidad) deben responder en menos de 100 ms.
- **RNF-01.3** Las listas con más de 100 ítems deben usar virtual scrolling.

### RNF-02 — Accesibilidad

- **RNF-02.1** La interfaz debe cumplir WCAG 2.1 nivel AA.
- **RNF-02.2** Todos los modales deben implementar focus trap y atributo `aria-modal`.
- **RNF-02.3** La navegación completa por teclado debe estar disponible en todas las pantallas.

### RNF-03 — Calidad de Código

- **RNF-03.1** El proyecto debe compilar sin errores con `strict: true` en TypeScript.
- **RNF-03.2** No debe haber warnings de ESLint en el código fuente.
- **RNF-03.3** La cobertura de tests debe ser ≥ 80 % general y ≥ 90 % en la capa de dominio.

### RNF-04 — Arquitectura

- **RNF-04.1** La capa `domain` no debe importar de `application`, `infrastructure` ni `ui`.
- **RNF-04.2** La capa `application` solo debe importar de `domain`.
- **RNF-04.3** Las entidades de dominio deben ser interfaces puras (sin métodos de instancia).
- **RNF-04.4** Las validaciones de dominio deben ser funciones puras o clases con métodos estáticos.
- **RNF-04.5** La instanciación de dependencias debe ocurrir únicamente en `infrastructure/di/container.ts`.
- **RNF-04.6** No deben existir dependencias circulares entre módulos.

### RNF-05 — Responsive

- **RNF-05.1** El layout principal (terminal de ventas) debe funcionar correctamente en resoluciones de 1920×1080 (desktop), ≤ 1280 px (tablet) y ≤ 768 px (móvil).
- **RNF-05.2** En móvil, el panel del carrito debe comportarse como un drawer deslizable desde la parte inferior.

### RNF-06 — Offline y Persistencia

- **RNF-06.1** El carrito activo debe persistir en `localStorage` para sobrevivir recargas de página.
- **RNF-06.2** El catálogo de productos debe poder cachearse en `IndexedDB` para uso offline básico.

---

## Criterios de Aceptación por Módulo

### CA-01 — Flujo de Venta Completo

**Dado** que el cajero tiene productos en el carrito y selecciona un método de pago válido,  
**cuando** hace clic en "Completar Venta",  
**entonces** el sistema debe:
1. Procesar el pago a través del gateway correspondiente.
2. Generar una factura con número único.
3. Decrementar el stock de cada producto vendido.
4. Limpiar el carrito.
5. Mostrar una notificación de éxito con el número de factura.

### CA-02 — Validación de Stock

**Dado** que un producto tiene stock = 0 o `isActive = false`,  
**cuando** el cajero intenta agregarlo al carrito,  
**entonces** el botón "Agregar" debe estar deshabilitado y el sistema no debe modificar el carrito.

### CA-03 — Alerta de Stock Mínimo

**Dado** que el stock de un producto es menor o igual a `minStock`,  
**cuando** el producto se muestra en el catálogo o en el panel de administración,  
**entonces** el sistema debe mostrar un indicador visual de stock bajo (badge o color diferenciado).

### CA-04 — Persistencia del Carrito

**Dado** que el cajero tiene ítems en el carrito,  
**cuando** recarga la página,  
**entonces** el carrito debe restaurarse con los mismos ítems y cantidades.

### CA-05 — Control de Acceso

**Dado** que un usuario con rol `USER` intenta acceder a una ruta de administración,  
**cuando** navega a `/admin`,  
**entonces** el sistema debe redirigirlo con un mensaje de acceso denegado.
