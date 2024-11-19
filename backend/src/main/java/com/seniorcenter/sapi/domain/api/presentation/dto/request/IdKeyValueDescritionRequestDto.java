package com.seniorcenter.sapi.domain.api.presentation.dto.request;

public record IdKeyValueDescritionRequestDto(
        String id,
        String key,
        String value,
        String description
) {
}
