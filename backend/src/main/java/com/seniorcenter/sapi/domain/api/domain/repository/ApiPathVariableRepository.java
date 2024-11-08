package com.seniorcenter.sapi.domain.api.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.seniorcenter.sapi.domain.api.domain.ApiPathVariable;

public interface ApiPathVariableRepository extends JpaRepository<ApiPathVariable, Long> {
}
