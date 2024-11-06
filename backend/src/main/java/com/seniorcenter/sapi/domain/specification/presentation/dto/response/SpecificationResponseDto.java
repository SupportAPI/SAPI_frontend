package com.seniorcenter.sapi.domain.specification.presentation.dto.response;

import com.seniorcenter.sapi.domain.api.domain.Api;
import com.seniorcenter.sapi.domain.api.domain.enums.AuthenticationType;
import com.seniorcenter.sapi.domain.api.domain.enums.BodyType;
import com.seniorcenter.sapi.domain.api.domain.enums.HttpMethod;
import com.seniorcenter.sapi.domain.specification.domain.Specification;
import com.seniorcenter.sapi.domain.specification.domain.TestStatus;

import java.util.UUID;

public record SpecificationResponseDto(
        UUID docId,
        UUID apiId,
        String category,
        String name,
        HttpMethod method,
        String path,
        String nickname,
        BodyType bodyType,
        AuthenticationType authenticationType,
        TestStatus localStatus,
        TestStatus serverStatus,
        String description
) {
    public SpecificationResponseDto(Api api, Specification specification) {
        this(
                specification.getId(),
                api.getId(),
                api.getCategory(),
                api.getName(),
                api.getMethod(),
                api.getPath(),
                specification.getManager() != null ? specification.getManager().getNickname() : "",
                api.getBodyType(),
                api.getAuthenticationType(),
                specification.getLocalStatus(),
                specification.getServerStatus(),
                api.getDescription()
        );
    }
}
