package com.seniorcenter.sapi.domain.workspace.presentation.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateWorkspaceRequestDto(
	@NotBlank @Size(max = 30) String projectName,
	@NotBlank @Size(max = 255) String description,
	@NotBlank @Size(max = 255) String domain
) {
}
