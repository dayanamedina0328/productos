package com.pos.backend.application.service;

import com.pos.backend.application.dto.request.CreateCustomerRequest;
import com.pos.backend.application.dto.request.UpdateCustomerRequest;
import com.pos.backend.application.dto.response.CustomerResponse;
import com.pos.backend.application.dto.response.PagedResponse;
import com.pos.backend.application.port.input.customer.*;
import com.pos.backend.domain.exception.CustomerNotFoundException;
import com.pos.backend.domain.exception.DuplicateNitException;
import com.pos.backend.domain.model.Customer;
import com.pos.backend.domain.model.enums.CustomerType;
import com.pos.backend.domain.port.output.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class CustomerService implements CreateCustomerUseCase, GetCustomersUseCase,
                                        GetCustomerByIdUseCase, UpdateCustomerUseCase {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

    public CustomerService(CustomerRepository customerRepository, CustomerMapper customerMapper) {
        this.customerRepository = customerRepository;
        this.customerMapper = customerMapper;
    }

    @Override
    public CustomerResponse execute(CreateCustomerRequest request) {
        if (customerRepository.existsByNit(request.nit())) {
            throw new DuplicateNitException(request.nit());
        }

        Customer customer = Customer.create(
            UUID.randomUUID().toString(),
            request.name(),
            request.nit(),
            request.email(),
            request.phone(),
            request.address(),
            request.customerType(),
            request.creditLimit()
        );

        return customerMapper.toResponse(customerRepository.save(customer));
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<CustomerResponse> execute(String name, String nit, CustomerType type,
                                                    int page, int pageSize) {
        int effectivePage = Math.max(page, 0);
        int effectiveSize = Math.min(Math.max(pageSize, 1), 100);

        var filter = new CustomerRepository.CustomerFilter(name, nit, type, null);
        List<Customer> customers = customerRepository.findAll(filter, effectivePage, effectiveSize);
        long total = customerRepository.countAll(filter);

        List<CustomerResponse> responses = customers.stream()
            .map(customerMapper::toResponse)
            .toList();

        return PagedResponse.of(responses, effectivePage, effectiveSize, total);
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponse execute(String id) {
        return customerMapper.toResponse(
            customerRepository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException(id))
        );
    }

    @Override
    public CustomerResponse execute(String id, UpdateCustomerRequest request) {
        Customer customer = customerRepository.findById(id)
            .orElseThrow(() -> new CustomerNotFoundException(id));

        customer.update(request.name(), request.email(), request.phone(),
                        request.address(), request.creditLimit());

        if (Boolean.FALSE.equals(request.active())) customer.deactivate();

        return customerMapper.toResponse(customerRepository.save(customer));
    }
}
