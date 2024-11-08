package com.seniorcenter.sapi.domain.api.presentation.dto.response;

import com.seniorcenter.sapi.domain.api.domain.enums.BodyType;

import java.time.LocalDateTime;
import java.util.List;

public record ApiDetailResponseDto(
        String docId,
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
        List<Response> response,
        LocalDateTime createdDate,
        LocalDateTime lastModifyDate
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
            JsonData json,
            List<FormData> formData
    ) {
        public record JsonData(
                String jsonDataId,
                String jsonDataValue
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
            String ResponseBodyData
    ) {}
}
