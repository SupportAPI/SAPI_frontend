package com.seniorcenter.sapi.global.error.exception;

import com.seniorcenter.sapi.global.error.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(MainException.class)
    public ResponseEntity<ErrorResponse> handleException(MainException e) {
        CustomException customException = e.getCustomException();

        ErrorResponse errorResponse =
            new ErrorResponse(customException);

        log.error("back server - error : {}", e);
        return ResponseEntity.status(HttpStatus.valueOf(customException.getStatus())).body(errorResponse);
    }

    @ExceptionHandler(Throwable.class)
    protected ResponseEntity<ErrorResponse> sapiHandleException(Exception e, HttpServletRequest request) {
        log.error("INTERNAL_SERVER_ERROR", e);

        CustomException internalServerError = CustomException.INTERNAL_SERVER_ERROR;
        ErrorResponse errorResponse =
            new ErrorResponse(internalServerError);

        return ResponseEntity.status(HttpStatus.valueOf(internalServerError.getStatus()))
            .body(errorResponse);
    }


    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    protected ResponseEntity<ErrorResponse> handleMethodArgumentTypeMismatchException(Exception e, HttpServletRequest request) {
        log.error(e.getLocalizedMessage(), e);

        CustomException customException = CustomException.INVALID_ADDRESS;
        ErrorResponse errorResponse =
            new ErrorResponse(customException);

        return ResponseEntity.status(HttpStatus.valueOf(customException.getStatus()))
            .body(errorResponse);
    }
}
