package com.seniorcenter.sapi.domain.api.presentation.dto;

import com.seniorcenter.sapi.domain.api.domain.*;
import com.seniorcenter.sapi.domain.api.domain.enums.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public record ApiDto(
    UUID id,
    String name,
    String path,
    HttpMethod method,
    String description,
    BodyType bodyType,
    AuthenticationType authenticationType,
    String category,
    List<ApiHeaderDto> headers,
    List<ApiCookieDto> cookies,
    List<ApiQueryParameterDto> queryParameters,
    List<ApiPathVariableDto> pathVariables,
    List<ApiBodyDto> bodies,
    List<ApiResponseDto> responses
) {
    public static ApiDto createApiDto(Api api) {
        return new ApiDto(
            api.getId(),
            api.getName(),
            api.getPath(),
            api.getMethod(),
            api.getDescription(),
            api.getBodyType(),
            api.getAuthenticationType(),
            api.getCategory(),
            api.getHeaders() != null ? api.getHeaders().stream()
                .map(ApiHeaderDto::from)
                .collect(Collectors.toList()) : null,
            api.getCookies() != null ? api.getCookies().stream()
                .map(ApiCookieDto::from)
                .collect(Collectors.toList()) : null,
            api.getQueryParameters() != null ? api.getQueryParameters().stream()
                .map(ApiQueryParameterDto::from)
                .collect(Collectors.toList()) : null,
            api.getPathVariables() != null ? api.getPathVariables().stream()
                .map(ApiPathVariableDto::from)
                .collect(Collectors.toList()) : null,
            api.getBodies() != null ? api.getBodies().stream()
                .map(ApiBodyDto::from)
                .collect(Collectors.toList()) : null,
            api.getResponses() != null ? api.getResponses().stream()
                .map(ApiResponseDto::from)
                .collect(Collectors.toList()) : null
        );
    }

    public record ApiHeaderDto(
        String headerKey,
        String headerValue,
        String description,
        Boolean isRequired,
        Boolean isChecked
    ) {
        public static ApiHeaderDto from(ApiHeader header) {
            return new ApiHeaderDto(
                header.getHeaderKey(),
                header.getHeaderValue(),
                header.getDescription(),
                header.getIsRequired(),
                header.getIsChecked()
            );
        }
    }

    public record ApiCookieDto(
        String cookieKey,
        String cookieValue,
        String description,
        Boolean isRequired,
        Boolean isChecked
    ) {
        public static ApiCookieDto from(ApiCookie cookie) {
            return new ApiCookieDto(
                cookie.getCookieKey(),
                cookie.getCookieValue(),
                cookie.getDescription(),
                cookie.getIsRequired(),
                cookie.getIsChecked()
            );
        }
    }

    public record ApiQueryParameterDto(
        String paramKey,
        String paramValue,
        String description,
        Boolean isRequired,
        Boolean isChecked
    ) {
        public static ApiQueryParameterDto from(ApiQueryParameter param) {
            return new ApiQueryParameterDto(
                param.getParamKey(),
                param.getParamValue(),
                param.getDescription(),
                param.getIsRequired(),
                param.getIsChecked()
            );
        }
    }

    public record ApiPathVariableDto(
        String variableKey,
        String variableValue,
        String description
    ) {
        public static ApiPathVariableDto from(ApiPathVariable variable) {
            return new ApiPathVariableDto(
                variable.getVariableKey(),
                variable.getVariableValue(),
                variable.getDescription()
            );
        }
    }

    public record ApiBodyDto(
        ParameterType parameterType,
        String bodyKey,
        String bodyValue,
        String description,
        Boolean isRequired,
        Boolean isChecked
    ) {
        public static ApiBodyDto from(ApiBody body) {
            return new ApiBodyDto(
                body.getParameterType(),
                body.getBodyKey(),
                body.getBodyValue(),
                body.getDescription(),
                body.getIsRequired(),
                body.getIsChecked()
            );
        }
    }

    public record ApiResponseDto(
        int code,
        String name,
        BodyType bodyType,
        String bodyData,
        String description
    ) {
        public static ApiResponseDto from(ApiResponse response) {
            return new ApiResponseDto(
                response.getCode(),
                response.getName(),
                response.getBodyType(),
                response.getBodyData(),
                response.getDescription()
            );
        }
    }
}
