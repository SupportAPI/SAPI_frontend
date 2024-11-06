package com.seniorcenter.sapi.domain.user.presentation.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CreateUserRequestDto(
	@NotBlank String email,
	@NotBlank String password,
	@NotBlank String nickname
) {
	public CreateUserRequestDto encodePassword(String encodedPassword) {
		return new CreateUserRequestDto(this.email, encodedPassword, this.nickname);
	}
}

