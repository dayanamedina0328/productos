# Especificaciones Técnicas — Sistema POS Frontend

## Descripción del Sistema

**SOAP POS** es un sistema de punto de venta (Point of Sale) diseñado para gestionar el proceso completo de compra-venta en un negocio. Permite a los operadores realizar ventas, emitir facturas y administrar el inventario desde una interfaz web optimizada para uso en terminal de caja.

### ¿Qué hace el sistema?

| Módulo | Funcionalidad |
|--------|--------------|
| **Ventas** | Buscar productos, agregarlos al carrito, aplicar descuentos y procesar el cobro con efectivo, tarjeta o transferencia |
| **Facturación** | Generar facturas automáticamente al completar una venta: número de factura, detalle de productos, subtotal, IVA y total |
| **Productos** | Crear, editar y eliminar productos con SKU, precio, costo, stock mínimo y categoría |
| **Inventario** | Control de stock en tiempo real: se descuenta al vender y se alerta cuando está por debajo del mínimo |
| **Clientes** | Registrar clientes con NIT para asociarlos a facturas; tipos: regular, VIP y corporativo |
| **Carrito** | Agregar múltiples productos, modificar cantidades, aplicar descuentos, retener ventas en curso |
| **Historial de ventas** | Consultar ventas anteriores con filtros por fecha, cliente, método de pago y estado |
| **Reportes** | Resúmenes diarios, semanales y mensuales con métricas de ingresos y productos más vendidos |
| **Administración** | Panel para gestionar productos, categorías, clientes y usuarios del sistema |

### Flujo principal de una venta

```
1. Cajero busca producto por nombre o SKU
2. Agrega producto al carrito (valida stock disponible)
3. Opcionalmente asocia un cliente (para factura con NIT)
4. Aplica descuentos si corresponde
5. Selecciona método de pago (efectivo / tarjeta / transferencia)
6. Sistema procesa el pago y descuenta el stock
7. Se genera la factura automáticamente
8. El carrito se limpia y queda listo para la siguiente venta
```

### Roles de usuario

| Rol | Permisos |
|-----|----------|
| **Cajero (USER)** | Realizar ventas, consultar productos y clientes, ver historial propio |
| **Administrador (ADMIN)** | Todo lo anterior + gestión de productos, clientes, usuarios y reportes completos |

---

## Stack Tecnológico

- **Framework:** React 18 + TypeScript 5 (strict mode)
- **Build tool:** Vite
- **Estado global:** Redux Toolkit
- **Routing:** React Router DOM v6
- **Formularios:** React Hook Form + Yup
- **HTTP:** Axios
- **Estilos:** Tailwind CSS
- **Testing:** Vitest + Testing Library + Playwright (E2E)

---

## Principios de Diseño

### SOLID

| Principio | Aplicación en el frontend |
|-----------|--------------------------|
| **S** — Single Responsibility | Cada componente, hook y caso de uso tiene una única razón para cambiar. `useCart` solo gestiona el carrito; `useProducts` solo gestiona productos. |
| **O** — Open/Closed | Los adaptadores implementan interfaces del dominio. Para cambiar la fuente de datos (API → mock) se crea un nuevo adaptador sin tocar los casos de uso. |
| **L** — Liskov Substitution | Cualquier implementación de `ProductRepository` puede sustituirse sin romper los casos de uso que la consumen. |
| **I** — Interface Segregation | Los repositorios están separados por dominio (`ProductRepository`, `CartRepository`, `SaleRepository`). Ningún caso de uso depende de métodos que no usa. |
| **D** — Dependency Inversion | Los casos de uso dependen de interfaces (puertos), no de implementaciones concretas (adaptadores). La inyección se realiza en `infrastructure/di/container.ts`. |

### Arquitectura Hexagonal (Ports & Adapters)

```
┌─────────────────────────────────────────────────────────┐
│                    INFRAESTRUCTURA                       │
│  ┌──────────────┐              ┌──────────────────────┐  │
│  │  UI (React)  │              │  API / Storage / Pay │  │
│  │  Adaptador   │              │  Adaptadores         │  │
│  │  primario    │              │  secundarios         │  │
│  └──────┬───────┘              └──────────┬───────────┘  │
│         │ Puerto de entrada               │ Puerto de salida
│  ───────▼─────────────────────────────────▼────────────  │
│  │              APLICACIÓN (Casos de Uso)              │  │
│  │   GetProducts · ProcessSale · AddProductToCart      │  │
│  ──────────────────────────────────────────────────────  │
│         │                                               │
│  ───────▼──────────────────────────────────────────────  │
│  │                  DOMINIO                            │  │
│  │  Entidades · Validaciones · Eventos · Puertos       │  │
│  ──────────────────────────────────────────────────────  │
└─────────────────────────────────────────────────────────┘
```

