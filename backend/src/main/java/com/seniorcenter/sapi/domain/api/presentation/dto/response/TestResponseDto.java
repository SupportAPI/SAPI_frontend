package com.seniorcenter.sapi.domain.api.presentation.dto.response;

import java.util.Map;

public record TestResponseDto(
        String status,
        int code,
        String responseBody,
        String mockBody,
        Map<String, String> headers,
        Map<String, String> cookies,
        Map<String, String> requestSize,
        Map<String, String> responseSize,
        Long responseTime,
        String testType,
        String message
) {
}
