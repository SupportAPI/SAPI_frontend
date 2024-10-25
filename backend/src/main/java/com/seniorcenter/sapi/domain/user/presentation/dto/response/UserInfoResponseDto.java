package com.seniorcenter.sapi.domain.user.presentation.dto.response;

public record UserInfoResponseDto(
	Long userId,
	String email,
	String nickname,
	String profileImage
) {
}
