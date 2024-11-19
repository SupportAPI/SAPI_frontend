package com.seniorcenter.sapi.domain.api.domain.repository;

import com.seniorcenter.sapi.domain.api.domain.Api;
import com.seniorcenter.sapi.domain.api.domain.ApiQueryParameter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApiQueryParameterRepository extends JpaRepository<ApiQueryParameter, Long> {
    List<ApiQueryParameter> findAllByApi(Api api);
}