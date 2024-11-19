package com.seniorcenter.sapi.domain.api.presentation.dto.request;

public record SaveDataRequestDto(
        String componentId,
        String id,
        String key,
        String value,
        String description,
        String type,
        boolean required
) {
}