**Regla de dependencia:** las capas internas nunca importan de las capas externas.
- `domain` no importa de `application`, `infrastructure` ni `ui`
- `application` solo importa de `domain`
- `infrastructure` y `ui` importan de `application` y `domain`

### Inversión de Dependencias (DI)

Los casos de uso reciben sus dependencias por constructor, nunca las instancian directamente.

```typescript
// application/useCases/GetProductsUseCase.ts
export class GetProductsUseCase implements GetProducts {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    return this.productRepository.findAll(filters);
  }
}

// infrastructure/di/container.ts — único lugar donde se usa new
export const useCases = {
  getProducts:      new GetProductsUseCase(new ProductAPIAdapter(httpClient)),
  processSale:      new ProcessSaleUseCase(new SaleAPIAdapter(httpClient), new CashPaymentGateway()),
  addProductToCart: new AddProductToCartUseCase(new CartLocalStorageAdapter(), new ProductAPIAdapter(httpClient)),
};
```

---

## Estructura de Carpetas

```
src/
├── domain/                        # Núcleo — sin dependencias externas
│   ├── entities/                  # Interfaces puras: Product, Cart, Sale, Customer
│   ├── ports/                     # Puertos de salida: ProductRepository, PaymentGateway, etc.
│   ├── validations/               # ProductValidations, CartValidations (funciones/clases estáticas)
│   └── events/                    # DomainEvents
│
├── application/                   # Casos de uso — depende solo de domain
│   ├── ports/                     # Puertos de entrada: GetProducts, ProcessSale, etc.
│   ├── useCases/                  # Implementaciones: GetProductsUseCase, etc.
│   └── dtos/                      # CreateProductRequest, ProcessSaleRequest, etc.
│
├── infrastructure/                # Adaptadores — implementan puertos del dominio
│   ├── api/                       # ProductAPIAdapter, SaleAPIAdapter (implements ProductRepository, etc.)
│   ├── storage/                   # CartLocalStorageAdapter, ProductIndexedDBAdapter
│   ├── payments/                  # CashPaymentGateway, CardPaymentGateway (implements PaymentGateway)
│   ├── mappers/                   # ProductMapper, SaleMapper, CustomerMapper
│   └── di/
│       └── container.ts           # ÚNICO lugar donde se instancian dependencias (new)
│
├── ui/                            # Adaptadores primarios — React
│   ├── pages/                     # SalesPage, AdminPage
│   ├── components/
│   │   ├── base/                  # Button, Input, Modal, Table, Toast, Badge
│   │   └── features/              # ProductCard, CartItemRow, CheckoutModal, etc.
│   ├── hooks/                     # useCart, useProducts, useSales, useCustomers
│   ├── store/                     # Redux slices
│   └── types/                     # AppNotification, ModalState
│
└── shared/                        # Tipos sin lógica compartidos entre capas
    └── types/                     # ApiResponse, PaginatedResponse, AsyncState, Filters
```

---

## Contratos de Datos (Interfaces TypeScript)

### Entidades de Dominio

```typescript
// domain/entities/Product.ts
export interface Product {
  readonly id: string;
  readonly sku: string;
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly cost: number;
  readonly stock: number;
  readonly minStock: number;
  readonly category: Category;
  readonly imageUrl?: string;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// domain/entities/Category.ts
export interface Category {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly parentId?: string;
  readonly level: number;
  readonly isActive: boolean;
}

// domain/entities/Customer.ts
export interface Customer {
  readonly id: string;
  readonly name: string;
  readonly email?: string;
  readonly phone?: string;
  readonly nit: string;
  readonly address?: string;
  readonly type: CustomerType;
  readonly creditLimit?: number;
  readonly isActive: boolean;
  readonly createdAt: Date;
}

export enum CustomerType {
  REGULAR = 'regular',
  VIP = 'vip',
  CORPORATE = 'corporate',
}

// domain/entities/Cart.ts
export interface Cart {
  readonly id: string;
  readonly items: CartItem[];
  readonly customerId?: string;
  readonly subtotal: number;
  readonly tax: number;
  readonly discount: number;
  readonly total: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface CartItem {
  readonly id: string;
  readonly product: Product;
  readonly quantity: number;
  readonly unitPrice: number;
  readonly discount: number;
  readonly subtotal: number;
}

// domain/entities/Sale.ts
export interface Sale {
  readonly id: string;
  readonly invoiceNumber: string;
  readonly customerId?: string;
  readonly items: SaleItem[];
  readonly subtotal: number;
  readonly tax: number;
  readonly discount: number;
  readonly total: number;
  readonly paymentMethod: PaymentMethod;
  readonly paymentDetails: PaymentDetails;
  readonly status: SaleStatus;
  readonly createdAt: Date;
  readonly createdBy: string;
}

export interface SaleItem {
  readonly id: string;
  readonly product: Product;
  readonly quantity: number;
  readonly unitPrice: number;
  readonly discount: number;
  readonly subtotal: number;
}

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  TRANSFER = 'transfer',
  MIXED = 'mixed',
}

export enum SaleStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}
```

