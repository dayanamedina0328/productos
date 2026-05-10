# Tasks — SOAP POS Frontend

## Phase Summary

| Phase | Description | Estimated days |
|-------|-------------|---------------|
| 1 | Project setup | 2 |
| 2 | Domain (entities, validations, ports) | 3 |
| 3 | Use cases | 4 |
| 4 | Base UI components | 2 |
| 5 | Adapters (API, storage, payments) | 3 |
| 6 | Pages and domain components | 5 |
| 7 | Integration and global state | 3 |
| 8 | Testing | 3 |
| 9 | Production and deploy | 2 |
| **Total** | | **27 days (~5.5 weeks)** |

---

## Phase 1 — Project Setup

- [x] 1.1 Create project with Vite (`npm create vite@latest pos-frontend -- --template react-ts`)
- [x] 1.2 Install main dependencies: `@reduxjs/toolkit react-redux react-router-dom axios react-hook-form @hookform/resolvers yup clsx tailwindcss @tailwindcss/vite`
- [x] 1.3 Install dev dependencies: `@types/node eslint-config-prettier prettier @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest jsdom`
- [x] 1.4 Create full folder structure following hexagonal architecture (`domain/`, `application/`, `infrastructure/`, `ui/`, `shared/`)
- [x] 1.5 Configure `tsconfig.json` with `strict: true` and path mapping `@/` → `src/`
- [x] 1.6 Configure Tailwind CSS with custom theme (colors, typography, POS spacing)
- [x] 1.7 Configure ESLint + Prettier with strict rules (no-any, import/order, etc.)
- [x] 1.8 Configure Redux Toolkit base store with middleware and devtools
- [x] 1.9 Configure React Router DOM v6 with initial routes (`/login`, `/sales`, `/admin`)
- [x] 1.10 Configure Vitest with jsdom and coverage (threshold 80 % overall, 90 % domain)

---

## Phase 2 — Domain

- [x] 2.1 Create `Product` interface with all fields (`id`, `sku`, `name`, `description`, `price`, `cost`, `stock`, `minStock`, `category`, `imageUrl?`, `isActive`, `createdAt`, `updatedAt`)
- [x] 2.2 Create `Category` interface (`id`, `name`, `description?`, `parentId?`, `level`, `isActive`)
- [x] 2.3 Create `Customer` interface and `CustomerType` enum (REGULAR, VIP, CORPORATE)
- [x] 2.4 Create `Cart` and `CartItem` interfaces
- [x] 2.5 Create `Sale` and `SaleItem` interfaces, `PaymentMethod` enum (CASH, CARD, TRANSFER, MIXED) and `SaleStatus` enum (PENDING, COMPLETED, CANCELLED, REFUNDED)
- [x] 2.6 Implement `ProductValidations.validatePrice()` — rejects price ≤ 0 or > 999 999
- [x] 2.7 Implement `ProductValidations.validateStock()` — rejects negative stock or stock below `minStock`
- [x] 2.8 Implement `CartValidations.validateAddItem()` — validates quantity > 0 and available stock
- [x] 2.9 Implement pure function `isProductAvailable(product: Product): boolean`
- [x] 2.10 Implement pure function `getStockStatus(stock, minStock): 'ok' | 'low' | 'out'`
- [x] 2.11 Create `ProductRepository` interface (findAll, findById, save, update, delete)
- [x] 2.12 Create `CartRepository` interface (findById, save, addItem, removeItem, clear)
- [x] 2.13 Create `SaleRepository` interface (findAll, findById, save, cancel)
- [x] 2.14 Create `CustomerRepository` interface (findAll, findById, save)
- [x] 2.15 Create `PaymentGateway` interface with `process()` and `PaymentResult` type
- [x] 2.16 Create value objects: `Money` (safe arithmetic), `SKU` (format validation), `Quantity` (limits)
- [x] 2.17 Create domain events: `ProductAddedToCart`, `SaleCompleted`, `StockUpdated`

