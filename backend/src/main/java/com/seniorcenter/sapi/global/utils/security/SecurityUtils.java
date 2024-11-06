package com.seniorcenter.sapi.global.utils.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.seniorcenter.sapi.global.error.exception.CustomException;
import com.seniorcenter.sapi.global.error.exception.MainException;

public class SecurityUtils {

	public static Long getCurrentUserId() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null) {
			throw new MainException(CustomException.NOT_FOUND_USER_EXCEPTION);
		}
		return Long.valueOf(authentication.getName());
	}
}
