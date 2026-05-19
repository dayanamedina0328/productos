package com.pos.backend.application.port.input.customer;

import com.pos.backend.application.dto.response.CustomerResponse;

public interface GetCustomerByIdUseCase {
    CustomerResponse execute(String id);
}
