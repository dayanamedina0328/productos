package com.pos.backend.domain.port.output;

import com.pos.backend.domain.model.enums.PaymentMethod;

import java.math.BigDecimal;
import java.util.Map;

/**
 * Puerto de salida: gateway de pagos.
 * Definido en el dominio, implementado en infraestructura.
 */
public interface PaymentGateway {

    PaymentResult process(BigDecimal amount, Map<String, Object> details);

    PaymentMethod getSupportedMethod();

    record PaymentResult(
        boolean success,
        String transactionId,
        String errorMessage,
        Map<String, Object> metadata
    ) {
        public static PaymentResult success(String transactionId) {
            return new PaymentResult(true, transactionId, null, Map.of());
        }

        public static PaymentResult failure(String errorMessage) {
            return new PaymentResult(false, null, errorMessage, Map.of());
        }
    }
}
