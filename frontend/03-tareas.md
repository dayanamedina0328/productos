# Plan de Desarrollo — Sistema POS Frontend

## Resumen de Fases

| Fase | Descripción | Días |
|------|-------------|------|
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

## Fase 1 — Configuración del Proyecto (2 días)

### Inicialización
```bash
# Vite es el estándar actual (create-react-app está obsoleto desde 2023)
npm create vite@latest pos-frontend -- --template react-ts
cd pos-frontend

# Dependencias principales
npm install @reduxjs/toolkit react-redux react-router-dom axios
npm install react-hook-form @hookform/resolvers yup
npm install clsx tailwindcss @tailwindcss/vite

# Dependencias de desarrollo
npm install -D @types/node eslint-config-prettier prettier
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D vitest jsdom
```

### Tareas
- [ ] Crear estructura de carpetas (arquitectura hexagonal)
- [ ] Configurar Tailwind CSS con tema personalizado
- [ ] Configurar ESLint + Prettier con reglas estrictas
- [ ] Configurar Redux Toolkit store base
- [ ] Configurar React Router con rutas iniciales
- [ ] Configurar `tsconfig.json` con `strict: true` y path mapping (`@/` → `src/`)

### Estructura de carpetas
```
src/
├── domain/
│   ├── entities/        # Interfaces: Product, Cart, Sale, Customer, Category
│   ├── validations/     # ProductValidations, CartValidations
│   └── events/          # DomainEvents
├── application/
│   ├── useCases/        # GetProducts, ProcessSale, AddProductToCart, etc.
│   └── dtos/            # CreateProductRequest, ProcessSaleRequest, etc.
├── infrastructure/
│   ├── api/             # Adaptadores HTTP (Axios)
│   ├── storage/         # LocalStorage, IndexedDB
│   └── payments/        # CashGateway, CardGateway, TransferGateway
├── ui/
│   ├── pages/           # SalesPage, AdminPage
│   ├── components/
│   │   ├── base/        # Button, Input, Modal, Table, Toast
│   │   └── features/    # ProductCard, CartItemRow, CheckoutModal, etc.
│   ├── hooks/           # useCart, useProducts, useSales, useCustomers
│   ├── store/           # Redux slices
│   └── types/           # UIState, AppNotification, ModalState
└── shared/
    └── types/           # ApiResponse, PaginatedResponse, AsyncState, Filters
```

---

## Fase 2 — Dominio (3 días)

### Entidades
- [ ] `Product` — incluye `imageUrl?: string`
- [ ] `Cart` + `CartItem`
- [ ] `Sale` + `SaleItem` — `paymentDetails` requerido
- [ ] `Customer`
- [ ] `Category`
- [ ] Enums: `PaymentMethod`, `SaleStatus`, `CustomerType`

### Validaciones (funciones puras — Product es interfaz, no clase)
- [ ] `ProductValidations.validatePrice()`
- [ ] `ProductValidations.validateStock()`
- [ ] `CartValidations.validateAddItem()`
- [ ] `isProductAvailable(product: Product): boolean`
- [ ] `getStockStatus(stock, minStock): 'ok' | 'low' | 'out'`

### Puertos (interfaces de repositorios)
- [ ] `ProductRepository` — CRUD + búsqueda
- [ ] `CartRepository` — persistencia temporal
- [ ] `SaleRepository` — consultas complejas
- [ ] `CustomerRepository` — búsqueda por NIT
- [ ] `PaymentGateway` — procesamiento de pagos

### Objetos de Valor
- [ ] `Money` — operaciones aritméticas seguras
- [ ] `SKU` — validación de formato
- [ ] `Quantity` — límites y validaciones

---

## Fase 3 — Casos de Uso (4 días)

### Productos
- [ ] `GetProducts` → retorna `PaginatedResponse<Product>`
- [ ] `CreateProduct`
- [ ] `UpdateProduct`
- [ ] `DeleteProduct` — valida que no tenga ventas asociadas
- [ ] `SearchProducts`

### Carrito
- [ ] `AddProductToCart` — valida stock en tiempo real
- [ ] `RemoveFromCart`
- [ ] `UpdateCartItem`
- [ ] `ClearCart`
- [ ] `ApplyDiscount`
- [ ] `HoldSale` — guarda venta pendiente

### Ventas
- [ ] `ProcessSale` — `paymentMethod` + `paymentDetails` requeridos
- [ ] `CancelSale` — revierte stock
- [ ] `RefundSale`
- [ ] `GetSalesHistory` → retorna `PaginatedResponse<Sale>`
- [ ] `GenerateInvoice`

### Clientes
- [ ] `GetCustomers` → retorna `PaginatedResponse<Customer>`
- [ ] `CreateCustomer` — valida NIT
- [ ] `UpdateCustomer`
- [ ] `SearchCustomers`

---

## Fase 4 — Componentes Base UI (2 días)

> Esta fase precede a la integración para que los componentes estén disponibles en la Fase 7.

### Primitivos
- [ ] `Button` — variantes: primary, secondary, ghost, danger; prop `loading`
- [ ] `Input` — estados de error, validación visual
- [ ] `Modal` — focus trap, aria-modal, backdrop
- [ ] `Table` — sorting, paginación, filtros
- [ ] `Card`
- [ ] `Spinner`
- [ ] `Toast` / `AppNotification` — **no usar `Notification`** (colisiona con la API del DOM)
- [ ] `Badge`

