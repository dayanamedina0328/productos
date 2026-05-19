package com.pos.backend.infrastructure.persistence.jpa;

import com.pos.backend.infrastructure.persistence.entity.CustomerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface JpaCustomerRepository extends JpaRepository<CustomerEntity, String>,
                                               JpaSpecificationExecutor<CustomerEntity> {

    Optional<CustomerEntity> findByNit(String nit);

    boolean existsByNit(String nit);

    boolean existsByNitAndIdNot(String nit, String id);
}
