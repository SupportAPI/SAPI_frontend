package com.seniorcenter.sapi.domain.membership.presentation.dto.response;

public record MemberInfoResponseDto(
	Long userId,
	String email,
	String nickname,
	String profileImage
) {
}
