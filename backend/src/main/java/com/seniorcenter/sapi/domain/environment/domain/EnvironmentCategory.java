package com.seniorcenter.sapi.domain.environment.domain;

import static jakarta.persistence.FetchType.*;
import static lombok.AccessLevel.*;

import java.util.ArrayList;
import java.util.List;

import com.seniorcenter.sapi.domain.environment.presentation.dto.request.CreateEnvironmentCategoryRequestDto;
import com.seniorcenter.sapi.domain.environment.presentation.dto.request.UpdateEnvironmentCategoryRequestDto;
import com.seniorcenter.sapi.domain.workspace.domain.Workspace;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = PROTECTED)
@Table(name = "environment_categories")
public class EnvironmentCategory {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = LAZY)
	@JoinColumn(name = "workspace_id")
	private Workspace workspace;

	@Column(nullable = false)
	private String name;

	@OneToMany(mappedBy = "environmentCategory", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Environment> environments = new ArrayList<>();

	private EnvironmentCategory(Workspace workspace, String name) {
		this.workspace = workspace;
		this.name = name;
	}

	public static EnvironmentCategory createEnvironmentCategory(Workspace workspace,
		CreateEnvironmentCategoryRequestDto requestDto) {
		return new EnvironmentCategory(workspace, requestDto.name());
	}

	public void updateEnvironmentCategory(UpdateEnvironmentCategoryRequestDto requestDto) {
		this.name = requestDto.name();
	}
}