---

## Phase 3 — Use Cases

### Products
- [x] 3.1 Implement `GetProductsUseCase` — returns `PaginatedResponse<Product>` with optional filters
- [x] 3.2 Implement `CreateProductUseCase` — validates price and stock before persisting
- [x] 3.3 Implement `UpdateProductUseCase`
- [x] 3.4 Implement `DeleteProductUseCase` — validates the product has no associated sales
- [x] 3.5 Implement `SearchProductsUseCase` — search by name or SKU

### Cart
- [x] 3.6 Implement `AddProductToCartUseCase` — validates stock in real time with `CartValidations`
- [x] 3.7 Implement `RemoveFromCartUseCase`
- [x] 3.8 Implement `UpdateCartItemUseCase`
- [x] 3.9 Implement `ClearCartUseCase`
- [x] 3.10 Implement `ApplyDiscountUseCase`
- [x] 3.11 Implement `HoldSaleUseCase` — saves a pending sale to resume later

### Sales
- [x] 3.12 Implement `ProcessSaleUseCase` — requires `paymentMethod` and `paymentDetails`; generates invoice and decrements stock
- [x] 3.13 Implement `CancelSaleUseCase` — reverts the stock of the involved products
- [x] 3.14 Implement `RefundSaleUseCase`
- [x] 3.15 Implement `GetSalesHistoryUseCase` — returns `PaginatedResponse<Sale>` with filters
- [x] 3.16 Implement `GenerateInvoiceUseCase`

### Customers
- [x] 3.17 Implement `GetCustomersUseCase` — returns `PaginatedResponse<Customer>`
- [x] 3.18 Implement `CreateCustomerUseCase` — validates NIT uniqueness
- [x] 3.19 Implement `UpdateCustomerUseCase`
- [x] 3.20 Implement `SearchCustomersUseCase` — search by name or NIT

---

## Phase 4 — Base UI Components

### Primitives
- [x] 4.1 `Button` — variants: primary, secondary, ghost, danger; `loading` prop with integrated spinner
- [x] 4.2 `Input` — error states, visual validation, accessible label
- [x] 4.3 `Modal` — focus trap, `aria-modal`, backdrop with click-outside close
- [x] 4.4 `Table` — sorting, pagination, filters, loading skeleton
- [x] 4.5 `Card`
- [x] 4.6 `Spinner`
- [x] 4.7 `Toast` / `AppNotification` — **do not use the name `Notification`** (collides with the DOM API)
- [x] 4.8 `Badge`
- [x] 4.9 `ScrollArea`
- [x] 4.10 `SearchInput` with configurable debounce

### Domain Components
- [x] 4.11 `ProductCard` — uses `isProductAvailable()` and `getStockStatus()` as pure functions; button disabled when out of stock
- [x] 4.12 `CartItemRow` — **different name** from the domain `CartItem` interface; includes `QuantityInput` and `QuantityDisplay`
- [x] 4.13 `CustomerChip` — `onClear: () => void` prop separate from `onSelect`
- [x] 4.14 `SaleReceipt`
- [x] 4.15 `PaymentMethodSelector` — tabs for CASH, CARD, TRANSFER with a specific form per method
- [x] 4.16 `StockIndicator` — differentiated colors for ok / low / out
- [x] 4.17 `CategoryTag`
- [x] 4.18 `ProductGridSkeleton` — loading skeleton for the product grid
- [x] 4.19 `EmptyState` — generic component with icon, title, and description

### Layouts
- [x] 4.20 `SalesLayout` — `2fr 1fr` grid for desktop, responsive for tablet and mobile
- [x] 4.21 `AdminLayout` — tab navigation (Products, Customers, Sales, Reports)
- [x] 4.22 `MainLayout` — header + sidebar + main content
- [x] 4.23 Light/dark theme system with Tailwind

---

## Phase 5 — Adapters

