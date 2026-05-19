import { useState, useRef, useCallback } from 'react';
import type { Product } from '../../../domain/entities/Product';
import type { PaymentMethod, PaymentDetails } from '../../../domain/entities/Sale';
import { useCart } from '../../hooks/useCart';
import { useCustomers } from '../../hooks/useCustomers';
import { useSales } from '../../hooks/useSales';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { SalesLayout } from '../../components/base/SalesLayout';
import { ProductBrowser } from '../../components/features/ProductBrowser';
import { CartPanel } from '../../components/features/CartPanel';
import { CheckoutModal } from '../../components/features/CheckoutModal';
import { CustomerSelectorModal } from '../../components/features/CustomerSelectorModal';
import { AppNotificationContainer } from '../../components/base/AppNotification';
import type { AppNotificationItem } from '../../components/base/AppNotification';

/**
 * SalesPage — terminal de ventas principal.
 * Orquesta ProductBrowser, CartPanel y CheckoutModal.
 * handleCheckout(paymentMethod, paymentDetails) recibe ambos parámetros (tarea 6.1).
 */
const SalesPage = () => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCustomerOpen, setIsCustomerOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotificationItem[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { cart, loading: cartLoading, addItem, removeItem, updateQuantity, clearCart, holdSale } = useCart();
  const { selectedCustomer, selectCustomer, clearCustomer } = useCustomers();
  const { processSale, isProcessing } = useSales();

  const notify = useCallback((item: Omit<AppNotificationItem, 'id'>) => {
    const id = `notif-${Date.now()}`;
    setNotifications((prev) => [...prev, { ...item, id }]);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Agregar producto al carrito
  const handleAddToCart = useCallback(
    async (product: Product) => {
      try {
        const updatedCart = await addItem(product.id, 1, cart?.id);
        notify({
          type: 'success',
          title: 'Producto agregado',
          message: `${product.name} se agregó al carrito`,
        });
      } catch (err) {
        notify({
          type: 'error',
          title: 'No se pudo agregar',
          message: err instanceof Error ? err.message : 'Error desconocido',
        });
      }
    },
    [addItem, cart?.id, notify]
  );

  // Cambiar cantidad de un ítem
  const handleQuantityChange = useCallback(
    async (itemId: string, quantity: number) => {
      if (!cart) return;
      try {
        await updateQuantity(cart.id, itemId, quantity);
      } catch (err) {
        notify({ type: 'error', title: 'Error al actualizar cantidad', message: err instanceof Error ? err.message : '' });
      }
    },
    [cart, updateQuantity, notify]
  );

  // Eliminar ítem del carrito
  const handleRemoveItem = useCallback(
    async (itemId: string) => {
      if (!cart) return;
      try {
        await removeItem(cart.id, itemId);
      } catch (err) {
        notify({ type: 'error', title: 'Error al eliminar ítem', message: err instanceof Error ? err.message : '' });
      }
    },
    [cart, removeItem, notify]
  );

  // Vaciar carrito
  const handleClearCart = useCallback(async () => {
    if (!cart) return;
    try {
      await clearCart(cart.id);
    } catch (err) {
      notify({ type: 'error', title: 'Error al vaciar carrito', message: err instanceof Error ? err.message : '' });
    }
  }, [cart, clearCart, notify]);

  // Poner en espera
  const handleHold = useCallback(async () => {
    if (!cart) return;
    try {
      await holdSale(cart.id);
      notify({ type: 'info', title: 'Venta en espera', message: 'Puedes retomarla más tarde' });
    } catch (err) {
      notify({ type: 'error', title: 'Error al poner en espera', message: err instanceof Error ? err.message : '' });
    }
  }, [cart, holdSale, notify]);

  /**
   * handleCheckout — procesa la venta con método y detalles de pago.
   * Ambos parámetros son requeridos (tarea 6.1).
   */
  const handleCheckout = useCallback(
    async (paymentMethod: PaymentMethod, paymentDetails: PaymentDetails) => {
      if (!cart) return;
      try {
        await processSale(cart.id, paymentMethod, paymentDetails, selectedCustomer?.id);
        setIsCheckoutOpen(false);
        notify({ type: 'success', title: 'Venta completada', message: 'La venta se procesó correctamente' });
      } catch (err) {
        notify({ type: 'error', title: 'Error al procesar pago', message: err instanceof Error ? err.message : '' });
      }
    },
    [cart, processSale, selectedCustomer?.id, notify]
  );

  // Atajos de teclado
  useKeyboardShortcuts({
    onSearch: () => searchInputRef.current?.focus(),
    onFocusSearch: () => searchInputRef.current?.focus(),
    onCheckout: () => {
      console.log('onCheckout called', { cart, hasItems: cart?.items.length });
      if (cart && cart.items.length > 0) {
        setIsCheckoutOpen(true);
      } else {
        notify({ type: 'error', title: 'Carrito vacío', message: 'Agrega productos antes de cobrar' });
      }
    },
    onPay: () => {
      console.log('onPay called (F5)', { cart, hasItems: cart?.items.length });
      if (cart && cart.items.length > 0) {
        setIsCheckoutOpen(true);
      } else {
        notify({ type: 'error', title: 'Carrito vacío', message: 'Agrega productos antes de cobrar' });
      }
    },
    onOpenCustomer: () => setIsCustomerOpen(true),
    onEscape: () => {
      setIsCheckoutOpen(false);
      setIsCustomerOpen(false);
    },
  });

  return (
    <>
      <SalesLayout
        productBrowser={
          <ProductBrowser
            onAddToCart={(p) => void handleAddToCart(p)}
            searchInputRef={searchInputRef}
          />
        }
        cartPanel={
          <CartPanel
            cart={cart}
            selectedCustomer={selectedCustomer}
            onCustomerSelect={() => setIsCustomerOpen(true)}
            onCustomerClear={clearCustomer}
            onQuantityChange={(itemId, qty) => void handleQuantityChange(itemId, qty)}
            onRemoveItem={(itemId) => void handleRemoveItem(itemId)}
            onCheckout={() => setIsCheckoutOpen(true)}
            onHold={() => void handleHold()}
            onClear={() => void handleClearCart()}
            loading={cartLoading}
          />
        }
      />

      {/* Modal de checkout */}
      {cart && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          cart={cart}
          customer={selectedCustomer}
          onComplete={(method, details) => void handleCheckout(method, details)}
          isProcessing={isProcessing}
        />
      )}

      {/* Modal de selección de cliente */}
      <CustomerSelectorModal
        isOpen={isCustomerOpen}
        onClose={() => setIsCustomerOpen(false)}
        onSelect={selectCustomer}
      />

      {/* Notificaciones */}
      <AppNotificationContainer
        notifications={notifications}
        onClose={dismissNotification}
      />
    </>
  );
};

export default SalesPage;
