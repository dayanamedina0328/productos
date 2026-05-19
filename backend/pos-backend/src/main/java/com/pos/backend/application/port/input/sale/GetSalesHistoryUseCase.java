package com.pos.backend.application.port.input.sale;

import com.pos.backend.application.dto.response.PagedResponse;
import com.pos.backend.application.dto.response.SaleResponse;
import com.pos.backend.domain.model.enums.PaymentMethod;
import com.pos.backend.domain.model.enums.SaleStatus;

import java.time.LocalDateTime;

public interface GetSalesHistoryUseCase {
    PagedResponse<SaleResponse> execute(String customerId, SaleStatus status,
                                        PaymentMethod paymentMethod, LocalDateTime fromDate,
                                        LocalDateTime toDate, String currentUserId,
                                        boolean isAdmin, int page, int pageSize);
}
