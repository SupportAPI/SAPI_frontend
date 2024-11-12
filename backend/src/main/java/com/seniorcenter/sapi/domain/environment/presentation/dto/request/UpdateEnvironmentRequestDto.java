package com.seniorcenter.sapi.domain.environment.presentation.dto.request;

import com.seniorcenter.sapi.domain.environment.domain.EnvironmentType;

public record UpdateEnvironmentRequestDto(
	String variable,
	EnvironmentType type,
	String value,
	String description
) {
}
