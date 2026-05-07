# Tasks — SOAP POS Frontend

## Resumen de Fases

| Fase | Descripción | Días estimados |
|------|-------------|---------------|
| 1 | Configuración del proyecto | 2 |
| 2 | Dominio (entidades, validaciones, puertos) | 3 |
| 3 | Casos de uso | 4 |
| 4 | Componentes base UI | 2 |
| 5 | Adaptadores (API, storage, pagos) | 3 |
| 6 | Páginas y componentes de dominio | 5 |
| 7 | Integración y estado global | 3 |
| 8 | Testing | 3 |
| 9 | Producción y deploy | 2 |
| **Total** | | **27 días (~5.5 semanas)** |

---

## Fase 1 — Configuración del Proyecto

- [x] 1.1 Crear proyecto con Vite (`npm create vite@latest pos-frontend -- --template react-ts`)
- [x] 1.2 Instalar dependencias principales: `@reduxjs/toolkit react-redux react-router-dom axios react-hook-form @hookform/resolvers yup clsx tailwindcss @tailwindcss/vite`
- [~] 1.3 Instalar dependencias de desarrollo: `@types/node eslint-config-prettier prettier @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest jsdom`
- [~] 1.4 Crear estructura de carpetas completa según arquitectura hexagonal (`domain/`, `application/`, `infrastructure/`, `ui/`, `shared/`)
- [~] 1.5 Configurar `tsconfig.json` con `strict: true` y path mapping `@/` → `src/`
- [~] 1.6 Configurar Tailwind CSS con tema personalizado (colores, tipografía, espaciado del POS)
- [~] 1.7 Configurar ESLint + Prettier con reglas estrictas (no-any, import/order, etc.)
- [~] 1.8 Configurar Redux Toolkit store base con middleware y devtools
- [~] 1.9 Configurar React Router DOM v6 con rutas iniciales (`/login`, `/sales`, `/admin`)
- [~] 1.10 Configurar Vitest con jsdom y coverage (umbral 80 % general, 90 % dominio)

---

## Fase 2 — Dominio

- [~] 2.1 Crear interfaz `Product` con todos sus campos (`id`, `sku`, `name`, `description`, `price`, `cost`, `stock`, `minStock`, `category`, `imageUrl?`, `isActive`, `createdAt`, `updatedAt`)
- [~] 2.2 Crear interfaz `Category` (`id`, `name`, `description?`, `parentId?`, `level`, `isActive`)
- [~] 2.3 Crear interfaz `Customer` y enum `CustomerType` (REGULAR, VIP, CORPORATE)
- [~] 2.4 Crear interfaces `Cart` y `CartItem`
- [~] 2.5 Crear interfaces `Sale` y `SaleItem`, enum `PaymentMethod` (CASH, CARD, TRANSFER, MIXED) y enum `SaleStatus` (PENDING, COMPLETED, CANCELLED, REFUNDED)
- [~] 2.6 Implementar `ProductValidations.validatePrice()` — rechaza precio ≤ 0 o > 999 999
- [~] 2.7 Implementar `ProductValidations.validateStock()` — rechaza stock negativo o menor a `minStock`
- [~] 2.8 Implementar `CartValidations.validateAddItem()` — valida cantidad > 0 y stock disponible
- [~] 2.9 Implementar función pura `isProductAvailable(product: Product): boolean`
- [~] 2.10 Implementar función pura `getStockStatus(stock, minStock): 'ok' | 'low' | 'out'`
- [~] 2.11 Crear interfaz `ProductRepository` (findAll, findById, save, update, delete)
- [~] 2.12 Crear interfaz `CartRepository` (findById, save, addItem, removeItem, clear)
- [~] 2.13 Crear interfaz `SaleRepository` (findAll, findById, save, cancel)
- [~] 2.14 Crear interfaz `CustomerRepository` (findAll, findById, save)
- [~] 2.15 Crear interfaz `PaymentGateway` con `process()` y tipo `PaymentResult`
- [~] 2.16 Crear objetos de valor: `Money` (aritmética segura), `SKU` (validación de formato), `Quantity` (límites)
- [~] 2.17 Crear eventos de dominio: `ProductAddedToCart`, `SaleCompleted`, `StockUpdated`

---

## Fase 3 — Casos de Uso

