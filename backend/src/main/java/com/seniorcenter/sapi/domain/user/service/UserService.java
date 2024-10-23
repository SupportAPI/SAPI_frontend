package com.seniorcenter.sapi.domain.user.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.seniorcenter.sapi.domain.user.domain.User;
import com.seniorcenter.sapi.domain.user.domain.repository.UserRepository;
import com.seniorcenter.sapi.domain.user.presentation.dto.response.UserInfoResponseDto;
import com.seniorcenter.sapi.global.error.exception.CustomException;
import com.seniorcenter.sapi.global.error.exception.MainException;
import com.seniorcenter.sapi.global.utils.user.UserUtils;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class UserService {

	private final UserRepository userRepository;
	private final UserUtils userUtils;

	public UserInfoResponseDto getUserInfo(Long userId) {
		User user = userUtils.getUserFromSecurityContext();

		if (!user.getId().equals(userId)) {
			throw new MainException(CustomException.ACCESS_DENIED_EXCEPTION);
		}

		return new UserInfoResponseDto(user.getId(), user.getEmail(), user.getNickname(), user.getProfileImage());
	}
}
