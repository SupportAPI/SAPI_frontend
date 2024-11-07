package com.seniorcenter.sapi.domain.specification.domain.repository;

import com.seniorcenter.sapi.domain.specification.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SpecificationRepository extends JpaRepository<Specification, UUID>, SpecificationRepositoryCustom {
    List<Specification> findSpecificationsByWorkspaceId(UUID workSpaceId);

    Optional<Specification> findById(UUID specificationUUID);
}
