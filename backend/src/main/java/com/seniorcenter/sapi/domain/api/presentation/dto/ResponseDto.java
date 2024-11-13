package com.seniorcenter.sapi.domain.api.presentation.dto;

public record ResponseDto(
    String id,
    String code,
    String description,
    String contentType,
    String bodyData
) {
}
