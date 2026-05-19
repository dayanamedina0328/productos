package com.pos.backend.domain.model.valueobject;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Objects;
import java.util.regex.Pattern;

/**
 * Value object para el número de factura.
 * Formato: INV-{YYYYMMDD}-{SEQUENCE}
 */
public record InvoiceNumber(String value) {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyyMMdd");
    private static final Pattern VALID_PATTERN = Pattern.compile("^INV-\\d{8}-\\d+$");

    public InvoiceNumber {
        Objects.requireNonNull(value, "Invoice number cannot be null");
        if (!VALID_PATTERN.matcher(value).matches()) {
            throw new IllegalArgumentException("Invalid invoice number format: " + value + ". Expected: INV-YYYYMMDD-SEQUENCE");
        }
    }

    /**
     * Genera un número de factura para la fecha y secuencia dadas.
     */
    public static InvoiceNumber generate(LocalDate date, long sequence) {
        Objects.requireNonNull(date, "Date cannot be null");
        if (sequence < 1) {
            throw new IllegalArgumentException("Sequence must be >= 1, got: " + sequence);
        }
        return new InvoiceNumber("INV-" + date.format(DATE_FORMAT) + "-" + sequence);
    }

    public static boolean isValid(String value) {
        return value != null && VALID_PATTERN.matcher(value).matches();
    }

    @Override
    public String toString() {
        return value;
    }
}
