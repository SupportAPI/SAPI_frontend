package com.seniorcenter.sapi.domain.environment.presentation.dto.response;

import java.util.List;

public record EnvironmentDetailResponseDto(
	Long categoryId,
	String categoryName,
	List<EnvironmentResponseDto> environments
) {
}
