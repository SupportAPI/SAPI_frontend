package com.seniorcenter.sapi.domain.workspace.presentation.dto.response;

public record WorkspaceInfoResponseDto(
	Long id,
	String projectName,
	String description,
	String mainImage,
	String domain,
	String uuid
) {
}
