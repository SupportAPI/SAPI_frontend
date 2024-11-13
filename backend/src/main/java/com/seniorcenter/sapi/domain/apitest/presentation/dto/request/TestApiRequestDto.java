package com.seniorcenter.sapi.domain.apitest.presentation.dto.request;

import com.seniorcenter.sapi.domain.api.presentation.dto.ParametersDto;
import com.seniorcenter.sapi.domain.api.presentation.dto.RequestDto;

import java.util.UUID;

public record TestApiRequestDto(
    UUID docId,
    UUID apiId,
    String method,
    String path,
    ParametersDto parameters,
    RequestDto request
) {
}
