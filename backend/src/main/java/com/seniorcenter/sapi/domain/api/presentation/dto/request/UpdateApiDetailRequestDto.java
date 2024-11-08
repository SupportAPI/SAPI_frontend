package com.seniorcenter.sapi.domain.api.presentation.dto.request;

import java.util.List;

public record UpdateApiDetailRequestDto(
	UpdateApiDetailRequestDto.Parameters parameters,
	UpdateApiDetailRequestDto.Request request
) {
	public record Parameters(
		List<UpdateApiDetailRequestDto.Parameters.Header> headers,
		List<UpdateApiDetailRequestDto.Parameters.PathVariables> pathVariables,
		List<UpdateApiDetailRequestDto.Parameters.QueryParameter> queryParameters,
		List<UpdateApiDetailRequestDto.Parameters.Cookie> cookies
	) {
		public record Header(
			String headerId,
			String headerValue
		) {}

		public record PathVariables(
			String pathVariableId,
			String pathVariableValue
		) {}

		public record QueryParameter(
			String queryParameterId,
			String queryParameterValue
		) {}

		public record Cookie(
			String cookieId,
			String cookieValue
		) {}
	}

	public record Request(
		UpdateApiDetailRequestDto.Request.JsonData json,
		List<UpdateApiDetailRequestDto.Request.FormData> formData
	) {
		public record JsonData(
			String jsonDataId,
			String jsonDataValue
		) {}

		public record FormData(
			String formDataId,
			String formDataValue
		) {}
	}
}