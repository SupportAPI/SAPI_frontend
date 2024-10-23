package com.seniorcenter.sapi.global.error.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MainException extends RuntimeException {

	private CustomException customException;
}
