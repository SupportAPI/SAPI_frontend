package com.seniorcenter.sapi.domain.apitest.presentation;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;

public record TestResponseEntityDto(
    HttpStatusCode statusCode,
    HttpHeaders headers
) {
}