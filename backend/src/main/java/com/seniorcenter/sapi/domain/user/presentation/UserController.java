package com.seniorcenter.sapi.domain.user.presentation;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.seniorcenter.sapi.domain.user.presentation.dto.request.CreateUserRequestDto;
import com.seniorcenter.sapi.domain.user.presentation.dto.request.LoginRequestDto;
import com.seniorcenter.sapi.domain.user.presentation.dto.request.NewPasswordRequestDto;
import com.seniorcenter.sapi.domain.user.presentation.dto.request.RequestTokenDto;
import com.seniorcenter.sapi.domain.user.presentation.dto.request.SendCodeRequestDto;
import com.seniorcenter.sapi.domain.user.presentation.dto.request.VerifyCodeRequestDto;
import com.seniorcenter.sapi.domain.user.presentation.dto.response.UserInfoResponseDto;
import com.seniorcenter.sapi.domain.user.presentation.dto.response.UserResponseDto;
import com.seniorcenter.sapi.domain.user.service.AuthServiceImpl;
import com.seniorcenter.sapi.domain.user.service.UserServiceImpl;
import com.seniorcenter.sapi.global.security.jwt.TokenDto;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

	private final UserServiceImpl userServiceImpl;
	private final AuthServiceImpl authServiceImpl;

	@PostMapping
	public ResponseEntity<UserResponseDto> signup(@RequestBody CreateUserRequestDto joinRequest) {
		return ResponseEntity.ok(authServiceImpl.signup(joinRequest));
	}

	@GetMapping("/check-email-duplicate")
	public boolean checkDuplicateEmail(@RequestParam String email) {
		return userServiceImpl.checkDuplicateEmail(email);
	}

	@PostMapping("/send-code")
	public void sendEmailCode(@RequestBody SendCodeRequestDto sendCodeRequestDto) {
		userServiceImpl.sendEmailCode(sendCodeRequestDto);
	}

	@PostMapping("/verify-code")
	public void verifyEmailCode(@RequestBody VerifyCodeRequestDto verifyCodeRequestDto) {
		userServiceImpl.verifyEmailCode(verifyCodeRequestDto);
	}

	@PostMapping("/login")
	public ResponseEntity<TokenDto> login(@RequestBody LoginRequestDto loginRequest, HttpServletResponse response) {
		return ResponseEntity.ok(authServiceImpl.login(loginRequest, response));
	}

	@PostMapping("/reissue")
	public ResponseEntity<TokenDto> reissue(@RequestBody RequestTokenDto requestTokenDto, HttpServletResponse response) {
		return ResponseEntity.ok(authServiceImpl.reissue(requestTokenDto, response));
	}

	@GetMapping("/{userId}")
	public UserInfoResponseDto getUserInfo(@PathVariable Long userId) {
		return userServiceImpl.getUserInfo(userId);
	}

	@PostMapping("/{userId}/send-temp-password")
	public void changePassword(@PathVariable Long userId, @RequestBody NewPasswordRequestDto newPasswordRequestDto) {
		userServiceImpl.updatePassword(userId, newPasswordRequestDto);
	}

}
