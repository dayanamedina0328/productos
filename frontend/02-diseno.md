# Diseño UI/UX — Sistema POS Frontend

## Layout Principal (1920×1080)

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER: Usuario | Terminal | Fecha/Hora | Configuración        │
├──────────────────────────────────┬──────────────────────────────┤
│  BUSCADOR DE PRODUCTOS           │  PANEL DEL CARRITO           │
│                                  │                              │
│  [🔍 Buscar por nombre o SKU...] │  Cliente: Juan Pérez (F2)    │
│  [Todos] [Electrónica] [Ropa]    │  ─────────────────────────── │
│                                  │  1. Laptop Dell   $1,299.00  │
│  ┌──────┐ ┌──────┐ ┌──────┐     │  2. Mouse         $  29.99   │
│  │  P1  │ │  P2  │ │  P3  │     │  3. Teclado       $  79.99   │
│  │$1,299│ │ $899 │ │ $299 │     │  ─────────────────────────── │
│  └──────┘ └──────┘ └──────┘     │  Subtotal:       $1,408.97   │
│  ┌──────┐ ┌──────┐ ┌──────┐     │  IVA (19%):      $  267.70   │
│  │  P4  │ │  P5  │ │  P6  │     │  Descuento:      $  -50.00   │
│  │ $199 │ │ $599 │ │  $99 │     │  ─────────────────────────── │
│  └──────┘ └──────┘ └──────┘     │  TOTAL:          $1,626.67   │
│                                  │                              │
│                                  │  [Retener]      [💳 Pagar]   │
│                                  │  [Limpiar]                   │
└──────────────────────────────────┴──────────────────────────────┘
```

---

## Componentes React

### SalesPage

```typescript
// ui/pages/SalesPage/SalesPage.tsx
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
      <div className="sales-container">
        <ProductBrowser
          products={products}
          loading={loading}
          filters={filters}
          onSearch={searchProducts}
          onFiltersChange={setFilters}
          onProductSelect={(product) => addItem(product.id, 1)}
        />
        <CartPanel
          cart={cart}
          customer={selectedCustomer}
          onCustomerSelect={selectCustomer}
          onCustomerClear={clearCustomer}
          onItemRemove={removeItem}
          onQuantityUpdate={updateQuantity}
          onCheckout={() => setIsCheckoutOpen(true)}
          onClear={clearCart}
          isProcessing={isProcessing}
        />
      </div>

      {isCheckoutOpen && (
        <CheckoutModal
          cart={cart}
          customer={selectedCustomer}
          onClose={() => setIsCheckoutOpen(false)}
          onComplete={handleCheckout}
        />
      )}
    </SalesLayout>
  );
};
```

### ProductBrowser

```typescript
// ui/components/features/products/ProductBrowser/ProductBrowser.tsx
interface ProductBrowserProps {
  products: Product[];
  loading: boolean;
  filters: ProductFilters;
  onSearch: (query: string) => void;
  onFiltersChange: (filters: ProductFilters) => void;
  onProductSelect: (product: Product) => void;
}

export const ProductBrowser: React.FC<ProductBrowserProps> = ({
  products, loading, filters, onSearch, onFiltersChange, onProductSelect,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleSearch = useCallback(debounce(onSearch, 300), [onSearch]);

  return (
    <div className="product-browser">
      <SearchInput
        id="product-search"
        placeholder="Buscar por nombre o SKU..."
        onChange={handleSearch}
        autoFocus
      />
      <CategoryTabs onCategorySelect={(id) => onFiltersChange({ ...filters, categoryId: id })} />
      <ViewToggle mode={viewMode} onModeChange={setViewMode} />

      {loading ? (
        <ProductGridSkeleton />
      ) : (
        <ProductGrid products={products} viewMode={viewMode} onProductSelect={onProductSelect} />
      )}
    </div>
  );
};
```

### ProductCard

```typescript
// ui/components/features/products/ProductCard/ProductCard.tsx

// Product es una interfaz pura — las validaciones van en funciones auxiliares
function isProductAvailable(p: Product): boolean {
  return p.isActive && p.stock > 0;
}

function getStockStatus(stock: number, minStock: number): 'ok' | 'low' | 'out' {
  if (stock === 0) return 'out';
  if (stock <= minStock) return 'low';
  return 'ok';
}

interface ProductCardProps {
  product: Product;
  compact?: boolean;
  onSelect: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, compact = false, onSelect }) => {
  const available = isProductAvailable(product);
  const stockStatus = getStockStatus(product.stock, product.minStock);

  return (
    <div
      className={cn('product-card', `product-card--stock-${stockStatus}`, { 'product-card--compact': compact })}
      onClick={onSelect}
    >
      <ProductImage src={product.imageUrl} alt={product.name} size={compact ? 'small' : 'medium'} />
      {product.stock === 0 && <div className="product-card__overlay">Sin stock</div>}

      <h3>{product.name}</h3>
      <span className="sku">{product.sku}</span>
      <span className="price">${product.price.toFixed(2)}</span>
      <StockIndicator stock={product.stock} minStock={product.minStock} />

      <Button
        variant="primary"
        size={compact ? 'sm' : 'md'}
        disabled={!available}
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
      >
        {available ? 'Agregar' : 'No disponible'}
      </Button>
    </div>
  );
};
```

### CartPanel

```typescript
// ui/components/features/cart/CartPanel/CartPanel.tsx
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

