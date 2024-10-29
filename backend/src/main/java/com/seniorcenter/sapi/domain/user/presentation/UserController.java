package com.seniorcenter.sapi.domain.user.presentation;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.seniorcenter.sapi.domain.user.presentation.dto.request.CreateUserRequestDto;
import com.seniorcenter.sapi.domain.user.presentation.dto.request.LoginRequestDto;
import com.seniorcenter.sapi.domain.user.presentation.dto.request.NewPasswordRequestDto;
import com.seniorcenter.sapi.domain.user.presentation.dto.request.RequestTokenDto;
import com.seniorcenter.sapi.domain.user.presentation.dto.request.SendCodeRequestDto;
import com.seniorcenter.sapi.domain.user.presentation.dto.request.UpdateUserRequestDto;
import com.seniorcenter.sapi.domain.user.presentation.dto.request.VerifyCodeRequestDto;
import com.seniorcenter.sapi.domain.user.presentation.dto.response.UserInfoResponseDto;
import com.seniorcenter.sapi.domain.user.presentation.dto.response.UserResponseDto;
import com.seniorcenter.sapi.domain.user.service.AuthService;
import com.seniorcenter.sapi.domain.user.service.UserService;
import com.seniorcenter.sapi.global.security.jwt.TokenDto;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

	private final UserService userService;
	private final AuthService authService;

	@PostMapping
	public ResponseEntity<UserResponseDto> signup(@RequestBody CreateUserRequestDto joinRequest) {
		return ResponseEntity.ok(authService.signup(joinRequest));
	}

	@GetMapping("/check-email-duplicate")
	public boolean checkDuplicateEmail(@RequestParam String email) {
		return userService.checkDuplicateEmail(email);
	}

	@PostMapping("/send-code")
	public void sendEmailCode(@RequestBody SendCodeRequestDto sendCodeRequestDto) {
		userService.sendEmailCode(sendCodeRequestDto);
	}

	@PostMapping("/verify-code")
	public void verifyEmailCode(@RequestBody VerifyCodeRequestDto verifyCodeRequestDto) {
		userService.verifyEmailCode(verifyCodeRequestDto);
	}

	@PostMapping("/login")
	public ResponseEntity<TokenDto> login(@RequestBody LoginRequestDto loginRequest, HttpServletResponse response) {
		return ResponseEntity.ok(authService.login(loginRequest, response));
	}

	@PostMapping("/reissue")
	public ResponseEntity<TokenDto> reissue(@RequestBody RequestTokenDto requestTokenDto, HttpServletResponse response) {
		return ResponseEntity.ok(authService.reissue(requestTokenDto, response));
	}

	@GetMapping("/{userId}")
	public UserInfoResponseDto getUserInfo(@PathVariable Long userId) {
		return userService.getUserInfo(userId);
	}

	@GetMapping()
	public UserInfoResponseDto getUserInfoByEmail(@RequestParam String email) {
		return userService.getUserInfoByEmail(email);
	}

	@PostMapping("/{userId}/send-temp-password")
	public void changePassword(@PathVariable Long userId, @RequestBody NewPasswordRequestDto newPasswordRequestDto) {
		userService.updatePassword(userId, newPasswordRequestDto);
	}

	@PatchMapping("/{userId}")
	public void updateUserInfo(@PathVariable Long userId,
		@RequestPart(name = "requestDto") @Valid UpdateUserRequestDto requestDto,
		@RequestPart(name = "profileImage") MultipartFile profileImage) {
		userService.updateUserInfo(userId, requestDto, profileImage);
	}

	@DeleteMapping("/{userId}")
	public void resignUser(@PathVariable Long userId) {
		userService.resignUser(userId);
	}

}
