package com.seniorcenter.sapi.domain.api.domain.repository;

import com.seniorcenter.sapi.domain.api.domain.Api;
import com.seniorcenter.sapi.domain.api.domain.ApiPathVariable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApiPathVariableRepository extends JpaRepository<ApiPathVariable, Long> {
    List<ApiPathVariable> findAllByApi(Api api);
}
