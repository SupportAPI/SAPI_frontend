package com.seniorcenter.sapi.global.error;

import java.time.LocalDateTime;

import lombok.Getter;

@Getter
public class ErrorResponse {

	private final int status;
	private final String reason;
	private final LocalDateTime timeStamp;


	public ErrorResponse(int status, String reason) {
		this.status = status;
		this.reason = reason;
		this.timeStamp = LocalDateTime.now();
	}
}