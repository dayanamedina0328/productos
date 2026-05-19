package com.pos.backend.infrastructure.persistence.adapter;

import com.pos.backend.domain.model.Customer;
import com.pos.backend.domain.model.enums.CustomerType;
import com.pos.backend.domain.port.output.CustomerRepository;
import com.pos.backend.infrastructure.persistence.entity.CustomerEntity;
import com.pos.backend.infrastructure.persistence.jpa.JpaCustomerRepository;
import com.pos.backend.infrastructure.persistence.mapper.CustomerEntityMapper;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
public class CustomerRepositoryAdapter implements CustomerRepository {

    private final JpaCustomerRepository jpaRepository;
    private final CustomerEntityMapper mapper;

    public CustomerRepositoryAdapter(JpaCustomerRepository jpaRepository,
                                     CustomerEntityMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public Optional<Customer> findById(String id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    public Optional<Customer> findByNit(String nit) {
        return jpaRepository.findByNit(nit).map(mapper::toDomain);
    }

    @Override
    public List<Customer> findAll(CustomerFilter filter, int page, int pageSize) {
        Page<CustomerEntity> result = jpaRepository.findAll(
            buildSpec(filter), PageRequest.of(page, pageSize));
        return result.getContent().stream().map(mapper::toDomain).toList();
    }

    @Override
    public long countAll(CustomerFilter filter) {
        return jpaRepository.count(buildSpec(filter));
    }

    @Override
    public Customer save(Customer customer) {
        return mapper.toDomain(jpaRepository.save(mapper.toEntity(customer)));
    }

    @Override
    public boolean existsByNit(String nit) {
        return jpaRepository.existsByNit(nit);
    }

    @Override
    public boolean existsByNitAndIdNot(String nit, String excludeId) {
        return jpaRepository.existsByNitAndIdNot(nit, excludeId);
    }

    private Specification<CustomerEntity> buildSpec(CustomerFilter filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (filter.name() != null && !filter.name().isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("name")),
                                       "%" + filter.name().toLowerCase() + "%"));
            }
            if (filter.nit() != null && !filter.nit().isBlank()) {
                predicates.add(cb.equal(root.get("nit"), filter.nit()));
            }
            if (filter.type() != null) {
                predicates.add(cb.equal(root.get("customerType"), filter.type()));
            }
            if (filter.active() != null) {
                predicates.add(cb.equal(root.get("active"), filter.active()));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
