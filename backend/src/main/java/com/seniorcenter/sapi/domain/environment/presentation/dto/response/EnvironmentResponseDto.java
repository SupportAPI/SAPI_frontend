package com.seniorcenter.sapi.domain.environment.presentation.dto.response;

import com.seniorcenter.sapi.domain.environment.domain.EnvironmentType;

public record EnvironmentResponseDto(
	Long id,
	String variable,
	EnvironmentType type,
	String value,
	String description
) {
}
