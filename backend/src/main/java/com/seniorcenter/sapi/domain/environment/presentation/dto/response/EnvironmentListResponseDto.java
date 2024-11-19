package com.seniorcenter.sapi.domain.environment.presentation.dto.response;

import java.util.List;

import com.seniorcenter.sapi.domain.environment.domain.EnvironmentType;

public record EnvironmentListResponseDto(
	Long categoryId,
	String categoryName,
	List<EnvironmentDto> environments
) {
	public record EnvironmentDto(
		Long environmentId,
		String variable,
		EnvironmentType type,
		String value,
		String description,
		Integer orderIndex
	) {}
}
