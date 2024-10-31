package com.seniorcenter.sapi.domain.specification.presentation.dto.response;

import com.seniorcenter.sapi.domain.api.domain.Api;

import java.util.UUID;

public record SpecificationIdNameResponseDto(
        UUID apiId,
        String name
) {
    public SpecificationIdNameResponseDto(Api api) {
        this(api.getId(), api.getName());
    }
}
