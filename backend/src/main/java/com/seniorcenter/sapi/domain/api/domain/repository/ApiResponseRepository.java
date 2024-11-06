package com.seniorcenter.sapi.domain.api.domain.repository;

import com.seniorcenter.sapi.domain.api.domain.ApiCookie;
import com.seniorcenter.sapi.domain.api.domain.ApiResponse;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApiResponseRepository extends JpaRepository<ApiResponse, Long> {
}