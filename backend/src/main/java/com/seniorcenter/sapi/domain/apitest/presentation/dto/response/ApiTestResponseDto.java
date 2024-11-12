package com.seniorcenter.sapi.domain.apitest.presentation.dto.response;

import java.util.UUID;

import com.seniorcenter.sapi.domain.api.domain.enums.HttpMethod;
import com.seniorcenter.sapi.domain.specification.domain.TestStatus;

public record ApiTestResponseDto(
	UUID id,
	String category,
	String name,
	HttpMethod method,
	String path,
	String description,
	String managerName,
	TestStatus localTest,
	TestStatus serverTest
) {
}
