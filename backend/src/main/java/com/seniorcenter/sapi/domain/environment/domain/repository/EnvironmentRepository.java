package com.seniorcenter.sapi.domain.environment.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.seniorcenter.sapi.domain.environment.domain.Environment;

public interface EnvironmentRepository extends JpaRepository<Environment, Long> {
}
