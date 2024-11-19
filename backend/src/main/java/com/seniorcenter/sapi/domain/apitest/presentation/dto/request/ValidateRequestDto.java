package com.seniorcenter.sapi.domain.apitest.presentation.dto.request;

import java.util.Map;

public record ValidateRequestDto(
    Object data,
    int status,
    String statusText,
    Map<String, String> headers,
    Map<String, Object> config,
    Object request,
    long responseTime
) {
}
