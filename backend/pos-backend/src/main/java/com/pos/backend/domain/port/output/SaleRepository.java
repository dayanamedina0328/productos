package com.pos.backend.domain.port.output;

import com.pos.backend.domain.model.Sale;
import com.pos.backend.domain.model.enums.PaymentMethod;
import com.pos.backend.domain.model.enums.SaleStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Puerto de salida: repositorio de ventas.
 */
public interface SaleRepository {

    Optional<Sale> findById(String id);

    Optional<Sale> findByInvoiceNumber(String invoiceNumber);

    List<Sale> findAll(SaleFilter filter, int page, int pageSize);

    long countAll(SaleFilter filter);

    Sale save(Sale sale);

    /** Genera el siguiente número de secuencia para la fecha actual (atómico) */
    long getNextInvoiceSequence(java.time.LocalDate date);

    record SaleFilter(
        String customerId,
        String createdBy,
        SaleStatus status,
        PaymentMethod paymentMethod,
        LocalDateTime fromDate,
        LocalDateTime toDate
    ) {
        public static SaleFilter empty() {
            return new SaleFilter(null, null, null, null, null, null);
        }
    }
}
