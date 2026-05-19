package com.pos.backend.application.port.input.customer;

import com.pos.backend.application.dto.request.UpdateCustomerRequest;
import com.pos.backend.application.dto.response.CustomerResponse;

public interface UpdateCustomerUseCase {
    CustomerResponse execute(String id, UpdateCustomerRequest request);
}
