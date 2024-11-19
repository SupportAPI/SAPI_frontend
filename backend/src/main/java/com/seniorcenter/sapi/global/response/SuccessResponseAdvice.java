package com.seniorcenter.sapi.global.response;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.seniorcenter.sapi.global.annotation.ExcludeFromAdvice;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;


@RestControllerAdvice(basePackages = "com.seniorcenter.sapi")
public class SuccessResponseAdvice implements ResponseBodyAdvice {

	ObjectMapper objectMapper = new ObjectMapper()
			.registerModule(new JavaTimeModule())
			.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    @Override
    public boolean supports(MethodParameter returnType, Class converterType) {
        // ExcludeFromAdvice 어노테이션이 있는 경우 Advice를 적용하지 않음
        return !returnType.getContainingClass().isAnnotationPresent(ExcludeFromAdvice.class)
            && !returnType.getMethod().isAnnotationPresent(ExcludeFromAdvice.class);

    }

	@Override
	public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType, Class selectedConverterType, ServerHttpRequest request, ServerHttpResponse response) {
		HttpServletResponse servletResponse = ((ServletServerHttpResponse) response).getServletResponse();
		int status = servletResponse.getStatus();
		HttpStatus resolve = HttpStatus.resolve(status);

		if (resolve == null) {
			return body;
		}

        // byte[] 타입은 SuccessResponse로 래핑하지 않고 그대로 반환
        if (body instanceof byte[]) {
            return body;
        }

		if (body instanceof String) {
            try {
				response.getHeaders().setContentType(MediaType.APPLICATION_JSON);
				return objectMapper.writeValueAsString(new SuccessResponse(status, body));
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        }

		if (resolve.is2xxSuccessful()) {
			return new SuccessResponse(status, body);
		}

		return body;
	}

}
