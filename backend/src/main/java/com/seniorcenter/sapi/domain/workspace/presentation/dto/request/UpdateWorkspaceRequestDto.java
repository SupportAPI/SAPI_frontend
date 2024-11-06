package com.seniorcenter.sapi.domain.workspace.presentation.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpdateWorkspaceRequestDto(
	@NotBlank String projectName,
	@NotBlank String description,
	@NotBlank String domain,
	@NotNull Boolean isCompleted
	) {
}
