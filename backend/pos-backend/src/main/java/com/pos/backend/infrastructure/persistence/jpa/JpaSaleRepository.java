package com.pos.backend.infrastructure.persistence.jpa;

import com.pos.backend.infrastructure.persistence.entity.SaleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface JpaSaleRepository extends JpaRepository<SaleEntity, String>,
                                           JpaSpecificationExecutor<SaleEntity> {

    Optional<SaleEntity> findByInvoiceNumber(String invoiceNumber);
}
