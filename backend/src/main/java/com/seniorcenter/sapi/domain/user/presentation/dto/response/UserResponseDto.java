package com.seniorcenter.sapi.domain.user.presentation.dto.response;

public record UserResponseDto(
	Long userId,
	String email,
	String nickname,
	String profileImage
) {}

