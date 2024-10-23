package com.seniorcenter.sapi.global.utils.user;

import org.springframework.stereotype.Service;

import com.seniorcenter.sapi.domain.user.domain.User;
import com.seniorcenter.sapi.domain.user.domain.repository.UserRepository;
import com.seniorcenter.sapi.global.error.exception.CustomException;
import com.seniorcenter.sapi.global.error.exception.MainException;
import com.seniorcenter.sapi.global.utils.security.SecurityUtils;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class UserUtilsImpl implements UserUtils {

	private final UserRepository userRepository;

	@Override
	public User getUserById(Long id) {
		return userRepository.findById(id).orElseThrow(() -> new MainException(CustomException.NOT_FOUND_USER_EXCEPTION));
	}

	@Override
	public User getUserFromSecurityContext() {
		Long currentUserId = SecurityUtils.getCurrentUserId();
		return getUserById(currentUserId);
	}
}
