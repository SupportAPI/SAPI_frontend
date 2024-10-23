package com.seniorcenter.sapi.domain.user.presentation;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.seniorcenter.sapi.domain.user.presentation.dto.request.CreateUserRequestDto;
import com.seniorcenter.sapi.domain.user.presentation.dto.request.LoginRequestDto;
import com.seniorcenter.sapi.domain.user.presentation.dto.request.RequestTokenDto;
import com.seniorcenter.sapi.domain.user.presentation.dto.response.UserResponseDto;
import com.seniorcenter.sapi.domain.user.service.AuthService;
import com.seniorcenter.sapi.global.security.jwt.TokenDto;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class AuthController {

	private final AuthService authService;

	@PostMapping
	public ResponseEntity<UserResponseDto> signup(@RequestBody CreateUserRequestDto joinRequest) {
		return ResponseEntity.ok(authService.signup(joinRequest));
	}

	@PostMapping("/login")
	public ResponseEntity<TokenDto> login(@RequestBody LoginRequestDto loginRequest) {
		return ResponseEntity.ok(authService.login(loginRequest));
	}

	@PostMapping("/reissue")
	public ResponseEntity<TokenDto> reissue(@RequestBody RequestTokenDto requestTokenDto) {
		return ResponseEntity.ok(authService.reissue(requestTokenDto));
	}
}
