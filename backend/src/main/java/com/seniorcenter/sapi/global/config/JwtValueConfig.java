package com.seniorcenter.sapi.global.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;

@Configuration
@Getter
public class JwtValueConfig {

	@Value("${jwt.secret}")
	private String secretKey;

	@Value("${jwt.access-token-expire}")
	private String accessTokenExpire;
}
