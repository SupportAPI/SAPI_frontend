package com.seniorcenter.sapi.domain.environment.domain;

import static jakarta.persistence.FetchType.*;
import static lombok.AccessLevel.*;

import com.seniorcenter.sapi.domain.environment.presentation.dto.request.UpdateEnvironmentRequestDto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = PROTECTED)
@Table(name = "environments")
public class Environment {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = LAZY)
	@JoinColumn(name = "category_id")
	private EnvironmentCategory environmentCategory;

	@Column(nullable = false, unique = true)
	private String variable;

	@Column(nullable = false)
	private EnvironmentType type;

	@Column(nullable = false)
	private String value;

	@Column(nullable = false)
	private String description;

	@Column
	private Integer orderIndex;

	private Environment(EnvironmentCategory environmentCategory, Integer orderIndex) {
		this.environmentCategory = environmentCategory;
		this.variable = " ";
		this.type = EnvironmentType.DEFAULT;
		this.value = "";
		this.description = "";
		this.orderIndex = orderIndex;
	}

	public static Environment createEnvironment(EnvironmentCategory category, Integer orderIndex) {
		return new Environment(category, orderIndex);
	}

	public void updateEnvironment(UpdateEnvironmentRequestDto requestDto) {
		this.variable = requestDto.variable();
		this.type = requestDto.type();
		this.value = requestDto.value();
		this.description = requestDto.description();
		this.orderIndex = requestDto.orderIndex();
	}
}