### Productos
- [~] 3.1 Implementar `GetProductsUseCase` — retorna `PaginatedResponse<Product>` con filtros opcionales
- [~] 3.2 Implementar `CreateProductUseCase` — valida precio y stock antes de persistir
- [~] 3.3 Implementar `UpdateProductUseCase`
- [~] 3.4 Implementar `DeleteProductUseCase` — valida que el producto no tenga ventas asociadas
- [~] 3.5 Implementar `SearchProductsUseCase` — búsqueda por nombre o SKU

### Carrito
- [~] 3.6 Implementar `AddProductToCartUseCase` — valida stock en tiempo real con `CartValidations`
- [~] 3.7 Implementar `RemoveFromCartUseCase`
- [~] 3.8 Implementar `UpdateCartItemUseCase`
- [~] 3.9 Implementar `ClearCartUseCase`
- [~] 3.10 Implementar `ApplyDiscountUseCase`
- [~] 3.11 Implementar `HoldSaleUseCase` — guarda venta pendiente para retomarla después

### Ventas
- [~] 3.12 Implementar `ProcessSaleUseCase` — requiere `paymentMethod` y `paymentDetails`; genera factura y descuenta stock
- [~] 3.13 Implementar `CancelSaleUseCase` — revierte el stock de los productos involucrados
- [~] 3.14 Implementar `RefundSaleUseCase`
- [~] 3.15 Implementar `GetSalesHistoryUseCase` — retorna `PaginatedResponse<Sale>` con filtros
- [~] 3.16 Implementar `GenerateInvoiceUseCase`

### Clientes
- [~] 3.17 Implementar `GetCustomersUseCase` — retorna `PaginatedResponse<Customer>`
- [~] 3.18 Implementar `CreateCustomerUseCase` — valida unicidad del NIT
- [~] 3.19 Implementar `UpdateCustomerUseCase`
- [~] 3.20 Implementar `SearchCustomersUseCase` — búsqueda por nombre o NIT

---

## Fase 4 — Componentes Base UI

### Primitivos
- [~] 4.1 `Button` — variantes: primary, secondary, ghost, danger; prop `loading` con spinner integrado
- [~] 4.2 `Input` — estados de error, validación visual, label accesible
- [~] 4.3 `Modal` — focus trap, `aria-modal`, backdrop con cierre al hacer clic fuera
- [~] 4.4 `Table` — sorting, paginación, filtros, skeleton de carga
- [~] 4.5 `Card`
- [~] 4.6 `Spinner`
- [~] 4.7 `Toast` / `AppNotification` — **no usar el nombre `Notification`** (colisiona con la API del DOM)
- [~] 4.8 `Badge`
- [~] 4.9 `ScrollArea`
- [~] 4.10 `SearchInput` con debounce configurable

### Componentes de Dominio
- [~] 4.11 `ProductCard` — usa `isProductAvailable()` y `getStockStatus()` como funciones puras; botón deshabilitado si sin stock
- [~] 4.12 `CartItemRow` — **nombre distinto** a la interfaz `CartItem` del dominio; incluye `QuantityInput` y `QuantityDisplay`
- [~] 4.13 `CustomerChip` — prop `onClear: () => void` separada de `onSelect`
- [~] 4.14 `SaleReceipt`
- [~] 4.15 `PaymentMethodSelector` — tabs para CASH, CARD, TRANSFER con formulario específico por método
- [~] 4.16 `StockIndicator` — colores diferenciados para ok / low / out
- [~] 4.17 `CategoryTag`
- [~] 4.18 `ProductGridSkeleton` — skeleton de carga para la grilla de productos
- [~] 4.19 `EmptyState` — componente genérico con icono, título y descripción

### Layouts
- [~] 4.20 `SalesLayout` — grid `2fr 1fr` para desktop, responsive para tablet y móvil
- [~] 4.21 `AdminLayout` — navegación por tabs (Productos, Clientes, Ventas, Reportes)
- [~] 4.22 `MainLayout` — header + sidebar + contenido principal
- [~] 4.23 Sistema de temas light/dark con Tailwind

---

## Fase 5 — Adaptadores

