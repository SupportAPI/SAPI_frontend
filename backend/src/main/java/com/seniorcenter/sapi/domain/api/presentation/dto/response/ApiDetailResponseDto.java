package com.seniorcenter.sapi.domain.api.presentation.dto.response;

import com.seniorcenter.sapi.domain.api.domain.enums.BodyType;
import com.seniorcenter.sapi.domain.category.presentation.dto.response.CategoryResponseDto;

import java.time.LocalDateTime;
import java.util.List;

public record ApiDetailResponseDto(
        String docId,
        String apiId,
        CategoryResponseDto category,
        String name,
        String method,
        String path,
        String description,
        String managerEmail,
        String managerName,
        String managerProfileImage,
        Parameters parameters,
        Request request,
        List<Response> response,
        LocalDateTime createdDate,
        LocalDateTime lastModifyDate
) {
    public record Parameters(
            String authType,
            List<Header> headers,
            List<ApiDetailResponseDto.Parameters.PathVariables> pathVariables,
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
        ) {}

        public record PathVariables(
            String id,
            String key,
            String value,
            String description
        ) {}

        public record QueryParameter(
                String id,
                String key,
                String value,
                String description,
                Boolean isEssential,
                Boolean isChecked
        ) {}

        public record Cookie(
                String id,
                String key,
                String value,
                String description,
                Boolean isEssential,
                Boolean isChecked
        ) {}
    }

    public record Request(
            BodyType bodyType,
            JsonData json,
            List<FormData> formData
    ) {
        public record JsonData(
                String id,
                String value
        ) {}

        public record FormData(
                String id,
                String key,
                String value,
                String type,
                String description,
                Boolean isEssential,
                Boolean isChecked
        ) {}
    }

    public record Response(
            String id,
            String code,
            String description,
            String contentType,
            String bodyData
    ) {}
}
