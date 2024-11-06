package com.seniorcenter.sapi.domain.user.service;

import java.util.List;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import com.seniorcenter.sapi.domain.user.presentation.dto.request.NewPasswordRequestDto;
import com.seniorcenter.sapi.domain.user.presentation.dto.request.SendCodeRequestDto;
import com.seniorcenter.sapi.domain.user.presentation.dto.request.UpdateUserRequestDto;
import com.seniorcenter.sapi.domain.user.presentation.dto.request.VerifyCodeRequestDto;
import com.seniorcenter.sapi.domain.user.presentation.dto.response.UserInfoResponseDto;

public interface UserService {

	UserInfoResponseDto getUserInfo(Long userId);
	UserInfoResponseDto getUserInfoByEmail(String email);
	boolean checkDuplicateEmail(String email);
	void sendEmailCode(SendCodeRequestDto sendCodeRequestDto);
	void verifyEmailCode(VerifyCodeRequestDto verifyCodeRequestDto);
	void updatePassword(Long userId, NewPasswordRequestDto newPasswordRequestDto);
	void updateUserInfo(Long userId, UpdateUserRequestDto userInfoResponseDto, MultipartFile profileImage);
	void resignUser(Long userId);
	List<UserInfoResponseDto> searchUsersNotInWorkspaceWithEmail(UUID workspaceId, String emailValue);
	List<UserInfoResponseDto> searchUserInWorkspaceWithNickname(UUID workspaceId, String emailValue);
}
