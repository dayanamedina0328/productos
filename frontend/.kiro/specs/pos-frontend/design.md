# Design — SOAP POS Frontend

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | React 18 + TypeScript 5 (strict mode) |
| Build | Vite |
| Estado global | Redux Toolkit |
| Routing | React Router DOM v6 |
| Formularios | React Hook Form + Yup |
| HTTP | Axios |
| Estilos | Tailwind CSS |
| Testing | Vitest + Testing Library + Playwright (E2E) |

---

## Arquitectura Hexagonal (Ports & Adapters)

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

**Regla de dependencia:**
- `domain` no importa de ninguna otra capa.
- `application` solo importa de `domain`.
- `infrastructure` y `ui` importan de `application` y `domain`.

---

## Estructura de Carpetas

```
src/
├── domain/
│   ├── entities/          # Product, Cart, CartItem, Sale, SaleItem, Customer, Category
│   ├── ports/             # ProductRepository, CartRepository, SaleRepository,
│   │                      # CustomerRepository, PaymentGateway
│   ├── validations/       # ProductValidations, CartValidations (clases estáticas)
│   └── events/            # DomainEvents (ProductAddedToCart, SaleCompleted, StockUpdated)
│
├── application/
│   ├── ports/             # GetProducts, CreateProduct, AddProductToCart, ProcessSale, …
│   ├── useCases/          # GetProductsUseCase, ProcessSaleUseCase, …
│   └── dtos/              # CreateProductRequest, ProcessSaleRequest, AddToCartRequest, …
│
├── infrastructure/
│   ├── api/               # ProductAPIAdapter, SaleAPIAdapter, CustomerAPIAdapter, CartAPIAdapter
│   ├── storage/           # CartLocalStorageAdapter, ProductIndexedDBAdapter, CacheManager
│   ├── payments/          # CashPaymentGateway, CardPaymentGateway,
│   │                      # TransferPaymentGateway, MixedPaymentGateway
│   ├── mappers/           # ProductMapper, SaleMapper, CustomerMapper, CartMapper
│   └── di/
│       └── container.ts   # Único lugar donde se usa `new` para instanciar dependencias
│
├── ui/
│   ├── pages/
│   │   ├── SalesPage/
│   │   └── AdminPage/
│   ├── components/
│   │   ├── base/          # Button, Input, Modal, Table, Card, Spinner, Toast, Badge
│   │   └── features/      # ProductCard, CartItemRow, CheckoutModal, CustomerChip,
│   │                      # PaymentMethodSelector, StockIndicator, SaleReceipt, …
│   ├── hooks/             # useCart, useProducts, useSales, useCustomers,
│   │                      # useKeyboardShortcuts
│   ├── store/             # productsSlice, cartSlice, salesSlice, customersSlice, uiSlice
│   └── types/             # AppNotification, ModalState
│
└── shared/
    └── types/             # ApiResponse, PaginatedResponse, AsyncState, Filters
```

---

## Contratos de Datos

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

### Puertos de Salida

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

### Puertos de Entrada (Casos de Uso)

```typescript
export interface GetProducts {
  execute(filters?: ProductFilters): Promise<PaginatedResponse<Product>>;
}
export interface CreateProduct {
  execute(request: CreateProductRequest): Promise<Product>;
}
export interface AddProductToCart {
  execute(request: AddToCartRequest): Promise<Cart>;
}
export interface ProcessSale {
  execute(request: ProcessSaleRequest): Promise<Sale>;
}
```

### DTOs de Aplicación

```typescript
export interface CreateProductRequest {
  sku: string; name: string; description: string;
  price: number; cost: number; stock: number; minStock: number;
  categoryId: string; imageUrl?: string;
}

export interface AddToCartRequest {
  productId: string; quantity: number; cartId?: string;
}

export interface ProcessSaleRequest {
  cartId: string; customerId?: string;
  paymentMethod: PaymentMethod; paymentDetails: PaymentDetails;
}

export interface PaymentDetails {
  cashReceived?: number;
  cardDetails?: { lastFourDigits: string; authorizationCode: string };
  transferReference?: string;
}
```

### Tipos Compartidos

```typescript
// shared/types/AsyncState.ts
export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: ApiError };

// shared/types/PaginatedResponse.ts
export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMetadata;
}

// ui/types/UIState.ts
// AppNotification evita colisión con la interfaz Notification del DOM
export interface AppNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string; message: string;
  duration?: number; timestamp: Date;
}
```

---

## Validaciones de Dominio

