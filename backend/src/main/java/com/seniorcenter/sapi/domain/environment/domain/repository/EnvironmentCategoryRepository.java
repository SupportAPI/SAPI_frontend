package com.seniorcenter.sapi.domain.environment.domain.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.seniorcenter.sapi.domain.environment.domain.EnvironmentCategory;

public interface EnvironmentCategoryRepository extends JpaRepository<EnvironmentCategory, Long> {

	@EntityGraph(attributePaths = "environments")
	List<EnvironmentCategory> findByWorkspaceId(UUID workspaceId);
}
