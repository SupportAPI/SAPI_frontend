package com.seniorcenter.sapi.domain.notification.domain;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public enum NotificationMessageBody {

	API_CONFIRM(" API가 확정되었습니다."),
	API_UPDATE(" API가 수정되었습니다."),
	TEST_FAIL(" API 테스트가 실패했습니다."),
	COMMENT_TAG(" API의 댓글에서 호출됐습니다.");

	private final String message;
}