### Puertos de Salida (Interfaces de Repositorios)

```typescript
// domain/ports/ProductRepository.ts
export interface ProductRepository {
  findAll(filters?: ProductFilters): Promise<PaginatedResponse<Product>>;
  findById(id: string): Promise<Product>;
  save(request: CreateProductRequest): Promise<Product>;
  update(id: string, request: UpdateProductRequest): Promise<Product>;
  delete(id: string): Promise<void>;
}

// domain/ports/CartRepository.ts
export interface CartRepository {
  findById(id: string): Promise<Cart>;
  save(request: CreateCartRequest): Promise<Cart>;
  addItem(cartId: string, request: AddToCartRequest): Promise<Cart>;
  removeItem(cartId: string, itemId: string): Promise<Cart>;
  clear(cartId: string): Promise<void>;
}

// domain/ports/SaleRepository.ts
export interface SaleRepository {
  findAll(filters?: SaleFilters): Promise<PaginatedResponse<Sale>>;
  findById(id: string): Promise<Sale>;
  save(request: ProcessSaleRequest): Promise<Sale>;
  cancel(id: string): Promise<Sale>;
}

// domain/ports/CustomerRepository.ts
export interface CustomerRepository {
  findAll(filters?: CustomerFilters): Promise<PaginatedResponse<Customer>>;
  findById(id: string): Promise<Customer>;
  save(request: CreateCustomerRequest): Promise<Customer>;
}

// domain/ports/PaymentGateway.ts
export interface PaymentGateway {
  process(amount: number, details: PaymentDetails): Promise<PaymentResult>;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}
```

### Puertos de Entrada (Interfaces de Casos de Uso)

```typescript
// application/ports/GetProducts.ts
export interface GetProducts {
  execute(filters?: ProductFilters): Promise<PaginatedResponse<Product>>;
}

// application/ports/CreateProduct.ts
export interface CreateProduct {
  execute(request: CreateProductRequest): Promise<Product>;
}

// application/ports/AddProductToCart.ts
export interface AddProductToCart {
  execute(request: AddToCartRequest): Promise<Cart>;
}

// application/ports/ProcessSale.ts
export interface ProcessSale {
  execute(request: ProcessSaleRequest): Promise<Sale>;
}
```

### DTOs de Aplicación

```typescript
// application/dtos/CreateProductRequest.ts
export interface CreateProductRequest {
  sku: string;
  name: string;
  description: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  categoryId: string;
  imageUrl?: string;
}

// application/dtos/UpdateProductRequest.ts
export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  cost?: number;
  stock?: number;
  minStock?: number;
  categoryId?: string;
  imageUrl?: string;
  isActive?: boolean;
}

// application/dtos/CreateCustomerRequest.ts
export interface CreateCustomerRequest {
  name: string;
  nit: string;
  email?: string;
  phone?: string;
  address?: string;
  type: CustomerType;
  creditLimit?: number;
}

// application/dtos/CreateCartRequest.ts
export interface CreateCartRequest {
  customerId?: string;
}

// application/dtos/AddToCartRequest.ts
export interface AddToCartRequest {
  productId: string;
  quantity: number;
  cartId?: string;
}

// application/dtos/ProcessSaleRequest.ts
export interface ProcessSaleRequest {
  cartId: string;
  customerId?: string;
  paymentMethod: PaymentMethod;
  paymentDetails: PaymentDetails;
}

export interface PaymentDetails {
  cashReceived?: number;
  cardDetails?: CardDetails;
  transferReference?: string;
}

export interface CardDetails {
  lastFourDigits: string;
  authorizationCode: string;
}
```

