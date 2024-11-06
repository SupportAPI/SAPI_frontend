package com.seniorcenter.sapi.global.response;

import java.time.LocalDateTime;

import lombok.Getter;

@Getter
public class SuccessResponse {

	private final boolean success = true;
	private final int status;
	private final Object data;
	private final LocalDateTime timestamp;

	public SuccessResponse(int status, Object data) {
		this.status = status;
		this.data = data;
		this.timestamp = LocalDateTime.now();
	}
}
