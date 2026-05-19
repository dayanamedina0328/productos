package com.pos.backend.infrastructure.persistence.adapter;

import com.pos.backend.domain.model.Sale;
import com.pos.backend.domain.model.enums.PaymentMethod;
import com.pos.backend.domain.model.enums.SaleStatus;
import com.pos.backend.domain.port.output.SaleRepository;
import com.pos.backend.infrastructure.persistence.entity.InvoiceSequenceEntity;
import com.pos.backend.infrastructure.persistence.entity.SaleEntity;
import com.pos.backend.infrastructure.persistence.jpa.JpaInvoiceSequenceRepository;
import com.pos.backend.infrastructure.persistence.jpa.JpaSaleRepository;
import com.pos.backend.infrastructure.persistence.mapper.SaleEntityMapper;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
public class SaleRepositoryAdapter implements SaleRepository {

    private final JpaSaleRepository jpaRepository;
    private final JpaInvoiceSequenceRepository invoiceSequenceRepository;
    private final SaleEntityMapper mapper;

    public SaleRepositoryAdapter(JpaSaleRepository jpaRepository,
                                  JpaInvoiceSequenceRepository invoiceSequenceRepository,
                                  SaleEntityMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.invoiceSequenceRepository = invoiceSequenceRepository;
        this.mapper = mapper;
    }

    @Override
    public Optional<Sale> findById(String id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    public Optional<Sale> findByInvoiceNumber(String invoiceNumber) {
        return jpaRepository.findByInvoiceNumber(invoiceNumber).map(mapper::toDomain);
    }

    @Override
    public List<Sale> findAll(SaleFilter filter, int page, int pageSize) {
        Page<SaleEntity> result = jpaRepository.findAll(
            buildSpec(filter), PageRequest.of(page, pageSize));
        return result.getContent().stream().map(mapper::toDomain).toList();
    }

    @Override
    public long countAll(SaleFilter filter) {
        return jpaRepository.count(buildSpec(filter));
    }

    @Override
    public Sale save(Sale sale) {
        return mapper.toDomain(jpaRepository.save(mapper.toEntity(sale)));
    }

    @Override
    public long getNextInvoiceSequence(LocalDate date) {
        InvoiceSequenceEntity seq = invoiceSequenceRepository
            .findByDateKeyWithLock(date)
            .orElse(InvoiceSequenceEntity.builder().dateKey(date).sequence(0).build());

        seq.setSequence(seq.getSequence() + 1);
        invoiceSequenceRepository.save(seq);
        return seq.getSequence();
    }

    private Specification<SaleEntity> buildSpec(SaleFilter filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (filter.customerId() != null) {
                predicates.add(cb.equal(root.get("customerId"), filter.customerId()));
            }
            if (filter.createdBy() != null) {
                predicates.add(cb.equal(root.get("createdBy"), filter.createdBy()));
            }
            if (filter.status() != null) {
                predicates.add(cb.equal(root.get("status"), filter.status()));
            }
            if (filter.paymentMethod() != null) {
                predicates.add(cb.equal(root.get("paymentMethod"), filter.paymentMethod()));
            }
            if (filter.fromDate() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), filter.fromDate()));
            }
            if (filter.toDate() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), filter.toDate()));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
