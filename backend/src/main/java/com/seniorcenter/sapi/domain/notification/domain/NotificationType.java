package com.seniorcenter.sapi.domain.notification.domain;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public enum NotificationType {

	API_CONFIRM("API_CONFIRM"),
	API_UPDATE("API_UPDATE"),
	TEST_FAIL("TEST_FAIL"),
	COMMENT_TAG("COMMENT_TAG"),
	WORKSPACE_INVITE("WORKSPACE_INVITE");

	private final String type;
}
