package com.seniorcenter.sapi.domain.apitest.presentation.dto.response;

import com.seniorcenter.sapi.domain.api.presentation.dto.ParametersDto;
import com.seniorcenter.sapi.domain.api.presentation.dto.RequestDto;
import com.seniorcenter.sapi.domain.specification.domain.TestStatus;

public record ApiTestDetailResponseDto(
    String doamin,
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
	ParametersDto parameters,
	RequestDto request
) {
}
