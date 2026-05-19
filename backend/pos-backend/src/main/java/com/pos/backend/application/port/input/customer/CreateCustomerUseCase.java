package com.pos.backend.application.port.input.customer;

import com.pos.backend.application.dto.request.CreateCustomerRequest;
import com.pos.backend.application.dto.response.CustomerResponse;

public interface CreateCustomerUseCase {
    CustomerResponse execute(CreateCustomerRequest request);
}