### API (Axios)
- [~] 5.1 Configurar instancia base de Axios con `baseURL`, headers y timeout
- [~] 5.2 Implementar interceptor de autenticación (adjunta JWT en cada request)
- [~] 5.3 Implementar interceptor de logging y manejo global de errores HTTP
- [~] 5.4 Implementar retry con backoff exponencial para errores 5xx
- [~] 5.5 Implementar `ProductAPIAdapter` (implements `ProductRepository`)
- [~] 5.6 Implementar `SaleAPIAdapter` (implements `SaleRepository`)
- [~] 5.7 Implementar `CustomerAPIAdapter` (implements `CustomerRepository`)
- [~] 5.8 Implementar `CartAPIAdapter` (implements `CartRepository`)

### Storage
- [~] 5.9 Implementar `CartLocalStorageAdapter` — persiste el carrito activo entre recargas
- [~] 5.10 Implementar `ProductIndexedDBAdapter` — cache offline del catálogo
- [~] 5.11 Implementar `CacheManager` con políticas de expiración configurables

### Pagos
- [~] 5.12 Implementar `CashPaymentGateway` — calcula cambio a devolver
- [~] 5.13 Implementar `CardPaymentGateway` — tokenización de datos de tarjeta
- [~] 5.14 Implementar `TransferPaymentGateway` — referencia de comprobante
- [~] 5.15 Implementar `MixedPaymentGateway` — combina múltiples métodos

### Mappers
- [~] 5.16 Implementar `ProductMapper` (API response ↔ dominio)
- [~] 5.17 Implementar `SaleMapper`
- [~] 5.18 Implementar `CustomerMapper`
- [~] 5.19 Implementar `CartMapper`

### Contenedor DI
- [~] 5.20 Implementar `infrastructure/di/container.ts` — instancia todos los casos de uso con sus adaptadores

---

## Fase 6 — Páginas y Componentes de Dominio

### Terminal de Ventas
- [~] 6.1 Implementar `SalesPage` — orquesta `ProductBrowser`, `CartPanel` y `CheckoutModal`; `handleCheckout(paymentMethod, paymentDetails)` tipado
- [~] 6.2 Implementar `ProductBrowser` — búsqueda con debounce 300 ms, filtros por categoría, toggle grid/lista
- [~] 6.3 Implementar `CartPanel` — props `onCustomerSelect` y `onCustomerClear` separadas; muestra subtotal, IVA y total en tiempo real
- [~] 6.4 Implementar `CheckoutModal` — `onComplete(method, details)` recibe ambos parámetros; muestra resumen del pedido
- [~] 6.5 Implementar `CustomerSelectorModal` — búsqueda y selección de cliente
- [~] 6.6 Implementar `useKeyboardShortcuts` — Ctrl+K, Ctrl+Enter, F2, F3, Escape, +/-, Delete

### Administración
- [~] 6.7 Implementar `AdminPage` con `TabNavigation` (Productos, Clientes, Ventas, Reportes)
- [~] 6.8 Implementar `ProductManagement` — CRUD completo con tabla paginada
- [~] 6.9 Implementar `ProductForm` — validaciones en tiempo real con React Hook Form + Yup
- [~] 6.10 Implementar `ProductTable` — sorting, filtros, paginación, indicador de stock bajo
- [~] 6.11 Implementar `CustomerManagement`
- [~] 6.12 Implementar `CustomerForm` — validación de NIT único
- [~] 6.13 Implementar `SalesHistory` — filtros por fecha, cliente, método de pago y estado
- [~] 6.14 Implementar `ReportsDashboard` — métricas diarias/semanales/mensuales con gráficos

---

## Fase 7 — Integración y Estado Global

### Redux Slices
- [~] 7.1 Implementar `productsSlice` con estado `AsyncState<PaginatedResponse<Product>>`
- [~] 7.2 Implementar `cartSlice` con acciones: addItem, removeItem, updateQuantity, clear, hold
- [~] 7.3 Implementar `salesSlice` con estado `AsyncState<PaginatedResponse<Sale>>`
- [~] 7.4 Implementar `customersSlice`
- [~] 7.5 Implementar `uiSlice` — gestiona `AppNotification[]` y `ModalState`

