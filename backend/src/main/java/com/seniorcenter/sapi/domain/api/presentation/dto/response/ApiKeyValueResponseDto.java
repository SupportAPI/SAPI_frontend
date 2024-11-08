package com.seniorcenter.sapi.domain.api.presentation.dto.response;

import com.seniorcenter.sapi.domain.api.domain.enums.AttributeType;

public record ApiKeyValueResponseDto(
        AttributeType type,
        String value
) {
}
