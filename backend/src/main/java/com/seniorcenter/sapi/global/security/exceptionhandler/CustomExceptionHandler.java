package com.seniorcenter.sapi.global.security.exceptionhandler;

import java.io.IOException;
import java.time.LocalDateTime;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.seniorcenter.sapi.global.error.exception.CustomException;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class CustomExceptionHandler implements AuthenticationEntryPoint {

	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response,
		AuthenticationException authException) throws IOException, ServletException {
		CustomException exception = (CustomException)request.getAttribute("exception");
		if (exception == null) {
			log.error(authException.getMessage());
			exception = CustomException.ACCESS_DENIED_EXCEPTION;
		}

		response.setContentType("application/json;charset=UTF-8");
		response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
		response.getWriter().println("{ \"status\" : \"" + exception.getStatus()
			+ "\", \"reason\" : \"" + exception.getReason()
			+ "\", \"timestamp\" : " + LocalDateTime.now()
			+ "}");
	}
}
