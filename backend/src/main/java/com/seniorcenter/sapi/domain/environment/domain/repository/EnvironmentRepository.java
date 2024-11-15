package com.seniorcenter.sapi.domain.environment.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.seniorcenter.sapi.domain.environment.domain.Environment;
import com.seniorcenter.sapi.domain.environment.domain.EnvironmentCategory;

public interface EnvironmentRepository extends JpaRepository<Environment, Long> {
	boolean existsByEnvironmentCategoryAndVariable(EnvironmentCategory environmentCategory, String variable);
}
