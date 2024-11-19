package com.seniorcenter.sapi.domain.membership.presentation.dto;

public record Permission(
	Boolean readAuthority,
	Boolean updateAuthority,
	Boolean saveAuthority,
	Boolean deleteAuthority
) {
}
