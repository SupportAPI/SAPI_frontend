package com.seniorcenter.sapi.global.error.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.seniorcenter.sapi.global.error.ErrorResponse;

import lombok.extern.slf4j.Slf4j;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

	@ExceptionHandler(MainException.class)
	public ResponseEntity<ErrorResponse> handleException(MainException e) {
		CustomException customException = e.getCustomException();

		ErrorResponse errorResponse =
			new ErrorResponse(
				customException.getStatus(),
				customException.getReason());

		log.error("back server - error : {}", e);
		return ResponseEntity.status(HttpStatus.valueOf(customException.getStatus())).body(errorResponse);
	}
}
