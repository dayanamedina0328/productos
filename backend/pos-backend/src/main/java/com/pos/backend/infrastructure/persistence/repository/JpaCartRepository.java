package com.pos.backend.infrastructure.persistence.repository;

import com.pos.backend.infrastructure.persistence.entity.CartEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JpaCartRepository extends JpaRepository<CartEntity, String> {
    Optional<CartEntity> findById(String id);
}
