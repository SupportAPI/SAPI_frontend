package com.seniorcenter.sapi.domain.proxy.service;

import org.springframework.http.HttpHeaders;

public record ServerRequestInfoDto(
        String url,
        HttpHeaders headers
) {
}