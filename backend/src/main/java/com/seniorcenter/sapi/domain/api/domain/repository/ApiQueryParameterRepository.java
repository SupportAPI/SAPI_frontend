package com.seniorcenter.sapi.domain.api.domain.repository;

import com.seniorcenter.sapi.domain.api.domain.ApiCookie;
import com.seniorcenter.sapi.domain.api.domain.ApiQueryParameter;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApiQueryParameterRepository extends JpaRepository<ApiQueryParameter, Long> {
}