package com.seniorcenter.sapi.domain.apitest.presentation.dto.request;

import com.seniorcenter.sapi.domain.api.presentation.dto.ParametersDto;
import com.seniorcenter.sapi.domain.api.presentation.dto.RequestDto;

public record UpdateApiDetailRequestDto(
	ParametersDto parameters,
	RequestDto request
) {
}