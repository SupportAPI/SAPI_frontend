package com.seniorcenter.sapi.domain.user.presentation.dto.request;

import jakarta.validation.constraints.NotBlank;

public record VerifyCodeRequestDto(
	@NotBlank String email,
	@NotBlank String code
) {
}
