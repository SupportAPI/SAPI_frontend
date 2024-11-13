package com.seniorcenter.sapi.domain.api.domain.repository;

import com.seniorcenter.sapi.domain.api.domain.Api;
import com.seniorcenter.sapi.domain.api.domain.ApiHeader;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApiHeaderRepository extends JpaRepository<ApiHeader, Long> {
    List<ApiHeader> findAllByApi(Api api);
}