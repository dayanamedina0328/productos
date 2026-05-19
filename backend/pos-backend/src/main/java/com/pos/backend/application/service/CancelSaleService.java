package com.pos.backend.application.service;

import com.pos.backend.application.dto.response.SaleResponse;
import com.pos.backend.application.port.input.sale.CancelSaleUseCase;
import com.pos.backend.domain.exception.SaleNotFoundException;
import com.pos.backend.domain.model.Sale;
import com.pos.backend.domain.model.SaleItem;
import com.pos.backend.domain.port.output.ProductRepository;
import com.pos.backend.domain.port.output.SaleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CancelSaleService implements CancelSaleUseCase {

    private final SaleRepository saleRepository;
    private final ProductRepository productRepository;
    private final SaleMapper saleMapper;

    public CancelSaleService(SaleRepository saleRepository,
                              ProductRepository productRepository,
                              SaleMapper saleMapper) {
        this.saleRepository = saleRepository;
        this.productRepository = productRepository;
        this.saleMapper = saleMapper;
    }

    @Override
    public SaleResponse execute(String saleId) {
        Sale sale = saleRepository.findById(saleId)
            .orElseThrow(() -> new SaleNotFoundException(saleId));

        // Revertir stock antes de cancelar
        for (SaleItem item : sale.getStockReversals()) {
            productRepository.findById(item.getProductId()).ifPresent(product -> {
                product.increaseStock(item.getQuantity());
                productRepository.save(product);
            });
        }

        sale.cancel();
        return saleMapper.toResponse(saleRepository.save(sale));
    }
}
