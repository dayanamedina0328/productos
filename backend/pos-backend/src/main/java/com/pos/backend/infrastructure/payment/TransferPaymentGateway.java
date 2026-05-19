package com.pos.backend.infrastructure.payment;

import com.pos.backend.domain.model.enums.PaymentMethod;
import com.pos.backend.domain.port.output.PaymentGateway;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@Component
public class TransferPaymentGateway implements PaymentGateway {

    @Override
    public PaymentResult process(BigDecimal amount, Map<String, Object> details) {
        Object reference = details.get("transferReference");

        if (reference == null || reference.toString().isBlank()) {
            return PaymentResult.failure("transferReference is required for TRANSFER payment");
        }
        if (reference.toString().trim().length() < 6) {
            return PaymentResult.failure("transferReference must be at least 6 characters");
        }

        String transactionId = "TRF-" + reference.toString().toUpperCase() + "-"
                               + UUID.randomUUID().toString().substring(0, 8);
        return PaymentResult.success(transactionId);
    }

    @Override
    public PaymentMethod getSupportedMethod() {
        return PaymentMethod.TRANSFER;
    }
}
