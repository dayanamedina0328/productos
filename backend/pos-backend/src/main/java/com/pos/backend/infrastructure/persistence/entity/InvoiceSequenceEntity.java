package com.pos.backend.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "invoice_sequences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceSequenceEntity {

    @Id
    @Column(name = "date_key")
    private LocalDate dateKey;

    @Column(name = "sequence", nullable = false)
    private int sequence;
}
