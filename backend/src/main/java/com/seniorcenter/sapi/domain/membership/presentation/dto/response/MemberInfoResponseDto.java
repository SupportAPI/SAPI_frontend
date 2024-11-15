package com.seniorcenter.sapi.domain.membership.presentation.dto.response;

import com.seniorcenter.sapi.domain.membership.domain.Role;

public record MemberInfoResponseDto(
	Long userId,
	String email,
	String nickname,
	String profileImage,
	Role role
) {
}
