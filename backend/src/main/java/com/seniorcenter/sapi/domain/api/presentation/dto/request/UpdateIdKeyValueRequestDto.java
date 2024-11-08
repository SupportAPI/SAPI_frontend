package com.seniorcenter.sapi.domain.api.presentation.dto.request;

import com.seniorcenter.sapi.domain.api.domain.enums.AttributeType;

public record UpdateIdKeyValueRequestDto(
        Long id,
        AttributeType type,
        String value
) {
}
