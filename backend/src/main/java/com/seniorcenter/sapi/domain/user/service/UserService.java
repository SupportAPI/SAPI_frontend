package com.seniorcenter.sapi.domain.user.service;

import com.seniorcenter.sapi.domain.user.presentation.dto.request.NewPasswordRequestDto;
import com.seniorcenter.sapi.domain.user.presentation.dto.request.SendCodeRequestDto;
import com.seniorcenter.sapi.domain.user.presentation.dto.request.VerifyCodeRequestDto;
import com.seniorcenter.sapi.domain.user.presentation.dto.response.UserInfoResponseDto;

public interface UserService {

	UserInfoResponseDto getUserInfo(Long userId);
	boolean checkDuplicateEmail(String email);
	void sendEmailCode(SendCodeRequestDto sendCodeRequestDto);
	void verifyEmailCode(VerifyCodeRequestDto verifyCodeRequestDto);
	void updatePassword(Long userId, NewPasswordRequestDto newPasswordRequestDto);
}
