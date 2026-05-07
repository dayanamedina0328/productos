# Design — SOAP POS Frontend

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript 5 (strict mode) |
| Build | Vite |
| Global state | Redux Toolkit |
| Routing | React Router DOM v6 |
| Forms | React Hook Form + Yup |
| HTTP | Axios |
| Styles | Tailwind CSS |
| Testing | Vitest + Testing Library + Playwright (E2E) |

---

## Hexagonal Architecture (Ports & Adapters)

```
┌─────────────────────────────────────────────────────────┐
│                    INFRASTRUCTURE                        │
│  ┌──────────────┐              ┌──────────────────────┐  │
│  │  UI (React)  │              │  API / Storage / Pay │  │
│  │  Primary     │              │  Secondary           │  │
│  │  Adapter     │              │  Adapters            │  │
│  └──────┬───────┘              └──────────┬───────────┘  │
│         │ Input port                      │ Output port
│  ───────▼─────────────────────────────────▼────────────  │
│  │              APPLICATION (Use Cases)                │  │
│  │   GetProducts · ProcessSale · AddProductToCart      │  │
│  ──────────────────────────────────────────────────────  │
│         │                                               │
│  ───────▼──────────────────────────────────────────────  │
│  │                    DOMAIN                           │  │
│  │  Entities · Validations · Events · Ports            │  │
│  ──────────────────────────────────────────────────────  │
└─────────────────────────────────────────────────────────┘
```

**Dependency rule:**
- `domain` does not import from any other layer.
- `application` only imports from `domain`.
- `infrastructure` and `ui` import from `application` and `domain`.

---

## Folder Structure

```
src/
├── domain/
│   ├── entities/          # Product, Cart, CartItem, Sale, SaleItem, Customer, Category
│   ├── ports/             # ProductRepository, CartRepository, SaleRepository,
│   │                      # CustomerRepository, PaymentGateway
│   ├── validations/       # ProductValidations, CartValidations (static classes)
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
│       └── container.ts   # Only place where `new` is used to instantiate dependencies
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

## Data Contracts

### Domain Entities

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

### Output Ports

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

### Input Ports (Use Cases)

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

### Application DTOs

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

### Shared Types

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
// AppNotification avoids collision with the DOM Notification interface
export interface AppNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string; message: string;
  duration?: number; timestamp: Date;
}
```

---

## Domain Validations

```typescript
// domain/validations/ProductValidations.ts
export class ProductValidations {
  static validatePrice(price: number): ValidationResult {
    if (price <= 0)     return { isValid: false, errors: ['Price must be greater than 0'] };
    if (price > 999999) return { isValid: false, errors: ['Price cannot exceed 999,999'] };
    return { isValid: true };
  }

  static validateStock(stock: number, minStock: number): ValidationResult {
    if (stock < 0)        return { isValid: false, errors: ['Stock cannot be negative'] };
    if (stock < minStock) return { isValid: false, errors: ['Stock cannot be less than minimum stock'] };
    return { isValid: true };
  }
}

// domain/validations/CartValidations.ts
export class CartValidations {
  static validateAddItem(cart: Cart, product: Product, quantity: number): ValidationResult {
    if (quantity <= 0) return { isValid: false, errors: ['Quantity must be greater than 0'] };
    const existing = cart.items.find(i => i.product.id === product.id);
    const total = (existing?.quantity ?? 0) + quantity;
    if (total > product.stock) {
      return { isValid: false, errors: [`Insufficient stock. Available: ${product.stock}`] };
    }
    return { isValid: true };
  }
}
```

---

## Dependency Injection

```typescript
// infrastructure/di/container.ts — only place where `new` is used
export const useCases = {
  getProducts:      new GetProductsUseCase(new ProductAPIAdapter(httpClient)),
  processSale:      new ProcessSaleUseCase(new SaleAPIAdapter(httpClient), new CashPaymentGateway()),
  addProductToCart: new AddProductToCartUseCase(new CartLocalStorageAdapter(), new ProductAPIAdapter(httpClient)),
};
```

---

## Key Component Design

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
  onCustomerClear: () => void;          // separate to avoid null as any
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

### ProductCard — Helper Functions

```typescript
// Product is a pure interface — validations are independent functions
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

| Slice | State |
|-------|-------|
| `productsSlice` | `AsyncState<PaginatedResponse<Product>>` |
| `cartSlice` | `Cart` + operation state |
| `salesSlice` | `AsyncState<PaginatedResponse<Sale>>` |
| `customersSlice` | `AsyncState<PaginatedResponse<Customer>>` |
| `uiSlice` | `AppNotification[]` + `ModalState` |

---

## Routing

```
/                   → redirects to /sales
/login              → LoginPage (public)
/sales              → SalesPage (USER + ADMIN)
/admin              → AdminPage (ADMIN only)
  /admin/products   → ProductManagement
  /admin/customers  → CustomerManagement
  /admin/sales      → SalesHistory
  /admin/reports    → ReportsDashboard
```

---

## Responsive Layout

```
Desktop (1920×1080):  grid-template-columns: 2fr 1fr
Tablet  (≤1280px):    grid-template-columns: 1fr  (cart below, 400px)
Mobile  (≤768px):     cart as a fixed bottom drawer
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` | Focus product search |
| `Ctrl+Enter` | Start checkout |
| `F2` | Open customer selector |
| `F3` | Go to product management |
| `Escape` | Close active modal |
| `+` / `-` | Increase / decrease selected item quantity |
| `Delete` | Remove selected item from cart |

---

## Consumed REST Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/products` | List products with filters and pagination |
| GET | `/products/:id` | Get product by ID |
| POST | `/products` | Create product |
| PUT | `/products/:id` | Update product |
| DELETE | `/products/:id` | Delete product |
| GET | `/customers` | List customers |
| GET | `/customers/:id` | Get customer by ID |
| POST | `/customers` | Create customer |
| GET | `/carts/:id` | Get cart |
| POST | `/carts` | Create cart |
| PUT | `/carts/:id/items` | Add item to cart |
| POST | `/sales` | Process sale |
| GET | `/sales` | List sales with filters |
| GET | `/sales/:id` | Get sale by ID |

---

## Domain Events

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

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| `AppNotification` instead of `Notification` | Avoids collision with the DOM `Notification` interface |
| `CartItemRow` instead of `CartItem` for the component | Avoids collision with the domain `CartItem` interface |
| `onCustomerClear: () => void` separate from `onCustomerSelect` | Avoids passing `null as any`; explicit and type-safe |
| Entities as pure interfaces (no methods) | Follows the single responsibility principle; validations are independent functions |
| `container.ts` as the single instantiation point | Makes it easy to swap adapters (API → mock) without touching use cases |
| 300 ms debounce on search | Balance between responsiveness and reducing API calls |
