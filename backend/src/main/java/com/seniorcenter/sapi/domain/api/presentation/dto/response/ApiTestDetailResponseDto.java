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
		ApiTestDetailResponseDto.Request.JsonData json,
		List<ApiTestDetailResponseDto.Request.FormData> formData
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
}
