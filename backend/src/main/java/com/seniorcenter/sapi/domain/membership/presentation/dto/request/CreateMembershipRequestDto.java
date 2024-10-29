package com.seniorcenter.sapi.domain.membership.presentation.dto.request;

import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.NotNull;

public record CreateMembershipRequestDto(
	@NotNull List<Long> userIds,
	@NotNull UUID workspaceId
) {
}
