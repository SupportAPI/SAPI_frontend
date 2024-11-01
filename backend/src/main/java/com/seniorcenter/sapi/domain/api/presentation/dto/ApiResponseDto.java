package com.seniorcenter.sapi.domain.api.presentation.dto;

import com.seniorcenter.sapi.domain.api.domain.Api;
import com.seniorcenter.sapi.domain.api.domain.AuthenticationType;
import com.seniorcenter.sapi.domain.api.domain.BodyType;
import com.seniorcenter.sapi.domain.api.domain.HttpMethod;

import java.util.UUID;

public record ApiResponseDto(
        UUID id,
        String name,
        String path,
        HttpMethod method,
        BodyType bodyType,
        AuthenticationType authenticationType,
        String category
) {
    public ApiResponseDto(Api api){
        this(api.getId(), api.getName(), api.getPath(), api.getMethod(), api.getBodyType(), api.getAuthenticationType(), api.getCategory());
    }
}
