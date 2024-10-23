package com.seniorcenter.sapi.domain.user.presentation.dto.request;

public record RequestTokenDto(
	String accessToken,
	String refreshToken
) {}

