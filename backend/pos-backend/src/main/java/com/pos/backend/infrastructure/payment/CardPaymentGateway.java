package com.pos.backend.infrastructure.payment;

import com.pos.backend.domain.model.enums.PaymentMethod;
import com.pos.backend.domain.port.output.PaymentGateway;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@Component
public class CardPaymentGateway implements PaymentGateway {

    @Override
    public PaymentResult process(BigDecimal amount, Map<String, Object> details) {
        Object lastFour = details.get("lastFourDigits");
        Object authCode = details.get("authorizationCode");

        if (lastFour == null || lastFour.toString().isBlank()) {
            return PaymentResult.failure("lastFourDigits is required for CARD payment");
        }
        if (!lastFour.toString().matches("\\d{4}")) {
            return PaymentResult.failure("lastFourDigits must be exactly 4 digits");
        }
        if (authCode == null || authCode.toString().isBlank()) {
            return PaymentResult.failure("authorizationCode is required for CARD payment");
        }

        String transactionId = "CARD-" + lastFour + "-" + UUID.randomUUID().toString().substring(0, 8);
        return PaymentResult.success(transactionId);
    }

    @Override
    public PaymentMethod getSupportedMethod() {
        return PaymentMethod.CARD;
    }
}
