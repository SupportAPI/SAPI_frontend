package com.seniorcenter.sapi.domain.user.presentation;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.seniorcenter.sapi.domain.user.presentation.dto.response.UserInfoResponseDto;
import com.seniorcenter.sapi.domain.user.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

	private final UserService userService;

	@GetMapping("/{userId}")
	public UserInfoResponseDto getUserInfo(@PathVariable Long userId) {
		return userService.getUserInfo(userId);
	}

}
