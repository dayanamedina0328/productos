package com.pos.backend.application.service;

import com.pos.backend.application.dto.request.ProcessSaleRequest;
import com.pos.backend.application.dto.response.PagedResponse;
import com.pos.backend.application.dto.response.SaleResponse;
import com.pos.backend.application.port.input.sale.*;
import com.pos.backend.domain.exception.CartNotFoundException;
import com.pos.backend.domain.exception.PaymentFailedException;
import com.pos.backend.domain.exception.ProductNotFoundException;
import com.pos.backend.domain.exception.SaleNotFoundException;
import com.pos.backend.domain.model.*;
import com.pos.backend.domain.model.enums.PaymentMethod;
import com.pos.backend.domain.model.enums.SaleStatus;
import com.pos.backend.domain.model.valueobject.InvoiceNumber;
import com.pos.backend.domain.port.output.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Transactional
public class SaleService implements ProcessSaleUseCase, GetSalesHistoryUseCase {

    private final SaleRepository saleRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final Map<PaymentMethod, PaymentGateway> paymentGateways;
    private final SaleMapper saleMapper;

    public SaleService(SaleRepository saleRepository,
                       CartRepository cartRepository,
                       ProductRepository productRepository,
                       List<PaymentGateway> gateways,
                       SaleMapper saleMapper) {
        this.saleRepository = saleRepository;
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.saleMapper = saleMapper;
        this.paymentGateways = new EnumMap<>(PaymentMethod.class);
        gateways.forEach(g -> paymentGateways.put(g.getSupportedMethod(), g));
    }

    @Override
    public SaleResponse execute(ProcessSaleRequest request, String createdBy) {
        Cart cart = cartRepository.findById(request.cartId())
            .orElseThrow(() -> new CartNotFoundException(request.cartId()));

        if (cart.isEmpty()) {
            throw new IllegalArgumentException("Cannot process sale from empty cart");
        }

        // 1. Validar stock de TODOS los ítems antes de modificar nada
        for (CartItem item : cart.getItems()) {
            Product product = productRepository.findById(item.getProductId())
                .orElseThrow(() -> new ProductNotFoundException(item.getProductId()));
            if (product.getStock() < item.getQuantity()) {
                throw new com.pos.backend.domain.exception.InsufficientStockException(
                    product.getId(), product.getName(), item.getQuantity(), product.getStock());
            }
        }

        // 2. Procesar pago
        PaymentGateway gateway = paymentGateways.get(request.paymentMethod());
        if (gateway == null) {
            throw new PaymentFailedException("Unsupported payment method: " + request.paymentMethod());
        }

        Map<String, Object> details = request.paymentDetails() != null ? request.paymentDetails() : Map.of();
        PaymentGateway.PaymentResult paymentResult = gateway.process(cart.getTotal().amount(), details);

        if (!paymentResult.success()) {
            throw new PaymentFailedException(paymentResult.errorMessage());
        }

        // 3. Descontar stock atómicamente
        for (CartItem item : cart.getItems()) {
            Product product = productRepository.findById(item.getProductId()).orElseThrow();
            product.decreaseStock(item.getQuantity());
            productRepository.save(product);
        }

        // 4. Generar número de factura
        long sequence = saleRepository.getNextInvoiceSequence(LocalDate.now());
        InvoiceNumber invoiceNumber = InvoiceNumber.generate(LocalDate.now(), sequence);

        // 5. Crear ítems de venta
        List<SaleItem> saleItems = cart.getItems().stream()
            .map(item -> SaleItem.fromCartItem(UUID.randomUUID().toString(), item))
            .toList();

        // 6. Crear y persistir la venta
        Sale sale = Sale.from(UUID.randomUUID().toString(), cart, createdBy,
                              invoiceNumber, request.paymentMethod(), details, saleItems);
        Sale saved = saleRepository.save(sale);

        // 7. Limpiar el carrito
        cartRepository.deleteById(cart.getId());

        return saleMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<SaleResponse> execute(String customerId, SaleStatus status,
                                                PaymentMethod paymentMethod, LocalDateTime fromDate,
                                                LocalDateTime toDate, String currentUserId,
                                                boolean isAdmin, int page, int pageSize) {
        int effectivePage = Math.max(page, 0);
        int effectiveSize = Math.min(Math.max(pageSize, 1), 100);

        String filterCreatedBy = isAdmin ? null : currentUserId;
        var filter = new SaleRepository.SaleFilter(customerId, filterCreatedBy, status,
                                                    paymentMethod, fromDate, toDate);
        List<Sale> sales = saleRepository.findAll(filter, effectivePage, effectiveSize);
        long total = saleRepository.countAll(filter);

        List<SaleResponse> responses = sales.stream().map(saleMapper::toResponse).toList();
        return PagedResponse.of(responses, effectivePage, effectiveSize, total);
    }
}
