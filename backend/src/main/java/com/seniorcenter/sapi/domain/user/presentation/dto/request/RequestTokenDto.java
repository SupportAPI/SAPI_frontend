package com.seniorcenter.sapi.domain.user.presentation.dto.request;

import jakarta.validation.constraints.NotBlank;

public record RequestTokenDto(
	@NotBlank String accessToken,
	@NotBlank String refreshToken
) {}

