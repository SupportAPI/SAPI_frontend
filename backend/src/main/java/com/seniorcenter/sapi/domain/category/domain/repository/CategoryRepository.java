package com.seniorcenter.sapi.domain.category.domain.repository;

import com.seniorcenter.sapi.domain.category.domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByWorkspaceId(UUID workspaceId);

    Optional<Category> findByWorkspaceIdAndName(UUID workspaceId, String name);
}
