package com.seniorcenter.sapi.domain.api.presentation.dto;

public record ResponseDto(
    String id,
    int code,
    String name,
    String description,
    String bodyType,
    String bodyData
) {
}
