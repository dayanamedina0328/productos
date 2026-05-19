package com.pos.backend.infrastructure.payment;

import com.pos.backend.domain.model.enums.PaymentMethod;
import com.pos.backend.domain.port.output.PaymentGateway;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@Component
public class CashPaymentGateway implements PaymentGateway {

    @Override
    public PaymentResult process(BigDecimal amount, Map<String, Object> details) {
        Object cashReceivedObj = details.get("cashReceived");
        if (cashReceivedObj == null) {
            return PaymentResult.failure("cashReceived is required for CASH payment");
        }

        BigDecimal cashReceived;
        try {
            cashReceived = new BigDecimal(cashReceivedObj.toString());
        } catch (NumberFormatException e) {
            return PaymentResult.failure("Invalid cashReceived value: " + cashReceivedObj);
        }

        if (cashReceived.compareTo(amount) < 0) {
            return PaymentResult.failure(
                String.format("Insufficient cash. Required: %.2f, Received: %.2f", amount, cashReceived));
        }

        BigDecimal change = cashReceived.subtract(amount);
        return new PaymentResult(true, "CASH-" + UUID.randomUUID().toString().substring(0, 8),
                                 null, Map.of("change", change));
    }

    @Override
    public PaymentMethod getSupportedMethod() {
        return PaymentMethod.CASH;
    }
}
