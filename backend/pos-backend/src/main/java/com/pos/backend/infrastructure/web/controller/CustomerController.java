package com.pos.backend.infrastructure.web.controller;

import com.pos.backend.application.dto.request.CreateCustomerRequest;
import com.pos.backend.application.dto.request.UpdateCustomerRequest;
import com.pos.backend.application.dto.response.CustomerResponse;
import com.pos.backend.application.dto.response.PagedResponse;
import com.pos.backend.application.port.input.customer.*;
import com.pos.backend.domain.model.enums.CustomerType;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/customers")
@Tag(name = "Customers", description = "Customer management")
@SecurityRequirement(name = "bearer-jwt")
public class CustomerController {

    private final GetCustomersUseCase getCustomersUseCase;
    private final GetCustomerByIdUseCase getCustomerByIdUseCase;
    private final CreateCustomerUseCase createCustomerUseCase;
    private final UpdateCustomerUseCase updateCustomerUseCase;

    public CustomerController(GetCustomersUseCase getCustomersUseCase,
                              GetCustomerByIdUseCase getCustomerByIdUseCase,
                              CreateCustomerUseCase createCustomerUseCase,
                              UpdateCustomerUseCase updateCustomerUseCase) {
        this.getCustomersUseCase = getCustomersUseCase;
        this.getCustomerByIdUseCase = getCustomerByIdUseCase;
        this.createCustomerUseCase = createCustomerUseCase;
        this.updateCustomerUseCase = updateCustomerUseCase;
    }

    @GetMapping
    @Operation(summary = "Get all customers")
    public ResponseEntity<PagedResponse<CustomerResponse>> getCustomers(
        @RequestParam(required = false) String name,
        @RequestParam(required = false) String nit,
        @RequestParam(required = false) CustomerType type,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int pageSize
    ) {
        return ResponseEntity.ok(getCustomersUseCase.execute(name, nit, type, page, pageSize));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get customer by ID")
    public ResponseEntity<CustomerResponse> getCustomerById(@PathVariable String id) {
        return ResponseEntity.ok(getCustomerByIdUseCase.execute(id));
    }

    @PostMapping
    @Operation(summary = "Create a new customer")
    public ResponseEntity<CustomerResponse> createCustomer(@Valid @RequestBody CreateCustomerRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(createCustomerUseCase.execute(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a customer")
    public ResponseEntity<CustomerResponse> updateCustomer(@PathVariable String id,
                                                            @Valid @RequestBody UpdateCustomerRequest request) {
        return ResponseEntity.ok(updateCustomerUseCase.execute(id, request));
    }
}
