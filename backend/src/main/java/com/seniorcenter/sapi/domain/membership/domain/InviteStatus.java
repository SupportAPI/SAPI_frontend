package com.seniorcenter.sapi.domain.membership.domain;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public enum InviteStatus {

	PENDING("PENDING"),
	ACCEPTED("ACCEPTED");

	private final String status;

}