```typescript
// domain/validations/ProductValidations.ts
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

## Inyección de Dependencias

```typescript
// infrastructure/di/container.ts — único lugar donde se usa `new`
export const useCases = {
  getProducts:      new GetProductsUseCase(new ProductAPIAdapter(httpClient)),
  processSale:      new ProcessSaleUseCase(new SaleAPIAdapter(httpClient), new CashPaymentGateway()),
  addProductToCart: new AddProductToCartUseCase(new CartLocalStorageAdapter(), new ProductAPIAdapter(httpClient)),
};
```

---

## Diseño de Componentes Clave

### SalesPage

```typescript
export const SalesPage: React.FC = () => {
  const { cart, addItem, removeItem, updateQuantity, clearCart } = useCart();
  const { products, loading, searchProducts, filters, setFilters } = useProducts();
  const { selectedCustomer, selectCustomer, clearCustomer } = useCustomers();
  const { processSale, isProcessing } = useSales();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleCheckout = async (
    paymentMethod: PaymentMethod,
    paymentDetails: PaymentDetails
  ) => {
    await processSale({ cartId: cart.id, customerId: selectedCustomer?.id, paymentMethod, paymentDetails });
    clearCart();
    clearCustomer();
    setIsCheckoutOpen(false);
  };

  return (
    <SalesLayout>
      <ProductBrowser ... />
      <CartPanel ... />
      {isCheckoutOpen && <CheckoutModal ... />}
    </SalesLayout>
  );
};
```

### CartPanel — Props

```typescript
interface CartPanelProps {
  cart: Cart;
  customer?: Customer;
  onCustomerSelect: (customer: Customer) => void;
  onCustomerClear: () => void;          // separado para evitar null as any
  onItemRemove: (itemId: string) => void;
  onQuantityUpdate: (itemId: string, quantity: number) => void;
  onCheckout: () => void;
  onClear: () => void;
  isProcessing: boolean;
}
```

### CheckoutModal — Props

```typescript
interface CheckoutModalProps {
  cart: Cart;
  customer?: Customer;
  onClose: () => void;
  onComplete: (paymentMethod: PaymentMethod, paymentDetails: PaymentDetails) => Promise<void>;
}
```

### ProductCard — Funciones auxiliares

```typescript
// Product es interfaz pura — las validaciones son funciones independientes
function isProductAvailable(p: Product): boolean {
  return p.isActive && p.stock > 0;
}

function getStockStatus(stock: number, minStock: number): 'ok' | 'low' | 'out' {
  if (stock === 0) return 'out';
  if (stock <= minStock) return 'low';
  return 'ok';
}
```

---

## Redux Slices

| Slice | Estado |
|-------|--------|
| `productsSlice` | `AsyncState<PaginatedResponse<Product>>` |
| `cartSlice` | `Cart` + estado de operaciones |
| `salesSlice` | `AsyncState<PaginatedResponse<Sale>>` |
| `customersSlice` | `AsyncState<PaginatedResponse<Customer>>` |
| `uiSlice` | `AppNotification[]` + `ModalState` |

---

## Routing

```
/                   → redirige a /sales
/login              → LoginPage (pública)
/sales              → SalesPage (USER + ADMIN)
/admin              → AdminPage (solo ADMIN)
  /admin/products   → ProductManagement
  /admin/customers  → CustomerManagement
  /admin/sales      → SalesHistory
  /admin/reports    → ReportsDashboard
```

---

## Layout Responsive

```
Desktop (1920×1080):  grid-template-columns: 2fr 1fr
Tablet  (≤1280px):    grid-template-columns: 1fr  (carrito debajo, 400px)
Móvil   (≤768px):     carrito como drawer fijo en la parte inferior
```

---

## Atajos de Teclado

| Atajo | Acción |
|-------|--------|
| `Ctrl+K` | Enfocar búsqueda de productos |
| `Ctrl+Enter` | Iniciar checkout |
| `F2` | Abrir selector de cliente |
| `F3` | Ir a gestión de productos |
| `Escape` | Cerrar modal activo |
| `+` / `-` | Aumentar / disminuir cantidad del ítem seleccionado |
| `Delete` | Eliminar ítem seleccionado del carrito |

---

## Endpoints REST Consumidos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/products` | Listar productos con filtros y paginación |
| GET | `/products/:id` | Obtener producto por ID |
| POST | `/products` | Crear producto |
| PUT | `/products/:id` | Actualizar producto |
| DELETE | `/products/:id` | Eliminar producto |
| GET | `/customers` | Listar clientes |
| GET | `/customers/:id` | Obtener cliente por ID |
| POST | `/customers` | Crear cliente |
| GET | `/carts/:id` | Obtener carrito |
| POST | `/carts` | Crear carrito |
| PUT | `/carts/:id/items` | Agregar ítem al carrito |
| POST | `/sales` | Procesar venta |
| GET | `/sales` | Listar ventas con filtros |
| GET | `/sales/:id` | Obtener venta por ID |

---

## Eventos de Dominio

```typescript
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

---

## Decisiones de Diseño

| Decisión | Justificación |
|----------|--------------|
| `AppNotification` en lugar de `Notification` | Evita colisión con la interfaz `Notification` del DOM |
| `CartItemRow` en lugar de `CartItem` para el componente | Evita colisión con la interfaz `CartItem` del dominio |
| `onCustomerClear: () => void` separado de `onCustomerSelect` | Evita pasar `null as any`; tipado explícito y seguro |
| Entidades como interfaces puras (sin métodos) | Cumple el principio de responsabilidad única; las validaciones son funciones independientes |
| `container.ts` como único punto de instanciación | Facilita el intercambio de adaptadores (API → mock) sin tocar los casos de uso |
| Debounce de 300 ms en búsqueda | Balance entre responsividad y reducción de llamadas a la API |