### API (Axios)
- [x] 5.1 Configure Axios base instance with `baseURL`, headers, and timeout
- [x] 5.2 Implement authentication interceptor (attaches JWT to each request)
- [x] 5.3 Implement logging interceptor and global HTTP error handling
- [x] 5.4 Implement retry with exponential backoff for 5xx errors
- [x] 5.5 Implement `ProductAPIAdapter` (implements `ProductRepository`)
- [x] 5.6 Implement `SaleAPIAdapter` (implements `SaleRepository`)
- [x] 5.7 Implement `CustomerAPIAdapter` (implements `CustomerRepository`)
- [x] 5.8 Implement `CartAPIAdapter` (implements `CartRepository`)

### Storage
- [x] 5.9 Implement `CartLocalStorageAdapter` — persists the active cart between reloads
- [x] 5.10 Implement `ProductIndexedDBAdapter` — offline catalog cache
- [x] 5.11 Implement `CacheManager` with configurable expiration policies

### Payments
- [x] 5.12 Implement `CashPaymentGateway` — calculates change to return
- [x] 5.13 Implement `CardPaymentGateway` — card data tokenization
- [x] 5.14 Implement `TransferPaymentGateway` — voucher reference
- [x] 5.15 Implement `MixedPaymentGateway` — combines multiple methods

### Mappers
- [x] 5.16 Implement `ProductMapper` (API response ↔ domain)
- [x] 5.17 Implement `SaleMapper`
- [x] 5.18 Implement `CustomerMapper`
- [x] 5.19 Implement `CartMapper`

### DI Container
- [x] 5.20 Implement `infrastructure/di/container.ts` — instantiates all use cases with their adapters

---

## Phase 6 — Pages and Domain Components

### Sales Terminal
- [x] 6.1 Implement `SalesPage` — orchestrates `ProductBrowser`, `CartPanel`, and `CheckoutModal`; `handleCheckout(paymentMethod, paymentDetails)` typed
- [x] 6.2 Implement `ProductBrowser` — search with 300 ms debounce, category filters, grid/list toggle
- [x] 6.3 Implement `CartPanel` — `onCustomerSelect` and `onCustomerClear` props separate; shows subtotal, VAT, and total in real time
- [x] 6.4 Implement `CheckoutModal` — `onComplete(method, details)` receives both parameters; shows order summary
- [x] 6.5 Implement `CustomerSelectorModal` — customer search and selection
- [x] 6.6 Implement `useKeyboardShortcuts` — Ctrl+K, Ctrl+Enter, F2, F3, Escape, +/-, Delete

### Administration
- [x] 6.7 Implement `AdminPage` with `TabNavigation` (Products, Customers, Sales, Reports)
- [x] 6.8 Implement `ProductManagement` — full CRUD with paginated table
- [x] 6.9 Implement `ProductForm` — real-time validations with React Hook Form + Yup
- [x] 6.10 Implement `ProductTable` — sorting, filters, pagination, low-stock indicator
- [x] 6.11 Implement `CustomerManagement`
- [x] 6.12 Implement `CustomerForm` — unique NIT validation
- [x] 6.13 Implement `SalesHistory` — filters by date, customer, payment method, and status
- [x] 6.14 Implement `ReportsDashboard` — daily/weekly/monthly metrics with charts

---

## Phase 7 — Integration and Global State

### Redux Slices
- [x] 7.1 Implement `productsSlice` with state `AsyncState<PaginatedResponse<Product>>`
- [x] 7.2 Implement `cartSlice` with actions: addItem, removeItem, updateQuantity, clear, hold
- [x] 7.3 Implement `salesSlice` with state `AsyncState<PaginatedResponse<Sale>>`
- [x] 7.4 Implement `customersSlice`
- [x] 7.5 Implement `uiSlice` — manages `AppNotification[]` and `ModalState`

