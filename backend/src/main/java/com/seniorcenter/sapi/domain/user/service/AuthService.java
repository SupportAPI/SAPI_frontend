package com.seniorcenter.sapi.domain.user.service;

import com.seniorcenter.sapi.domain.user.presentation.dto.request.CreateUserRequestDto;
import com.seniorcenter.sapi.domain.user.presentation.dto.request.LoginRequestDto;
import com.seniorcenter.sapi.domain.user.presentation.dto.request.RequestTokenDto;
import com.seniorcenter.sapi.domain.user.presentation.dto.response.UserResponseDto;
import com.seniorcenter.sapi.global.security.jwt.TokenDto;

import jakarta.servlet.http.HttpServletResponse;

public interface AuthService {

	UserResponseDto signup(CreateUserRequestDto joinRequest);
	TokenDto login(LoginRequestDto loginRequest, HttpServletResponse response);
	TokenDto reissue(RequestTokenDto requestTokenDto, HttpServletResponse response);
}
