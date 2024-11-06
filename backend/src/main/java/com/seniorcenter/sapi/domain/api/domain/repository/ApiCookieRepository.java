package com.seniorcenter.sapi.domain.api.domain.repository;

import com.seniorcenter.sapi.domain.api.domain.ApiCookie;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApiCookieRepository extends JpaRepository<ApiCookie, Long> {
}