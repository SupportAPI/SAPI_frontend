package com.seniorcenter.sapi.domain.api.domain.repository;

import com.seniorcenter.sapi.domain.api.domain.ApiCookie;
import com.seniorcenter.sapi.domain.api.domain.ApiHeader;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApiCookieRepository extends JpaRepository<ApiCookie, Long> {
}