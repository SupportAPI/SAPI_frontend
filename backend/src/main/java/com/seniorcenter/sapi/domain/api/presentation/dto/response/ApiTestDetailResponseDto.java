package com.seniorcenter.sapi.domain.api.presentation.dto.response;

import java.util.List;

import com.seniorcenter.sapi.domain.api.domain.enums.BodyType;
import com.seniorcenter.sapi.domain.specification.domain.TestStatus;

public record ApiTestDetailResponseDto(
	String docId,
	String apiId,
	String name,
	String method,
	String path,
	String category,
	TestStatus localStatus,
	TestStatus serverStatus,
	String managerEmail,
	String managerName,
	String managerProfileImage,
	ApiTestDetailResponseDto.Parameters parameters,
	ApiTestDetailResponseDto.Request request
) {
	public record Parameters(
		String authType,
		List<ApiTestDetailResponseDto.Parameters.Header> headers,
		List<ApiTestDetailResponseDto.Parameters.PathVariables> pathVariables,
		List<ApiTestDetailResponseDto.Parameters.QueryParameter> queryParameters,
		List<ApiTestDetailResponseDto.Parameters.Cookie> cookies
	) {
		public record Header(
			String headerId,
			String headerKey,
			String headerValue,
			String headerDescription
		) {}

		public record PathVariables(
			String pathVariableId,
			String pathVariableKey,
			String pathVariableValue,
			String pathVariableDescription
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
		ApiTestDetailResponseDto.Request.JsonData json,
		List<ApiTestDetailResponseDto.Request.FormData> formData
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
}
