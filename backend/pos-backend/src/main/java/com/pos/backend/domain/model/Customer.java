package com.pos.backend.domain.model;

import com.pos.backend.domain.model.enums.CustomerType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Entidad de dominio: Cliente.
 * Sin anotaciones de Spring/JPA.
 */
public class Customer {

    private final String id;
    private String name;
    private final String nit;
    private String email;
    private String phone;
    private String address;
    private CustomerType customerType;
    private BigDecimal creditLimit;
    private boolean active;
    private final LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Customer(String id, String name, String nit, String email, String phone,
                     String address, CustomerType customerType, BigDecimal creditLimit,
                     boolean active, LocalDateTime createdAt) {
        this.id = Objects.requireNonNull(id);
        this.name = Objects.requireNonNull(name);
        this.nit = Objects.requireNonNull(nit);
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.customerType = customerType != null ? customerType : CustomerType.REGULAR;
        this.creditLimit = creditLimit;
        this.active = active;
        this.createdAt = createdAt;
        this.updatedAt = createdAt;
    }

    /** Factory method para crear un nuevo cliente */
    public static Customer create(String id, String name, String nit, String email,
                                  String phone, String address, CustomerType customerType,
                                  BigDecimal creditLimit) {
        validateName(name);
        validateNit(nit);
        CustomerType type = customerType != null ? customerType : CustomerType.REGULAR;
        validateCreditLimit(type, creditLimit);
        return new Customer(id, name, nit, email, phone, address, type, creditLimit, true, LocalDateTime.now());
    }

    /** Reconstruye desde persistencia */
    public static Customer reconstitute(String id, String name, String nit, String email,
                                        String phone, String address, CustomerType customerType,
                                        BigDecimal creditLimit, boolean active,
                                        LocalDateTime createdAt, LocalDateTime updatedAt) {
        Customer c = new Customer(id, name, nit, email, phone, address, customerType, creditLimit, active, createdAt);
        c.updatedAt = updatedAt;
        return c;
    }

    private static void validateName(String name) {
        if (name == null || name.isBlank()) throw new IllegalArgumentException("Customer name cannot be blank");
        if (name.length() > 255) throw new IllegalArgumentException("Customer name cannot exceed 255 characters");
    }

    private static void validateNit(String nit) {
        if (nit == null || nit.isBlank()) throw new IllegalArgumentException("NIT cannot be blank");
        if (nit.length() > 50) throw new IllegalArgumentException("NIT cannot exceed 50 characters");
    }

    private static void validateCreditLimit(CustomerType type, BigDecimal creditLimit) {
        if (type == CustomerType.REGULAR && creditLimit != null) {
            throw new IllegalArgumentException("REGULAR customers cannot have a credit limit");
        }
        if (creditLimit != null) {
            if (creditLimit.compareTo(BigDecimal.ZERO) < 0) {
                throw new IllegalArgumentException("Credit limit cannot be negative");
            }
            if (creditLimit.compareTo(new BigDecimal("999999999.99")) > 0) {
                throw new IllegalArgumentException("Credit limit cannot exceed 999,999,999.99");
            }
        }
    }

    public void update(String name, String email, String phone, String address, BigDecimal creditLimit) {
        if (name != null) { validateName(name); this.name = name; }
        if (email != null) this.email = email;
        if (phone != null) this.phone = phone;
        if (address != null) this.address = address;
        if (creditLimit != null) {
            validateCreditLimit(this.customerType, creditLimit);
            this.creditLimit = creditLimit;
        }
        this.updatedAt = LocalDateTime.now();
    }

    public void deactivate() {
        this.active = false;
        this.updatedAt = LocalDateTime.now();
    }

    // Getters
    public String getId() { return id; }
    public String getName() { return name; }
    public String getNit() { return nit; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getAddress() { return address; }
    public CustomerType getCustomerType() { return customerType; }
    public BigDecimal getCreditLimit() { return creditLimit; }
    public boolean isActive() { return active; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