### Hooks
- [~] 7.6 Implementar `useProducts` — conecta con `GetProductsUseCase`; expone `products`, `loading`, `searchProducts`, `filters`, `setFilters`
- [~] 7.7 Implementar `useCart` — conecta con casos de uso del carrito; expone `cart`, `addItem`, `removeItem`, `updateQuantity`, `clearCart`
- [~] 7.8 Implementar `useSales` — conecta con `ProcessSaleUseCase`; expone `processSale`, `isProcessing`
- [~] 7.9 Implementar `useCustomers` — conecta con gestión de clientes; expone `selectedCustomer`, `selectCustomer`, `clearCustomer`

### Infraestructura de UI
- [~] 7.10 Implementar Error Boundary global con fallback UI
- [~] 7.11 Implementar sistema de notificaciones centralizado usando `AppNotification`
- [~] 7.12 Configurar Redux Persist para `cartSlice` y `uiSlice`
- [~] 7.13 Implementar selectors optimizados con `reselect`
- [~] 7.14 Configurar lazy loading con `React.lazy` + code splitting por rutas
- [~] 7.15 Implementar rutas protegidas: `ProtectedRoute` (autenticación) y `AdminRoute` (rol ADMIN)

---

## Fase 8 — Testing

### Unit Tests (Vitest)
- [~] 8.1 Tests de entidades de dominio y validaciones (`ProductValidations`, `CartValidations`)
- [~] 8.2 Tests de casos de uso con mocks de repositorios (todos los casos de uso de las fases 3.1–3.20)
- [~] 8.3 Tests de adaptadores con mocks HTTP/storage
- [~] 8.4 Tests de mappers
- [~] 8.5 Verificar cobertura ≥ 80 % general y ≥ 90 % en capa `domain`

### Integration Tests (Testing Library)
- [~] 8.6 Test del flujo completo de venta (buscar → agregar → checkout → completar)
- [~] 8.7 Test de manejo de errores y recuperación (stock insuficiente, error de red)
- [~] 8.8 Test de persistencia del carrito en localStorage

### E2E Tests (Playwright)
- [~] 8.9 Test de login y navegación entre rutas
- [~] 8.10 Test del proceso de venta con cada método de pago (efectivo, tarjeta, transferencia)
- [~] 8.11 Test de CRUD de productos en el panel de administración
- [~] 8.12 Test de accesibilidad (WCAG 2.1 AA) con axe-playwright

---

## Fase 9 — Producción y Deploy

### Build
- [~] 9.1 Optimizar configuración de Vite para producción (minificación, tree-shaking, chunks)
- [~] 9.2 Configurar variables de entorno: `.env.development` y `.env.production`
- [~] 9.3 Analizar bundle con `vite-bundle-visualizer` y optimizar chunks grandes
- [~] 9.4 Configurar PWA: service worker + manifest (offline básico)

### CI/CD
- [~] 9.5 Configurar GitHub Actions: lint → test → build → deploy
- [~] 9.6 Configurar deploy automático a Vercel o Netlify
- [~] 9.7 Configurar rollback automático en caso de fallo en el pipeline

### Documentación
- [~] 9.8 Escribir README con instrucciones de setup, variables de entorno y comandos disponibles
- [~] 9.9 Escribir guía de arquitectura y convenciones del proyecto
- [~] 9.10 Escribir manual de usuario para operadores POS (cajero y administrador)

---

## Checklist de Calidad Final

### Código
- [~] Sin errores TypeScript (`strict: true`)
- [~] Sin warnings de ESLint
- [~] Cobertura ≥ 80 % general, ≥ 90 % en dominio

### Arquitectura
- [~] `Product` y demás entidades son interfaces puras (sin métodos de instancia)
- [~] Las validaciones son funciones puras o clases con métodos estáticos
- [~] `CartItemRow` no colisiona con la interfaz `CartItem` del dominio
- [~] `AppNotification` no colisiona con `Notification` del DOM
- [~] Sin dependencias circulares entre módulos
- [~] `container.ts` es el único lugar donde se usa `new` para instanciar dependencias

### Performance
- [~] First Contentful Paint < 3 s
- [~] Interacciones frecuentes < 100 ms
- [~] Virtual scrolling en listas con más de 100 ítems

### Accesibilidad
- [~] WCAG 2.1 AA verificado con herramientas automáticas
- [~] Navegación completa por teclado en todas las pantallas
- [~] Atributos `aria-*` en modales y controles interactivos
