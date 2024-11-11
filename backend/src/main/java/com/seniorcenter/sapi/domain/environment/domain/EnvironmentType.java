package com.seniorcenter.sapi.domain.environment.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum EnvironmentType {

	DEFAULT("DEFAULT"),
	SECRET("SECRET");

	private final String type;
}
