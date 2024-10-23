package com.seniorcenter.sapi.global.utils.user;

import com.seniorcenter.sapi.domain.user.domain.User;

public interface UserUtils {

	User getUserById(Long id);
	User getUserFromSecurityContext();
}
