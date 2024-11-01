package com.seniorcenter.sapi.domain.specification.presentation.dto.response;

import com.seniorcenter.sapi.domain.api.domain.Api;

import java.util.UUID;

public record SpecificationIdNameResponseDto(
        UUID apiId,
        UUID docId,
        String name
) {
    public SpecificationIdNameResponseDto(Api api, UUID docId) {
        this(api.getId(), docId, api.getName());
    }
}