export const CartPanel: React.FC<CartPanelProps> = ({
  cart, customer, onCustomerSelect, onCustomerClear,
  onItemRemove, onQuantityUpdate, onCheckout, onClear, isProcessing,
}) => {
  const [customerSelectorOpen, setCustomerSelectorOpen] = useState(false);

  return (
    <div className="cart-panel">
      <div className="cart-panel__header">
        <h2>Carrito ({cart.items.length})</h2>
        <Button variant="ghost" size="sm" onClick={() => setCustomerSelectorOpen(true)}>
          {customer ? customer.name : 'Agregar cliente'}
        </Button>
      </div>

      {customer && <CustomerChip customer={customer} onClear={onCustomerClear} />}

      <ScrollArea>
        {cart.items.length === 0
          ? <EmptyState icon="🛒" title="Carrito vacío" description="Agrega productos para comenzar" />
          : cart.items.map(item => (
              <CartItemRow
                key={item.id}
                item={item}
                onRemove={() => onItemRemove(item.id)}
                onQuantityChange={(qty) => onQuantityUpdate(item.id, qty)}
              />
            ))
        }
      </ScrollArea>

      <CartSummary cart={cart} />

      <div className="cart-panel__actions">
        <Button variant="secondary" onClick={() => {/* retener venta */}} disabled={cart.items.length === 0}>
          Retener
        </Button>
        <Button
          variant="primary"
          onClick={onCheckout}
          disabled={cart.items.length === 0 || isProcessing}
          loading={isProcessing}
        >
          Pagar
        </Button>
        <Button variant="ghost" onClick={onClear} disabled={cart.items.length === 0}>
          Limpiar
        </Button>
      </div>

      {customerSelectorOpen && (
        <CustomerSelectorModal
          selectedCustomer={customer}
          onSelect={(c) => { onCustomerSelect(c); setCustomerSelectorOpen(false); }}
          onClose={() => setCustomerSelectorOpen(false)}
        />
      )}
    </div>
  );
};
```

### CartItemRow

```typescript
// ui/components/features/cart/CartItemRow/CartItemRow.tsx
// Nombre distinto a la interfaz CartItem del dominio para evitar conflicto
interface CartItemRowProps {
  item: CartItem;
  onRemove: () => void;
  onQuantityChange: (quantity: number) => void;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({ item, onRemove, onQuantityChange }) => {
  const [editing, setEditing] = useState(false);

  return (
    <div className="cart-item">
      <ProductImage src={item.product.imageUrl} alt={item.product.name} size="small" />

      <div className="cart-item__details">
        <span>{item.product.name}</span>
        <span className="sku">{item.product.sku}</span>
        <span>${item.unitPrice.toFixed(2)} c/u</span>
      </div>

      {editing ? (
        <QuantityInput
          value={item.quantity} min={1} max={item.product.stock}
          onSave={(v) => { onQuantityChange(v); setEditing(false); }}
          onCancel={() => setEditing(false)}
          autoFocus
        />
      ) : (
        <QuantityDisplay
          value={item.quantity} max={item.product.stock}
          onEdit={() => setEditing(true)}
          onIncrement={() => onQuantityChange(item.quantity + 1)}
          onDecrement={() => onQuantityChange(item.quantity - 1)}
        />
      )}

      <span>${item.subtotal.toFixed(2)}</span>
      {item.discount > 0 && <span className="discount">-${item.discount.toFixed(2)}</span>}

      <Button variant="ghost" size="sm" onClick={onRemove} aria-label="Eliminar">✕</Button>
    </div>
  );
};
```

### CheckoutModal

```typescript
// ui/components/features/checkout/CheckoutModal/CheckoutModal.tsx
interface CheckoutModalProps {
  cart: Cart;
  customer?: Customer;
  onClose: () => void;
  // Recibe método y detalles para que SalesPage procese la venta correctamente
  onComplete: (paymentMethod: PaymentMethod, paymentDetails: PaymentDetails) => Promise<void>;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  cart, customer, onClose, onComplete,
}) => {
  const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [details, setDetails] = useState<PaymentDetails | undefined>();
  const [processing, setProcessing] = useState(false);

  const handlePay = async () => {
    if (!details) return;
    setProcessing(true);
    try {
      await onComplete(method, details);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Modal isOpen onClose={onClose} size="large" title="Finalizar Venta">
      <OrderSummary cart={cart} customer={customer} />

      <PaymentMethodSelector
        selectedMethod={method}
        onMethodChange={(m) => { setMethod(m); setDetails(undefined); }}
        totalAmount={cart.total}
        onDetailsChange={setDetails}
      />

      <div className="checkout__actions">
        <Button variant="secondary" onClick={onClose} disabled={processing}>Cancelar</Button>
        <Button variant="primary" onClick={handlePay} disabled={!details || processing} loading={processing}>
          Completar Venta
        </Button>
      </div>
    </Modal>
  );
};
```

### AdminPage

```typescript
// ui/pages/AdminPage/AdminPage.tsx
type AdminTab = 'products' | 'customers' | 'sales' | 'reports';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('products');

  return (
    <AdminLayout>
      <h1>Panel de Administración</h1>
      <TabNavigation
        tabs={[
          { id: 'products',   label: 'Productos', icon: '📦' },
          { id: 'customers',  label: 'Clientes',  icon: '👥' },
          { id: 'sales',      label: 'Ventas',    icon: '🧾' },
          { id: 'reports',    label: 'Reportes',  icon: '📊' },
        ]}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as AdminTab)}
      />

      {activeTab === 'products'  && <ProductManagement />}
      {activeTab === 'customers' && <CustomerManagement />}
      {activeTab === 'sales'     && <SalesManagement />}
      {activeTab === 'reports'   && <ReportsDashboard />}
    </AdminLayout>
  );
};
```

---

## Atajos de Teclado

```typescript
// ui/hooks/useKeyboardShortcuts.ts
export const useKeyboardShortcuts = () => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;

      if (ctrl && e.key === 'k')     { e.preventDefault(); document.getElementById('product-search')?.focus(); }
      if (ctrl && e.key === 'Enter') { e.preventDefault(); /* iniciar checkout */ }
      if (e.key === 'F2')            { e.preventDefault(); /* abrir selector de cliente */ }
      if (e.key === 'F3')            { e.preventDefault(); /* ir a gestión de productos */ }
      if (e.key === 'Escape')        { e.preventDefault(); /* cerrar modal activo */ }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);
};
```

| Atajo | Acción |
|-------|--------|
| `Ctrl+K` | Enfocar búsqueda de productos |
| `Ctrl+Enter` | Iniciar checkout |
| `F2` | Abrir selector de cliente |
| `F3` | Ir a gestión de productos |
| `Escape` | Cerrar modal activo |
| `+` / `-` | Aumentar / disminuir cantidad del item seleccionado |
| `Delete` | Eliminar item seleccionado del carrito |

---

## Responsive Design

```css
/* Desktop (1920×1080) — principal */
.sales-terminal {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
  height: 100vh;
}

