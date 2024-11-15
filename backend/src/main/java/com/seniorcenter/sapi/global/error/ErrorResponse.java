package com.seniorcenter.sapi.global.error;

import java.time.LocalDateTime;

import com.seniorcenter.sapi.global.error.exception.CustomException;
import lombok.Getter;

@Getter
public class ErrorResponse {

	private final int status;
	private final String reason;
	private final String code;

	private final LocalDateTime timeStamp;


	public ErrorResponse(CustomException customException) {
		this.status = customException.getStatus();
        this.code = customException.name();
		this.reason = customException.getReason();
		this.timeStamp = LocalDateTime.now();
	}
}