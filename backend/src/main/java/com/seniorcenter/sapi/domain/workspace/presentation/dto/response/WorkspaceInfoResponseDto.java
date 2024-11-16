package com.seniorcenter.sapi.domain.workspace.presentation.dto.response;

import java.util.UUID;

public record WorkspaceInfoResponseDto(
	UUID id,
	String projectName,
	String description,
	String mainImage,
	String domain,
	Boolean isCompleted,
	Integer connectedUserCount
) {
}
