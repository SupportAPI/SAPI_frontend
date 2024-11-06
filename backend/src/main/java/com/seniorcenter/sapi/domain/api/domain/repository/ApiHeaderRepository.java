package com.seniorcenter.sapi.domain.api.domain.repository;

import com.seniorcenter.sapi.domain.api.domain.ApiHeader;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApiHeaderRepository extends JpaRepository<ApiHeader, Long> {
}