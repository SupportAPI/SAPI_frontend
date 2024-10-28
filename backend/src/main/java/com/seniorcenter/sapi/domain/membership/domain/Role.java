package com.seniorcenter.sapi.domain.membership.domain;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public enum Role {

	MAINTAINER("MAINTAINER"),
	MANAGER("MANAGER"),
	MEMBER("MEMBER");

	private final String role;
}
