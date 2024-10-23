package com.seniorcenter.sapi.global.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**")
			.allowedOrigins("https://k11b305.p.ssafy.io/", "http://localhost:5173")
			.allowedMethods(
				HttpMethod.GET.name(),
				HttpMethod.POST.name(),
				HttpMethod.PUT.name(),
				HttpMethod.DELETE.name(),
				HttpMethod.PATCH.name()
			)
			.allowCredentials(true)
			.exposedHeaders("*");
	}
}