### Hooks
- [x] 7.6 Implement `useProducts` — connects to `GetProductsUseCase`; exposes `products`, `loading`, `searchProducts`, `filters`, `setFilters`
- [x] 7.7 Implement `useCart` — connects to cart use cases; exposes `cart`, `addItem`, `removeItem`, `updateQuantity`, `clearCart`
- [x] 7.8 Implement `useSales` — connects to `ProcessSaleUseCase`; exposes `processSale`, `isProcessing`
- [x] 7.9 Implement `useCustomers` — connects to customer management; exposes `selectedCustomer`, `selectCustomer`, `clearCustomer`

### UI Infrastructure
- [x] 7.10 Implement global Error Boundary with fallback UI
- [x] 7.11 Implement centralized notification system using `AppNotification`
- [x] 7.12 Configure Redux Persist for `cartSlice` and `uiSlice`
- [x] 7.13 Implement optimized selectors with `reselect`
- [x] 7.14 Configure lazy loading with `React.lazy` + code splitting by route
- [x] 7.15 Implement protected routes: `ProtectedRoute` (authentication) and `AdminRoute` (ADMIN role)

---

## Phase 8 — Testing

### Unit Tests (Vitest)
- [x] 8.1 Tests for domain entities and validations (`ProductValidations`, `CartValidations`)
- [x] 8.2 Tests for use cases with repository mocks (all use cases from phases 3.1–3.20)
- [x] 8.3 Tests for adapters with HTTP/storage mocks
- [x] 8.4 Tests for mappers
- [~] 8.5 Verify coverage ≥ 80 % overall and ≥ 90 % in the `domain` layer

### Integration Tests (Testing Library)
- [x] 8.6 Test for the complete sale flow (search → add → checkout → complete)
- [x] 8.7 Test for error handling and recovery (insufficient stock, network error)
- [x] 8.8 Test for cart persistence in localStorage

### E2E Tests (Playwright)
- [~] 8.9 Test for login and navigation between routes
- [~] 8.10 Test for the sale process with each payment method (cash, card, transfer)
- [~] 8.11 Test for product CRUD in the admin panel
- [~] 8.12 Accessibility test (WCAG 2.1 AA) with axe-playwright

---

## Phase 9 — Production and Deploy

### Build
- [x] 9.1 Optimize Vite configuration for production (minification, tree-shaking, chunks)
- [x] 9.2 Configure environment variables: `.env.development` and `.env.production`
- [~] 9.3 Analyze bundle with `vite-bundle-visualizer` and optimize large chunks
- [~] 9.4 Configure PWA: service worker + manifest (basic offline)

### CI/CD
- [~] 9.5 Configure GitHub Actions: lint → test → build → deploy
- [~] 9.6 Configure automatic deploy to Vercel or Netlify
- [~] 9.7 Configure automatic rollback on pipeline failure

### Documentation
- [x] 9.8 Write README with setup instructions, environment variables, and available commands
- [~] 9.9 Write architecture and project conventions guide
- [~] 9.10 Write user manual for POS operators (cashier and administrator)

---

## Final Quality Checklist

### Code
- [~] No TypeScript errors (`strict: true`)
- [~] No ESLint warnings
- [~] Coverage ≥ 80 % overall, ≥ 90 % in domain

### Architecture
- [~] `Product` and other entities are pure interfaces (no instance methods)
- [~] Validations are pure functions or classes with static methods
- [~] `CartItemRow` does not collide with the domain `CartItem` interface
- [~] `AppNotification` does not collide with the DOM `Notification`
- [~] No circular dependencies between modules
- [~] `container.ts` is the only place where `new` is used to instantiate dependencies

### Performance
- [~] First Contentful Paint < 3 s
- [~] Frequent interactions < 100 ms
- [~] Virtual scrolling in lists with more than 100 items

### Accessibility
- [~] WCAG 2.1 AA verified with automated tools
- [~] Full keyboard navigation on all screens
- [~] `aria-*` attributes on modals and interactive controls
