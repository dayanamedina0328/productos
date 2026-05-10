import type { SaleRepository } from '../../domain/ports/SaleRepository';
import type { CartRepository } from '../../domain/ports/CartRepository';
import type { PaymentGateway } from '../../domain/ports/PaymentGateway';
import type { ProcessSale, ProcessSaleRequest } from '../ports/ProcessSale';
import type { Sale } from '../../domain/entities/Sale';

/**
 * ProcessSaleUseCase
 *
 * Orquesta el proceso de venta:
 * 1. Recupera el carrito activo
 * 2. Procesa el pago a través del gateway
 * 3. Persiste la venta (el repositorio genera la factura y decrementa el stock)
 * 4. Limpia el carrito
 */
export class ProcessSaleUseCase implements ProcessSale {
  constructor(
    private readonly saleRepository: SaleRepository,
    private readonly cartRepository: CartRepository,
    private readonly paymentGateway: PaymentGateway
  ) {}

  async execute(request: ProcessSaleRequest): Promise<Sale> {
    // 1. Verificar que el carrito existe y tiene ítems
    const cart = await this.cartRepository.findById(request.cartId);

    if (cart.items.length === 0) {
      throw new Error('Cannot process a sale with an empty cart');
    }

    // 2. Procesar el pago
    const paymentResult = await this.paymentGateway.process(cart.total, request.paymentDetails);

    if (!paymentResult.success) {
      throw new Error(paymentResult.error ?? 'Payment processing failed');
    }

    // 3. Persistir la venta (el adaptador genera la factura y decrementa el stock)
    const sale = await this.saleRepository.save({
      cartId: request.cartId,
      customerId: request.customerId,
      paymentMethod: request.paymentMethod,
      paymentDetails: request.paymentDetails,
    });

    // 4. Limpiar el carrito tras completar la venta
    await this.cartRepository.clear(request.cartId);

    return sale;
  }
}
