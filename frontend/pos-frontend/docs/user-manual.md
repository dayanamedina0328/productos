# Manual de Usuario — POS Frontend

## Para quién es este manual

Este manual está dirigido a dos tipos de usuarios:
- **Cajeros**: operan la terminal de ventas diariamente.
- **Administradores**: gestionan productos, clientes y reportes.

---

## Acceso al sistema

1. Abre el navegador y ve a la URL del sistema.
2. Ingresa tu usuario y contraseña.
3. El sistema te redirigirá automáticamente según tu rol:
   - **Cajero** → Terminal de Ventas (`/sales`)
   - **Administrador** → puede acceder a ambas secciones

---

## Terminal de Ventas (`/sales`)

### Pantalla principal

La pantalla está dividida en dos paneles:
- **Izquierda**: catálogo de productos
- **Derecha**: carrito de compras

### Buscar un producto

- Escribe en el campo de búsqueda (parte superior izquierda).
- La búsqueda se realiza automáticamente mientras escribes (300ms de espera).
- Puedes buscar por **nombre** o **SKU**.
- Atajo de teclado: `F2` o `Ctrl+K` para enfocar la búsqueda.

### Agregar productos al carrito

1. Encuentra el producto en el catálogo.
2. Haz clic en el botón **"Agregar"**.
3. El producto aparecerá en el carrito de la derecha.
4. Si el producto no tiene stock, el botón estará deshabilitado.

### Gestionar el carrito

| Acción | Cómo hacerlo |
|--------|-------------|
| Cambiar cantidad | Usa los botones `+` / `-` junto al ítem, o escribe la cantidad directamente |
| Eliminar ítem | Haz clic en el ícono de papelera del ítem |
| Vaciar carrito | Haz clic en "Vaciar" en la parte superior del carrito |
| Poner en espera | Haz clic en "Poner en espera" para guardar la venta y atender a otro cliente |

**Atajos de teclado en el carrito:**
- `+` / `-` — aumentar/disminuir cantidad del ítem seleccionado
- `Delete` — eliminar ítem seleccionado

### Agregar un cliente

1. Haz clic en **"Agregar cliente (F3)"** o presiona `F3`.
2. Busca al cliente por nombre o NIT.
3. Selecciona el cliente de la lista.
4. El cliente aparecerá como un chip en la parte superior del carrito.
5. Para quitar el cliente, haz clic en la `X` del chip.

### Procesar el pago

1. Verifica los ítems y el total en el carrito.
2. Haz clic en **"Cobrar $XX.XX"** o presiona `Ctrl+Enter`.
3. Se abrirá el modal de pago con el resumen del pedido.
4. Selecciona el método de pago:

#### Efectivo
- Ingresa el monto recibido del cliente.
- El sistema calculará automáticamente el cambio a devolver.

#### Tarjeta
- Ingresa los últimos 4 dígitos de la tarjeta.
- Ingresa el código de autorización del datafono.

#### Transferencia
- Ingresa la referencia del comprobante de transferencia.

5. Haz clic en **"Confirmar pago"**.
6. El sistema procesará la venta y mostrará una confirmación.

### Indicadores de stock

| Color | Significado |
|-------|-------------|
| 🟢 Verde — "En stock" | Stock suficiente |
| 🟡 Amarillo — "Stock bajo" | Stock igual o menor al mínimo configurado |
| 🔴 Rojo — "Sin stock" | No hay unidades disponibles |

---

## Panel de Administración (`/admin`)

> Solo disponible para usuarios con rol **Administrador**.

El panel tiene 4 secciones accesibles desde las pestañas superiores:

### Productos

**Ver productos:**
- La tabla muestra todos los productos con SKU, nombre, precio, stock y estado.
- Haz clic en el encabezado de una columna para ordenar.

**Crear producto:**
1. Haz clic en **"+ Nuevo producto"**.
2. Completa el formulario:
   - **Nombre** y **SKU** son obligatorios.
   - **Precio** debe ser mayor a 0.
   - **Stock** no puede ser negativo.
3. Haz clic en **"Guardar"**.

**Editar producto:**
1. Haz clic en **"Editar"** en la fila del producto.
2. Modifica los campos necesarios.
3. Haz clic en **"Guardar"**.

**Eliminar producto:**
1. Haz clic en **"Eliminar"** en la fila del producto.
2. Confirma la eliminación en el diálogo.
> ⚠️ No se puede eliminar un producto que tenga ventas asociadas.

---

### Clientes

**Crear cliente:**
1. Haz clic en **"+ Nuevo cliente"**.
2. Completa el formulario:
   - **Nombre** y **NIT** son obligatorios.
   - El NIT debe ser único en el sistema.
3. Haz clic en **"Guardar"**.

**Editar cliente:**
1. Haz clic en **"Editar"** en la fila del cliente.
2. Modifica los campos (el NIT no se puede cambiar).
3. Haz clic en **"Guardar"**.

**Tipos de cliente:**
| Tipo | Descripción |
|------|-------------|
| Regular | Cliente estándar |
| VIP | Cliente con beneficios especiales |
| Corporativo | Empresa o cliente empresarial |

---

### Ventas

Muestra el historial de todas las ventas realizadas.

**Filtrar por fecha:**
- Usa los campos **"Desde"** y **"Hasta"** para filtrar por rango de fechas.

**Estados de venta:**
| Estado | Descripción |
|--------|-------------|
| Pendiente | Venta en proceso o en espera |
| Completada | Venta procesada exitosamente |
| Cancelada | Venta cancelada (stock revertido) |
| Reembolsada | Venta reembolsada al cliente |

---

### Reportes

Muestra métricas de ventas para el período seleccionado.

**Seleccionar período:**
- **Hoy**: ventas de las últimas 24 horas
- **Esta semana**: ventas de los últimos 7 días
- **Este mes**: ventas de los últimos 30 días

**Métricas disponibles:**
- Ingresos totales
- Número de ventas completadas
- Ticket promedio
- Ventas canceladas
- Desglose de ingresos por método de pago (con barra de progreso)

---

## Atajos de teclado completos

| Atajo | Acción |
|-------|--------|
| `F2` o `Ctrl+K` | Enfocar búsqueda de productos |
| `F3` | Abrir selector de cliente |
| `Ctrl+Enter` | Confirmar checkout / procesar pago |
| `Escape` | Cerrar modal activo |
| `+` o `=` | Aumentar cantidad del ítem seleccionado |
| `-` | Disminuir cantidad del ítem seleccionado |
| `Delete` | Eliminar ítem seleccionado del carrito |

---

## Preguntas frecuentes

**¿Qué pasa si pierdo la conexión a internet?**
El sistema funciona en modo offline básico gracias al service worker. Puedes ver el catálogo en caché, pero no podrás procesar ventas hasta recuperar la conexión.

**¿Cómo recupero una venta en espera?**
Las ventas en espera se guardan localmente. Al recargar la página, el carrito se restaura automáticamente desde el almacenamiento local.

**¿Puedo cambiar el tema de la interfaz?**
Sí. El sistema soporta tema claro y oscuro. El botón de cambio de tema está disponible en la barra de navegación superior.

**¿Qué hago si el sistema muestra un error?**
1. Intenta recargar la página.
2. Si el error persiste, contacta al administrador del sistema.
3. Los errores se registran automáticamente para diagnóstico.
