package com.pos.backend.domain.model;

import com.pos.backend.domain.exception.InvalidSaleStatusForCancellationException;
import com.pos.backend.domain.exception.SaleAlreadyCancelledException;
import com.pos.backend.domain.model.enums.PaymentMethod;
import com.pos.backend.domain.model.enums.SaleStatus;
import com.pos.backend.domain.model.valueobject.InvoiceNumber;
import com.pos.backend.domain.model.valueobject.Money;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;

/**
 * Entidad de dominio: Venta.
 * Sin anotaciones de Spring/JPA.
 */
public class Sale {

    private static final BigDecimal IVA_RATE = new BigDecimal("0.19");

    private final String id;
    private final InvoiceNumber invoiceNumber;
    private final String customerId;
    private final String createdBy;
    private final List<SaleItem> items;
    private final BigDecimal subtotal;
    private final BigDecimal tax;
    private final BigDecimal discount;
    private final BigDecimal total;
    private final PaymentMethod paymentMethod;
    private final Map<String, Object> paymentDetails;
    private SaleStatus status;
    private final LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Sale(String id, InvoiceNumber invoiceNumber, String customerId, String createdBy,
                 List<SaleItem> items, BigDecimal subtotal, BigDecimal tax, BigDecimal discount,
                 BigDecimal total, PaymentMethod paymentMethod, Map<String, Object> paymentDetails,
                 SaleStatus status, LocalDateTime createdAt) {
        this.id = Objects.requireNonNull(id);
        this.invoiceNumber = Objects.requireNonNull(invoiceNumber);
        this.customerId = customerId;
        this.createdBy = Objects.requireNonNull(createdBy);
        this.items = Collections.unmodifiableList(new ArrayList<>(items));
        this.subtotal = subtotal;
        this.tax = tax;
        this.discount = discount != null ? discount : BigDecimal.ZERO;
        this.total = total;
        this.paymentMethod = Objects.requireNonNull(paymentMethod);
        this.paymentDetails = paymentDetails != null ? paymentDetails : new HashMap<>();
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = createdAt;
    }

    /**
     * Factory method: crea una venta desde un carrito.
     */
    public static Sale from(String id, Cart cart, String createdBy, InvoiceNumber invoiceNumber,
                            PaymentMethod paymentMethod, Map<String, Object> paymentDetails,
                            List<SaleItem> saleItems) {
        Objects.requireNonNull(cart, "Cart cannot be null");
        if (cart.isEmpty()) throw new IllegalArgumentException("Cannot create sale from empty cart");

        BigDecimal subtotal = saleItems.stream()
                                       .map(SaleItem::getSubtotal)
                                       .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal tax = subtotal.multiply(IVA_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal total = subtotal.add(tax);

        return new Sale(id, invoiceNumber, cart.getCustomerId(), createdBy,
                        saleItems, subtotal, tax, BigDecimal.ZERO, total,
                        paymentMethod, paymentDetails, SaleStatus.COMPLETED, LocalDateTime.now());
    }

    /** Reconstruye desde persistencia */
    public static Sale reconstitute(String id, String invoiceNumber, String customerId,
                                    String createdBy, List<SaleItem> items, BigDecimal subtotal,
                                    BigDecimal tax, BigDecimal discount, BigDecimal total,
                                    PaymentMethod paymentMethod, Map<String, Object> paymentDetails,
                                    SaleStatus status, LocalDateTime createdAt, LocalDateTime updatedAt) {
        Sale sale = new Sale(id, new InvoiceNumber(invoiceNumber), customerId, createdBy,
                             items, subtotal, tax, discount, total, paymentMethod, paymentDetails,
                             status, createdAt);
        sale.updatedAt = updatedAt;
        return sale;
    }

    /**
     * Cancela la venta. Solo se pueden cancelar ventas COMPLETED.
     */
    public void cancel() {
        if (status == SaleStatus.CANCELLED) {
            throw new SaleAlreadyCancelledException(id);
        }
        if (status != SaleStatus.COMPLETED) {
            throw new InvalidSaleStatusForCancellationException(id, status);
        }
        this.status = SaleStatus.CANCELLED;
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Retorna los ítems para revertir el stock al cancelar.
     */
    public List<SaleItem> getStockReversals() {
        return items;
    }

    // Getters
    public String getId() { return id; }
    public String getInvoiceNumber() { return invoiceNumber.value(); }
    public String getCustomerId() { return customerId; }
    public String getCreatedBy() { return createdBy; }
    public List<SaleItem> getItems() { return items; }
    public BigDecimal getSubtotal() { return subtotal; }
    public BigDecimal getTax() { return tax; }
    public BigDecimal getDiscount() { return discount; }
    public BigDecimal getTotal() { return total; }
    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public Map<String, Object> getPaymentDetails() { return paymentDetails; }
    public SaleStatus getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
