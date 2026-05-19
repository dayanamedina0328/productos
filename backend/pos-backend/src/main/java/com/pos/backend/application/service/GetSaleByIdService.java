package com.pos.backend.application.service;

import com.pos.backend.application.dto.response.SaleResponse;
import com.pos.backend.application.port.input.sale.GetSaleByIdUseCase;
import com.pos.backend.domain.exception.SaleNotFoundException;
import com.pos.backend.domain.port.output.SaleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class GetSaleByIdService implements GetSaleByIdUseCase {

    private final SaleRepository saleRepository;
    private final SaleMapper saleMapper;

    public GetSaleByIdService(SaleRepository saleRepository, SaleMapper saleMapper) {
        this.saleRepository = saleRepository;
        this.saleMapper = saleMapper;
    }

    @Override
    public SaleResponse execute(String saleId) {
        return saleMapper.toResponse(
            saleRepository.findById(saleId)
                .orElseThrow(() -> new SaleNotFoundException(saleId))
        );
    }
}
