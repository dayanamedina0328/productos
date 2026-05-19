package com.pos.backend.application.port.input.customer;

import com.pos.backend.application.dto.response.CustomerResponse;
import com.pos.backend.application.dto.response.PagedResponse;
import com.pos.backend.domain.model.enums.CustomerType;

public interface GetCustomersUseCase {
    PagedResponse<CustomerResponse> execute(String name, String nit, CustomerType type,
                                            int page, int pageSize);
}