### Componentes de Dominio
- [ ] `ProductCard` — usa `isProductAvailable()` como función pura
- [ ] `CartItemRow` — **nombre distinto** a la interfaz `CartItem` del dominio
- [ ] `CustomerChip` — prop `onClear: () => void` separada de `onSelect`
- [ ] `SaleReceipt`
- [ ] `PaymentMethodSelector`
- [ ] `StockIndicator`
- [ ] `CategoryTag`

### Layouts
- [ ] `SalesLayout` — grid 2fr/1fr para desktop
- [ ] `AdminLayout` — navegación por tabs
- [ ] `MainLayout` — header + sidebar + contenido
- [ ] Sistema de temas light/dark

---

## Fase 5 — Adaptadores (3 días)

### API (Axios)
- [ ] `ProductAPIAdapter`
- [ ] `SaleAPIAdapter`
- [ ] `CustomerAPIAdapter`
- [ ] `CartAPIAdapter`
- [ ] Interceptors para auth y logging
- [ ] Retry con backoff exponencial

### Storage
- [ ] `CartLocalStorageAdapter`
- [ ] `ProductIndexedDBAdapter` — cache offline
- [ ] `CacheManager` — políticas de expiración

### Pagos
- [ ] `CashPaymentGateway` — calcula cambio
- [ ] `CardPaymentGateway` — tokenización
- [ ] `TransferPaymentGateway` — referencia de comprobante
- [ ] `MixedPaymentGateway`

### Mappers
- [ ] `ProductMapper`
- [ ] `SaleMapper`
- [ ] `CustomerMapper`
- [ ] `CartMapper`

---

## Fase 6 — Páginas y Componentes de Dominio (5 días)

### Terminal de Ventas
- [ ] `SalesPage` — `handleCheckout(paymentMethod, paymentDetails)` tipado
- [ ] `ProductBrowser` — búsqueda con debounce 300ms, filtros, categorías
- [ ] `CartPanel` — props `onCustomerSelect` y `onCustomerClear` separadas
- [ ] `CheckoutModal` — `onComplete(method, details)` recibe ambos parámetros
- [ ] `useKeyboardShortcuts` — Ctrl+K, Ctrl+Enter, F2, F3, Escape

### Administración
- [ ] `ProductManagement` — CRUD completo
- [ ] `ProductForm` — validaciones en tiempo real
- [ ] `ProductTable` — sorting, filtros, paginación
- [ ] `CustomerManagement`
- [ ] `CustomerForm` — validación de NIT
- [ ] `SalesHistory` — filtros avanzados
- [ ] `ReportsDashboard` — métricas y gráficos

---

## Fase 7 — Integración y Estado Global (3 días)

### Redux Slices
- [ ] `productsSlice` — estado `AsyncState<PaginatedResponse<Product>>`
- [ ] `cartSlice`
- [ ] `salesSlice`
- [ ] `customersSlice`
- [ ] `uiSlice` — notificaciones (`AppNotification[]`), modales

### Hooks
- [ ] `useProducts` — conecta con `GetProducts`
- [ ] `useCart` — conecta con casos de uso del carrito
- [ ] `useSales` — conecta con `ProcessSale`
- [ ] `useCustomers` — conecta con gestión de clientes

### Infraestructura
- [ ] Error Boundary global con fallback UI
- [ ] Sistema de notificaciones centralizado (`AppNotification`)
- [ ] Redux Persist para estado seleccionado
- [ ] Selectors optimizados con reselect
- [ ] Lazy loading con `React.lazy` + code splitting por rutas

---

## Fase 8 — Testing (3 días)

### Unit Tests (Vitest)
- [ ] Entidades de dominio y validaciones
- [ ] Casos de uso con mocks de repositorios
- [ ] Adaptadores con mocks HTTP/storage
- [ ] Mappers
- [ ] Cobertura mínima: **80%** general, **90%** en dominio

### Integration Tests (Testing Library)
- [ ] Flujo completo de venta
- [ ] Manejo de errores y recuperación
- [ ] Persistencia y sincronización

### E2E Tests (Playwright)
- [ ] Login y navegación
- [ ] Proceso de venta con cada método de pago
- [ ] CRUD de productos
- [ ] Accesibilidad (WCAG 2.1 AA)

---

## Fase 9 — Producción y Deploy (2 días)

### Build
- [ ] Optimizar configuración de Vite para producción
- [ ] Variables de entorno: `.env.development`, `.env.production`
- [ ] Bundle analysis (`vite-bundle-visualizer`)
- [ ] PWA: service worker + manifest

### CI/CD
- [ ] GitHub Actions: lint → test → build → deploy
- [ ] Deploy automático a Vercel/Netlify
- [ ] Rollback automático en caso de error

### Documentación
- [ ] README con instrucciones de setup
- [ ] Guía de arquitectura y convenciones
- [ ] Manual de usuario para operadores POS

---

## Checklist de Calidad

### Código
- [ ] Sin errores TypeScript (`strict: true`)
- [ ] Sin warnings de ESLint
- [ ] Cobertura >80% general, >90% en dominio

### Arquitectura
- [ ] `Product` y demás entidades son **interfaces puras** (sin métodos)
- [ ] Las validaciones son **funciones puras** o clases estáticas
- [ ] `CartItemRow` no colisiona con la interfaz `CartItem`
- [ ] `AppNotification` no colisiona con `Notification` del DOM
- [ ] Sin dependencias circulares

### Performance
- [ ] First Contentful Paint < 3s
- [ ] Interacciones frecuentes < 100ms
- [ ] Virtual scrolling en listas grandes

### Accesibilidad
- [ ] WCAG 2.1 AA
- [ ] Navegación completa por teclado
- [ ] Atributos `aria-*` en modales y controles interactivos
