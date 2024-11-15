package com.seniorcenter.sapi.domain.api.presentation.dto.response;

import com.seniorcenter.sapi.domain.api.domain.enums.AttributeType;

public record ApiIdKeyValueResponseDto(
        Long id,
        AttributeType type,
        String value,
        Long userId
) {
    public ApiIdKeyValueResponseDto(Long id, AttributeType type, String value){
        this(id, type, value, null);
    }
}
