package com.seniorcenter.sapi.domain.api.presentation.dto;

import java.util.List;

public record ParametersDto(
    String authType,
    List<Header> headers,
    List<PathVariable> pathVariables,
    List<QueryParameter> queryParameters,
    List<Cookie> cookies
) {
    public record Header(
        String id,
        String key,
        String value,
        String description,
        Boolean isEssential,
        Boolean isChecked
    ) {
    }

    public record PathVariable(
        String id,
        String key,
        String value,
        String description
    ) {
    }

    public record QueryParameter(
        String id,
        String key,
        String value,
        String description,
        Boolean isEssential,
        Boolean isChecked
    ) {
    }

    public record Cookie(
        String id,
        String key,
        String value,
        String description,
        Boolean isEssential,
        Boolean isChecked
    ) {
    }

}
