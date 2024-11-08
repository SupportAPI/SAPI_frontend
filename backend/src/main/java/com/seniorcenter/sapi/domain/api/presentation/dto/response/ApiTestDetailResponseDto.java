package com.seniorcenter.sapi.domain.api.presentation.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import com.seniorcenter.sapi.domain.api.domain.enums.BodyType;

public record ApiTestDetailResponseDto(
	String docId,
	String apiId,
	String category,
	String name,
	String method,
	String path,
	String description,
	ApiDetailResponseDto.Parameters parameters,
	ApiDetailResponseDto.Request request,
	List<ApiDetailResponseDto.Response> response,
	LocalDateTime createdDate,
	LocalDateTime lastModifyDate
) {
	public record Parameters(
		String authType,
		List<ApiDetailResponseDto.Parameters.Header> headers,
		List<ApiDetailResponseDto.Parameters.QueryParameter> queryParameters,
		List<ApiDetailResponseDto.Parameters.Cookie> cookies
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
		ApiDetailResponseDto.Request.JsonData json,
		List<ApiDetailResponseDto.Request.FormData> formData
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