### Tipos Compartidos

```typescript
// shared/types/ApiResponse.ts
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  metadata?: ResponseMetadata;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: string;
}

export interface ResponseMetadata {
  pagination?: PaginationMetadata;
  requestId: string;
  timestamp: string;
}

export interface PaginationMetadata {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// shared/types/PaginatedResponse.ts
export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMetadata;
}

// shared/types/AsyncState.ts
export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: ApiError };
```

### Filtros

```typescript
// shared/types/Filters.ts
export interface ProductFilters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface CustomerFilters {
  type?: CustomerType;
  search?: string;
  active?: boolean;
  page?: number;
  pageSize?: number;
}

export interface SaleFilters {
  customerId?: string;
  status?: SaleStatus;
  paymentMethod?: PaymentMethod;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  pageSize?: number;
}
```

### Estado de UI

```typescript
// ui/types/UIState.ts
// AppNotification evita colisión con la interfaz Notification del DOM
export interface AppNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  timestamp: Date;
}

export interface ModalState {
  checkout: boolean;
  customerSelector: boolean;
  productDetails: boolean;
}
```

---

## Endpoints REST

```typescript
// shared/types/ApiEndpoints.ts
export interface ApiEndpoints {
  'GET /products':        { query?: ProductFilters;     response: PaginatedResponse<Product> };
  'GET /products/:id':    { params: { id: string };     response: Product };
  'POST /products':       { body: CreateProductRequest; response: Product };
  'PUT /products/:id':    { params: { id: string }; body: UpdateProductRequest; response: Product };
  'DELETE /products/:id': { params: { id: string };     response: void };

  'GET /customers':       { query?: CustomerFilters;    response: PaginatedResponse<Customer> };
  'GET /customers/:id':   { params: { id: string };     response: Customer };
  'POST /customers':      { body: CreateCustomerRequest; response: Customer };

  'GET /carts/:id':       { params: { id: string };     response: Cart };
  'POST /carts':          { body: CreateCartRequest;    response: Cart };
  'PUT /carts/:id/items': { params: { id: string }; body: AddToCartRequest; response: Cart };

  'POST /sales':          { body: ProcessSaleRequest;   response: Sale };
  'GET /sales':           { query?: SaleFilters;        response: PaginatedResponse<Sale> };
  'GET /sales/:id':       { params: { id: string };     response: Sale };
}
```

---

## Validaciones de Negocio

```typescript
// domain/validations/ProductValidations.ts
export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
}

export class ProductValidations {
  static validatePrice(price: number): ValidationResult {
    if (price <= 0)     return { isValid: false, errors: ['El precio debe ser mayor a 0'] };
    if (price > 999999) return { isValid: false, errors: ['El precio no puede superar 999,999'] };
    return { isValid: true };
  }

  static validateStock(stock: number, minStock: number): ValidationResult {
    if (stock < 0)        return { isValid: false, errors: ['El stock no puede ser negativo'] };
    if (stock < minStock) return { isValid: false, errors: ['El stock no puede ser menor al stock mínimo'] };
    return { isValid: true };
  }
}

// domain/validations/CartValidations.ts
export class CartValidations {
  static validateAddItem(cart: Cart, product: Product, quantity: number): ValidationResult {
    if (quantity <= 0) return { isValid: false, errors: ['La cantidad debe ser mayor a 0'] };

    const existing = cart.items.find(i => i.product.id === product.id);
    const total = (existing?.quantity ?? 0) + quantity;

    if (total > product.stock) {
      return { isValid: false, errors: [`Stock insuficiente. Disponible: ${product.stock}`] };
    }
    return { isValid: true };
  }
}
```

---

## Eventos de Dominio

```typescript
// domain/events/DomainEvents.ts
export interface DomainEvent {
  id: string;
  timestamp: Date;
  aggregateId: string;
  eventType: string;
}

export interface ProductAddedToCart extends DomainEvent {
  eventType: 'ProductAddedToCart';
  data: { productId: string; cartId: string; quantity: number };
}

export interface SaleCompleted extends DomainEvent {
  eventType: 'SaleCompleted';
  data: { saleId: string; totalAmount: number; paymentMethod: PaymentMethod };
}

export interface StockUpdated extends DomainEvent {
  eventType: 'StockUpdated';
  data: { productId: string; newStock: number; previousStock: number };
}
```
