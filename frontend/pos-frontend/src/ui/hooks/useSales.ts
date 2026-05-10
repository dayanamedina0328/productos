import { useState, useCallback } from 'react';
import type { Sale, PaymentMethod, PaymentDetails } from '../../domain/entities/Sale';
import { paymentGateways } from '../../infrastructure/di/container';
import { ProcessSaleUseCase } from '../../application/useCases/ProcessSaleUseCase';
import { SaleAPIAdapter } from '../../infrastructure/api/SaleAPIAdapter';
import { CartAPIAdapter } from '../../infrastructure/api/CartAPIAdapter';

interface UseSalesState {
  lastSale: Sale | null;
  isProcessing: boolean;
  error: string | null;
}

/**
 * useSales — conecta con ProcessSaleUseCase.
 * Selecciona el gateway de pago correcto según el método elegido.
 * Expone: processSale, isProcessing, lastSale, error.
 */
export function useSales() {
  const [state, setState] = useState<UseSalesState>({
    lastSale: null,
    isProcessing: false,
    error: null,
  });

  const processSale = useCallback(
    async (
      cartId: string,
      paymentMethod: PaymentMethod,
      paymentDetails: PaymentDetails,
      customerId?: string
    ): Promise<Sale> => {
      setState({ lastSale: null, isProcessing: true, error: null });

      try {
        // Seleccionar el gateway correcto según el método de pago
        const gateway =
          paymentGateways[paymentMethod as keyof typeof paymentGateways] ??
          paymentGateways.cash;

        // Instanciar el caso de uso con el gateway correcto para este pago
        const useCase = new ProcessSaleUseCase(
          new SaleAPIAdapter(),
          new CartAPIAdapter(),
          gateway
        );

        const sale = await useCase.execute({
          cartId,
          customerId,
          paymentMethod,
          paymentDetails,
        });

        setState({ lastSale: sale, isProcessing: false, error: null });
        return sale;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al procesar la venta';
        setState((prev) => ({ ...prev, isProcessing: false, error: message }));
        throw err;
      }
    },
    []
  );

  return {
    processSale,
    isProcessing: state.isProcessing,
    lastSale: state.lastSale,
    error: state.error,
  };
}
