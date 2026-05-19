package com.pos.backend.domain.port.output;

import com.pos.backend.domain.model.Customer;
import com.pos.backend.domain.model.enums.CustomerType;

import java.util.List;
import java.util.Optional;

/**
 * Puerto de salida: repositorio de clientes.
 */
public interface CustomerRepository {

    Optional<Customer> findById(String id);

    Optional<Customer> findByNit(String nit);

    List<Customer> findAll(CustomerFilter filter, int page, int pageSize);

    long countAll(CustomerFilter filter);

    Customer save(Customer customer);

    boolean existsByNit(String nit);

    boolean existsByNitAndIdNot(String nit, String excludeId);

    record CustomerFilter(String name, String nit, CustomerType type, Boolean active) {
        public static CustomerFilter empty() {
            return new CustomerFilter(null, null, null, null);
        }
    }
}
