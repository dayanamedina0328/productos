package com.pos.backend.infrastructure.persistence.jpa;

import com.pos.backend.infrastructure.persistence.entity.InvoiceSequenceEntity;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Optional;

public interface JpaInvoiceSequenceRepository extends JpaRepository<InvoiceSequenceEntity, LocalDate> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM InvoiceSequenceEntity s WHERE s.dateKey = :dateKey")
    Optional<InvoiceSequenceEntity> findByDateKeyWithLock(@Param("dateKey") LocalDate dateKey);
}
