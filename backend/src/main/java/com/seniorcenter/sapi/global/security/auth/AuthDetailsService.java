package com.seniorcenter.sapi.global.security.auth;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.seniorcenter.sapi.domain.user.domain.User;
import com.seniorcenter.sapi.domain.user.domain.repository.UserRepository;
import com.seniorcenter.sapi.global.error.exception.CustomException;
import com.seniorcenter.sapi.global.error.exception.MainException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Service
@Slf4j
public class AuthDetailsService implements UserDetailsService {

	private final UserRepository userRepository;

	@Override
	public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
		User user =
			userRepository
				.findById(Long.valueOf(userId))
				.orElseThrow(() -> new MainException(CustomException.NOT_FOUND_USER_EXCEPTION));
		return new AuthDetails(user);
	}
}
