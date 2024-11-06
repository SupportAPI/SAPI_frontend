package com.seniorcenter.sapi.global.error.exception;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.seniorcenter.sapi.global.error.ErrorResponse;

import jakarta.servlet.http.HttpServletRequest;
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

	@ExceptionHandler(Throwable.class)
	protected ResponseEntity<ErrorResponse> sapiHandleException(Exception e, HttpServletRequest request)
		throws IOException {

		log.error("INTERNAL_SERVER_ERROR", e);
		CustomException internalServerError = CustomException.INTERNAL_SERVER_ERROR;
		ErrorResponse errorResponse =
			new ErrorResponse(
				internalServerError.getStatus(),
				internalServerError.getReason());

		return ResponseEntity.status(HttpStatus.valueOf(internalServerError.getStatus()))
			.body(errorResponse);
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ErrorResponse> handleValidationExceptions(
		MethodArgumentNotValidException ex, HttpServletRequest request) {
		Map<String, String> errors = new HashMap<>();
		ex.getBindingResult().getFieldErrors().forEach(error ->
			errors.put(error.getField(), error.getDefaultMessage())
		);

		log.error("Validation error occurred: {}", errors, ex);

		ErrorResponse errorResponse = new ErrorResponse(
			HttpStatus.BAD_REQUEST.value(),
			HttpStatus.BAD_REQUEST.getReasonPhrase()
		);

		return ResponseEntity.badRequest().body(errorResponse);
	}

	@ExceptionHandler(MissingServletRequestParameterException.class)
	public ResponseEntity<ErrorResponse> handleMissingParams(MissingServletRequestParameterException e) {
		log.error("INTERNAL_SERVER_ERROR", e);
		CustomException internalServerError = CustomException.MISSING_PARAMS;
		ErrorResponse errorResponse =
			new ErrorResponse(
				internalServerError.getStatus(),
				internalServerError.getReason());

		return ResponseEntity.status(HttpStatus.valueOf(internalServerError.getStatus()))
			.body(errorResponse);
	}
}
