package com.pos.backend.infrastructure.web.controller;

import com.pos.backend.application.dto.request.ProcessSaleRequest;
import com.pos.backend.application.dto.response.PagedResponse;
import com.pos.backend.application.dto.response.SaleResponse;
import com.pos.backend.application.port.input.sale.*;
import com.pos.backend.domain.model.enums.PaymentMethod;
import com.pos.backend.domain.model.enums.SaleStatus;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/sales")
@Tag(name = "Sales", description = "Sales processing and history")
@SecurityRequirement(name = "bearer-jwt")
public class SaleController {

    private final ProcessSaleUseCase processSaleUseCase;
    private final CancelSaleUseCase cancelSaleUseCase;
    private final GetSalesHistoryUseCase getSalesHistoryUseCase;
    private final GetSaleByIdUseCase getSaleByIdUseCase;

    public SaleController(ProcessSaleUseCase processSaleUseCase,
                          CancelSaleUseCase cancelSaleUseCase,
                          GetSalesHistoryUseCase getSalesHistoryUseCase,
                          GetSaleByIdUseCase getSaleByIdUseCase) {
        this.processSaleUseCase = processSaleUseCase;
        this.cancelSaleUseCase = cancelSaleUseCase;
        this.getSalesHistoryUseCase = getSalesHistoryUseCase;
        this.getSaleByIdUseCase = getSaleByIdUseCase;
    }

    @PostMapping
    @Operation(summary = "Process a sale from a cart")
    public ResponseEntity<SaleResponse> processSale(@Valid @RequestBody ProcessSaleRequest request,
                                                     Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(processSaleUseCase.execute(request, auth.getName()));
    }

    @GetMapping
    @Operation(summary = "Get sales history")
    public ResponseEntity<PagedResponse<SaleResponse>> getSalesHistory(
        @RequestParam(required = false) String customerId,
        @RequestParam(required = false) SaleStatus status,
        @RequestParam(required = false) PaymentMethod paymentMethod,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int pageSize,
        Authentication auth
    ) {
        boolean isAdmin = auth.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .anyMatch(a -> a.equals("ROLE_ADMIN"));

        return ResponseEntity.ok(getSalesHistoryUseCase.execute(
            customerId, status, paymentMethod, fromDate, toDate,
            auth.getName(), isAdmin, page, pageSize));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get sale by ID")
    public ResponseEntity<SaleResponse> getSaleById(@PathVariable String id) {
        return ResponseEntity.ok(getSaleByIdUseCase.execute(id));
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Cancel a sale (ADMIN only)")
    public ResponseEntity<SaleResponse> cancelSale(@PathVariable String id) {
        return ResponseEntity.ok(cancelSaleUseCase.execute(id));
    }
}