/* Tablet (≤1280px) */
@media (max-width: 1280px) {
  .sales-terminal { grid-template-columns: 1fr; grid-template-rows: 1fr 400px; }
  .product-grid   { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); }
}

/* Móvil (≤768px) — soporte básico */
@media (max-width: 768px) {
  .sales-terminal { grid-template-rows: 1fr 300px; }
  .product-grid   { grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); }
  .cart-panel {
    position: fixed; bottom: 0; left: 0; right: 0;
    transform: translateY(calc(100% - 60px));
    transition: transform 0.3s ease;
  }
  .cart-panel.expanded { transform: translateY(0); }
}
```

---

## Flujos de Usuario

### 1. Venta estándar
1. Cajero busca producto (debounce 300ms) → selecciona → se agrega al carrito
2. Opcionalmente asocia cliente (F2)
3. Ajusta cantidades con `+` / `-` o input directo
4. Hace clic en **Pagar** → modal de checkout
5. Selecciona método de pago → completa formulario → **Completar Venta**
6. Sistema genera factura → limpia carrito → vuelve al estado inicial

### 2. Administración
1. Usuario con permisos accede al panel admin
2. Gestiona productos (CRUD), clientes, historial de ventas y reportes
3. Los cambios se reflejan en tiempo real en el terminal POS
