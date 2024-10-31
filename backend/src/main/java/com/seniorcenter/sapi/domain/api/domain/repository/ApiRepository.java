package com.seniorcenter.sapi.domain.api.domain.repository;

import com.seniorcenter.sapi.domain.api.domain.Api;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface ApiRepository extends JpaRepository<Api, Long> {
    Api findById(UUID apiUUID);

    @Query("SELECT a FROM Api a WHERE a.specification.id = :specificationId ORDER BY a.createdDate DESC")
    Optional<Api> findLatestBySpecificationId(@Param("specificationId") UUID specificationId);
}