package com.seniorcenter.sapi.domain.membership.presentation.dto.request;

import com.seniorcenter.sapi.domain.membership.domain.Role;

import jakarta.validation.constraints.NotNull;

public record UpdateMembershipRoleRequestDto(
	@NotNull Role role
) {
}
