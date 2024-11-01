package com.seniorcenter.sapi.domain.api.domain.repository;

import com.seniorcenter.sapi.domain.api.domain.Api;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ApiRepository extends JpaRepository<Api, Long> {
    Api findById(UUID apiUUID);

    List<Api> findBySpecificationIdOrderByCreatedDateDesc(UUID specificationId);

    Optional<Api> findTopBySpecificationIdOrderByCreatedDateDesc(UUID specificationId);

}