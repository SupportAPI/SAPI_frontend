package com.seniorcenter.sapi.domain.api.presentation.dto;

import com.seniorcenter.sapi.domain.api.domain.enums.BodyType;

import java.util.List;

public record ApiDetailResponseDto(
        String docsId,
        String apiId,
        String category,
        String name,
        String method,
        String path,
        String description,
        String managerEmail,
        String managerName,
        String managerProfileImage,
        Parameters parameters,
        Request request,
        List<Response> response
) {
    public record Parameters(
            String authType,
            List<Header> headers,
            List<QueryParameter> queryParameters,
            List<Cookie> cookies
    ) {
        public record Header(
                String headerId,
                String headerKey,
                String headerValue,
                String headerDescription
        ) {}

        public record QueryParameter(
                String queryParameterId,
                String queryParameterKey,
                String queryParameterValue,
                String queryParameterDescription
        ) {}

        public record Cookie(
                String cookieId,
                String cookieKey,
                String cookieValue,
                String cookieDescription
        ) {}
    }

    public record Request(
            BodyType bodyType,
            String none,
            JsonData json,
            List<FormData> formData
    ) {
        public record JsonData(
                String jsonDataId,
                String jsonDataKey,
                String jsonDataValue,
                String jsonDataType,
                String jsonDataDescription
        ) {}

        public record FormData(
                String formDataId,
                String formDataKey,
                String formDataValue,
                String formDataType,
                String formDataDescription
        ) {}
    }

    public record Response(
            String responseId,
            String responseCode,
            String responseDescription,
            String responseContentType,
            String ReponseBodyData
    ) {}
}
