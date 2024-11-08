package com.seniorcenter.sapi.domain.api.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "api_path_variables")
public class ApiPathVariable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "api_id")
	private Api api;

	private String variableKey;
	private String variableValue;
	private String description;

	@Builder
	public ApiPathVariable(Api api, String variableKey, String variableValue, String description) {
		this.api = api;
		this.variableKey = variableKey;
		this.variableValue = variableValue;
		this.description = description;
	}

	public static ApiPathVariable createApiPathVariable(Api api) {
		return ApiPathVariable.builder()
			.api(api)
			.variableKey("")
			.variableValue("")
			.description("")
			.build();
	}

	public static ApiPathVariable copyApiPathVariable(Api api, ApiPathVariable originApiPathVariable) {
		return ApiPathVariable.builder()
			.api(api)
			.variableKey(originApiPathVariable.getVariableKey())
			.variableValue(originApiPathVariable.getVariableValue())
			.description(originApiPathVariable.getDescription())
			.build();
	}

	public void updateApiPathVariableValue(String variableValue) {
		this.variableValue = variableValue;
	}
}
