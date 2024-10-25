package com.seniorcenter.sapi.domain.user.presentation.dto.request;

public record VerifyCodeRequestDto(
	String email,
	String code
) {
}
