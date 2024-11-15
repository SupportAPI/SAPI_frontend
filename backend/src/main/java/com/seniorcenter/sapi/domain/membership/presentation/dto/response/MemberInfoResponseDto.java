package com.seniorcenter.sapi.domain.membership.presentation.dto.response;

import com.seniorcenter.sapi.domain.membership.domain.Role;
import com.seniorcenter.sapi.domain.membership.presentation.dto.Permission;

public record MemberInfoResponseDto(
	Long membershipId,
	Long userId,
	String email,
	String nickname,
	String profileImage,
	Role role,
	Permission permission
) {
}
