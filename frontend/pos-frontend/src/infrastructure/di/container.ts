/**
 * container.ts — Contenedor de inyección de dependencias.
 *
 * Este es el ÚNICO lugar donde se usa `new` para instanciar dependencias.
 * Todos los casos de uso reciben sus adaptadores aquí.
 */

// ---------------------------------------------------------------------------
// Adaptadores de infraestructura
// ---------------------------------------------------------------------------

import { ProductAPIAdapter } from '../api/ProductAPIAdapter';
import { SaleAPIAdapter } from '../api/SaleAPIAdapter';
import { CustomerAPIAdapter } from '../api/CustomerAPIAdapter';
import { CartAPIAdapter } from '../api/CartAPIAdapter';
import { CartLocalStorageAdapter } from '../storage/CartLocalStorageAdapter';
import { CashPaymentGateway } from '../payments/CashPaymentGateway';
import { CardPaymentGateway } from '../payments/CardPaymentGateway';
import { TransferPaymentGateway } from '../payments/TransferPaymentGateway';
import { MixedPaymentGateway } from '../payments/MixedPaymentGateway';
import { CacheManager } from '../storage/CacheManager';

// ---------------------------------------------------------------------------
// Casos de uso — Productos
// ---------------------------------------------------------------------------

import { GetProductsUseCase } from '../../application/useCases/GetProductsUseCase';
import { CreateProductUseCase } from '../../application/useCases/CreateProductUseCase';
import { UpdateProductUseCase } from '../../application/useCases/UpdateProductUseCase';
import { DeleteProductUseCase } from '../../application/useCases/DeleteProductUseCase';
import { SearchProductsUseCase } from '../../application/useCases/SearchProductsUseCase';

// ---------------------------------------------------------------------------
// Casos de uso — Carrito
// ---------------------------------------------------------------------------

import { AddProductToCartUseCase } from '../../application/useCases/AddProductToCartUseCase';
import { RemoveFromCartUseCase } from '../../application/useCases/RemoveFromCartUseCase';
import { UpdateCartItemUseCase } from '../../application/useCases/UpdateCartItemUseCase';
import { ClearCartUseCase } from '../../application/useCases/ClearCartUseCase';
import { ApplyDiscountUseCase } from '../../application/useCases/ApplyDiscountUseCase';
import { HoldSaleUseCase } from '../../application/useCases/HoldSaleUseCase';

// ---------------------------------------------------------------------------
// Casos de uso — Ventas
// ---------------------------------------------------------------------------

import { ProcessSaleUseCase } from '../../application/useCases/ProcessSaleUseCase';
import { CancelSaleUseCase } from '../../application/useCases/CancelSaleUseCase';
import { RefundSaleUseCase } from '../../application/useCases/RefundSaleUseCase';
import { GetSalesHistoryUseCase } from '../../application/useCases/GetSalesHistoryUseCase';
import { GenerateInvoiceUseCase } from '../../application/useCases/GenerateInvoiceUseCase';

// ---------------------------------------------------------------------------
// Casos de uso — Clientes
// ---------------------------------------------------------------------------

import { GetCustomersUseCase } from '../../application/useCases/GetCustomersUseCase';
import { CreateCustomerUseCase } from '../../application/useCases/CreateCustomerUseCase';
import { UpdateCustomerUseCase } from '../../application/useCases/UpdateCustomerUseCase';
import { SearchCustomersUseCase } from '../../application/useCases/SearchCustomersUseCase';

// ---------------------------------------------------------------------------
// Instanciación de adaptadores (singletons)
// ---------------------------------------------------------------------------

const productRepository = new ProductAPIAdapter();
const saleRepository = new SaleAPIAdapter();
const customerRepository = new CustomerAPIAdapter();
const cartRepository = new CartAPIAdapter();
const cartLocalStorage = new CartLocalStorageAdapter();
const cashGateway = new CashPaymentGateway();
const cardGateway = new CardPaymentGateway();
const transferGateway = new TransferPaymentGateway();
const mixedGateway = new MixedPaymentGateway();
export const cacheManager = new CacheManager();

// Políticas de caché
cacheManager.registerPolicy('products:', { ttl: 2 * 60 * 1000 });   // 2 min
cacheManager.registerPolicy('customers:', { ttl: 5 * 60 * 1000 });  // 5 min
cacheManager.registerPolicy('sales:', { ttl: 1 * 60 * 1000 });      // 1 min

// ---------------------------------------------------------------------------
// Casos de uso — Productos
// ---------------------------------------------------------------------------

export const getProductsUseCase = new GetProductsUseCase(productRepository);
export const createProductUseCase = new CreateProductUseCase(productRepository);
export const updateProductUseCase = new UpdateProductUseCase(productRepository);
export const deleteProductUseCase = new DeleteProductUseCase(productRepository, saleRepository);
export const searchProductsUseCase = new SearchProductsUseCase(productRepository);

// ---------------------------------------------------------------------------
// Casos de uso — Carrito
// ---------------------------------------------------------------------------

export const addProductToCartUseCase = new AddProductToCartUseCase(cartRepository, productRepository);
export const removeFromCartUseCase = new RemoveFromCartUseCase(cartRepository);
export const updateCartItemUseCase = new UpdateCartItemUseCase(cartRepository, productRepository);
export const clearCartUseCase = new ClearCartUseCase(cartRepository);
export const applyDiscountUseCase = new ApplyDiscountUseCase(cartRepository);
export const holdSaleUseCase = new HoldSaleUseCase(cartLocalStorage);

// ---------------------------------------------------------------------------
// Casos de uso — Ventas
// (ProcessSaleUseCase usa cashGateway por defecto; el gateway real se inyecta
//  desde el componente según el método de pago seleccionado)
// ---------------------------------------------------------------------------

export const processSaleUseCase = new ProcessSaleUseCase(saleRepository, cartRepository, cashGateway);
export const cancelSaleUseCase = new CancelSaleUseCase(saleRepository);
export const refundSaleUseCase = new RefundSaleUseCase(saleRepository);
export const getSalesHistoryUseCase = new GetSalesHistoryUseCase(saleRepository);
export const generateInvoiceUseCase = new GenerateInvoiceUseCase(saleRepository);

// ---------------------------------------------------------------------------
// Casos de uso — Clientes
// ---------------------------------------------------------------------------

export const getCustomersUseCase = new GetCustomersUseCase(customerRepository);
export const createCustomerUseCase = new CreateCustomerUseCase(customerRepository);
export const updateCustomerUseCase = new UpdateCustomerUseCase(customerRepository);
export const searchCustomersUseCase = new SearchCustomersUseCase(customerRepository);

// ---------------------------------------------------------------------------
// Fábricas para gateways de pago (permiten inyectar el gateway correcto)
// ---------------------------------------------------------------------------

export const paymentGateways = {
  cash: cashGateway,
  card: cardGateway,
  transfer: transferGateway,
  mixed: mixedGateway,
} as const;
