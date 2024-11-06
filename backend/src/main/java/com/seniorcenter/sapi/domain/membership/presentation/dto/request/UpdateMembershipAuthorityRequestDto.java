package com.seniorcenter.sapi.domain.membership.presentation.dto.request;

import jakarta.validation.constraints.NotNull;

public record UpdateMembershipAuthorityRequestDto(
	@NotNull Boolean readAuthority,
	@NotNull Boolean updateAuthority,
	@NotNull Boolean saveAuthority,
	@NotNull Boolean deleteAuthority
) {
}
