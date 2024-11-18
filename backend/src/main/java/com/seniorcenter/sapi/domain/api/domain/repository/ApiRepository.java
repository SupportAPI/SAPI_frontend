package com.seniorcenter.sapi.domain.api.domain.repository;

import com.seniorcenter.sapi.domain.api.domain.Api;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ApiRepository extends JpaRepository<Api, UUID>, ApiRepositoryCustom {
    Optional<Api> findById(UUID apiUUID);

    List<Api> findBySpecificationIdOrderByCreatedDateDesc(UUID specificationId);

    Optional<Api> findTopBySpecificationIdOrderByCreatedDateDesc(UUID specificationId);

    List<Api> findByCategory(String category);

    @Query("SELECT a FROM Api a JOIN a.specification s WHERE a.id = :apiId AND s.workspace.id = :workspaceId")
    Optional<Api> findByIdAndWorkspaceId(@Param("apiId") UUID apiId, @Param("workspaceId") UUID workspaceId);

    @Query("SELECT a FROM Api a WHERE a.specification.id = :specificationId AND a.confirmTime IS NOT NULL ORDER BY a.confirmTime DESC")
    List<Api> findBySpecificationIdAndConfirmedOrderByConfirmTimeDesc(@Param("specificationId") UUID specificationId);
}