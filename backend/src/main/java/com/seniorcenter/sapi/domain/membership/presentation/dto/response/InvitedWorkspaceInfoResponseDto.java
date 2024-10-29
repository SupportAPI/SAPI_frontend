package com.seniorcenter.sapi.domain.membership.presentation.dto.response;

import java.util.UUID;

public record InvitedWorkspaceInfoResponseDto(
	Long membershipId,
	UUID workspaceId,
	String projectName,
	String description,
	String mainImage
) {
}
