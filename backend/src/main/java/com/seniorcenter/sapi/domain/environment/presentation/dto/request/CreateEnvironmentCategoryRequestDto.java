package com.seniorcenter.sapi.domain.environment.presentation.dto.request;

import java.util.UUID;

public record CreateEnvironmentCategoryRequestDto(
	UUID workspaceId,
	String name
) {
}
