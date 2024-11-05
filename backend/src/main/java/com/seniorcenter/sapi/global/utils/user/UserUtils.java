package com.seniorcenter.sapi.global.utils.user;

import com.seniorcenter.sapi.domain.user.domain.User;

import java.security.Principal;

public interface UserUtils {

	User getUserById(Long id);
	User getUserFromSecurityContext();
	User getUserFromSecurityPrincipal(Principal principal);
}
