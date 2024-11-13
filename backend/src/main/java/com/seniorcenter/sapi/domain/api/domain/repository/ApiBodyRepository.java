package com.seniorcenter.sapi.domain.api.domain.repository;

import com.seniorcenter.sapi.domain.api.domain.Api;
import com.seniorcenter.sapi.domain.api.domain.ApiBody;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApiBodyRepository extends JpaRepository<ApiBody, Long> {
    List<ApiBody> findAllByApi(Api api);
}