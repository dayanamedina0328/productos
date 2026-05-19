package com.pos.backend.application.service;

import com.pos.backend.application.dto.response.CustomerResponse;
import com.pos.backend.domain.model.Customer;
import org.springframework.stereotype.Component;

@Component
public class CustomerMapper {

    public CustomerResponse toResponse(Customer customer) {
        return new CustomerResponse(
            customer.getId(),
            customer.getName(),
            customer.getNit(),
            customer.getEmail(),
            customer.getPhone(),
            customer.getAddress(),
            customer.getCustomerType(),
            customer.getCreditLimit(),
            customer.isActive(),
            customer.getCreatedAt(),
            customer.getUpdatedAt()
        );
    }
}
