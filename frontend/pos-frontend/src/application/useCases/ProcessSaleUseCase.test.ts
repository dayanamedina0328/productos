import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProcessSaleUseCase } from './ProcessSaleUseCase';
import type { SaleRepository } from '../../domain/ports/SaleRepository';
import type { CartRepository } from '../../domain/ports/CartRepository';
import type { PaymentGateway } from '../../domain/ports/PaymentGateway';
import type { Cart } from '../../domain/entities/Cart';
import type { Sale } from '../../domain/entities/Sale';
import { PaymentMethod, SaleStatus } from '../../domain/entities/Sale';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeCart(overrides: Partial<Cart> = {}): Cart {
  return {
    id: 'cart-1',
    items: [
      {
        id: 'item-1',
        product: {
          id: 'prod-1',
          sku: 'SKU-001',
          name: 'Producto A',
          description: 'Desc',
          price: 100,
          cost: 50,
          stock: 10,
          minStock: 2,
          category: { id: 'cat-1', name: 'Cat', level: 1, isActive: true },
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        quantity: 2,
        unitPrice: 100,
        discount: 0,
        subtotal: 200,
      },
    ],
    subtotal: 200,
    tax: 38,
    discount: 0,
    total: 238,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

function makeSale(): Sale {
  return {
    id: 'sale-1',
    invoiceNumber: 'INV-001',
    items: [],
    subtotal: 200,
    tax: 38,
    discount: 0,
    total: 238,
    paymentMethod: PaymentMethod.CASH,
    paymentDetails: { cashReceived: 250 },
    status: SaleStatus.COMPLETED,
    createdAt: new Date(),
    createdBy: 'user-1',
  };
}

function makeRepos(cart: Cart, sale: Sale) {
  const saleRepository: SaleRepository = {
    findAll: vi.fn(),
    findById: vi.fn(),
    save: vi.fn().mockResolvedValue(sale),
    cancel: vi.fn(),
  };

  const cartRepository: CartRepository = {
    findById: vi.fn().mockResolvedValue(cart),
    save: vi.fn(),
    addItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn().mockResolvedValue(undefined),
  };

  const paymentGateway: PaymentGateway = {
    process: vi.fn().mockResolvedValue({ success: true, transactionId: 'txn-1' }),
  };

  return { saleRepository, cartRepository, paymentGateway };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('ProcessSaleUseCase', () => {
  let cart: Cart;
  let sale: Sale;

  beforeEach(() => {
    cart = makeCart();
    sale = makeSale();
  });

  it('retorna la venta completada', async () => {
    const { saleRepository, cartRepository, paymentGateway } = makeRepos(cart, sale);
    const useCase = new ProcessSaleUseCase(saleRepository, cartRepository, paymentGateway);

    const result = await useCase.execute({
      cartId: 'cart-1',
      paymentMethod: PaymentMethod.CASH,
      paymentDetails: { cashReceived: 250 },
    });

    expect(result).toEqual(sale);
  });

  it('lanza error si el carrito está vacío', async () => {
    const emptyCart = makeCart({ items: [] });
    const { saleRepository, cartRepository, paymentGateway } = makeRepos(emptyCart, sale);
    const useCase = new ProcessSaleUseCase(saleRepository, cartRepository, paymentGateway);

    await expect(
      useCase.execute({
        cartId: 'cart-1',
        paymentMethod: PaymentMethod.CASH,
        paymentDetails: { cashReceived: 0 },
      })
    ).rejects.toThrow('Cannot process a sale with an empty cart');
  });

  it('lanza error si el pago falla', async () => {
    const { saleRepository, cartRepository, paymentGateway } = makeRepos(cart, sale);
    (paymentGateway.process as ReturnType<typeof vi.fn>).mockResolvedValue({
      success: false,
      error: 'Tarjeta rechazada',
    });
    const useCase = new ProcessSaleUseCase(saleRepository, cartRepository, paymentGateway);

    await expect(
      useCase.execute({
        cartId: 'cart-1',
        paymentMethod: PaymentMethod.CARD,
        paymentDetails: {},
      })
    ).rejects.toThrow('Tarjeta rechazada');
  });

  it('limpia el carrito después de procesar la venta', async () => {
    const { saleRepository, cartRepository, paymentGateway } = makeRepos(cart, sale);
    const useCase = new ProcessSaleUseCase(saleRepository, cartRepository, paymentGateway);

    await useCase.execute({
      cartId: 'cart-1',
      paymentMethod: PaymentMethod.CASH,
      paymentDetails: { cashReceived: 250 },
    });

    expect(cartRepository.clear).toHaveBeenCalledWith('cart-1');
  });

  it('pasa el customerId al repositorio de ventas si se proporciona', async () => {
    const { saleRepository, cartRepository, paymentGateway } = makeRepos(cart, sale);
    const useCase = new ProcessSaleUseCase(saleRepository, cartRepository, paymentGateway);

    await useCase.execute({
      cartId: 'cart-1',
      customerId: 'customer-99',
      paymentMethod: PaymentMethod.CASH,
      paymentDetails: { cashReceived: 250 },
    });

    expect(saleRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ customerId: 'customer-99' })
    );
  });

  it('procesa el pago con el total del carrito', async () => {
    const { saleRepository, cartRepository, paymentGateway } = makeRepos(cart, sale);
    const useCase = new ProcessSaleUseCase(saleRepository, cartRepository, paymentGateway);

    await useCase.execute({
      cartId: 'cart-1',
      paymentMethod: PaymentMethod.CASH,
      paymentDetails: { cashReceived: 250 },
    });

    expect(paymentGateway.process).toHaveBeenCalledWith(238, { cashReceived: 250 });
  });
});
