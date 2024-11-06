package com.seniorcenter.sapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class SapiApplication {

	public static void main(String[] args) {
		SpringApplication.run(SapiApplication.class, args);
	}

}
