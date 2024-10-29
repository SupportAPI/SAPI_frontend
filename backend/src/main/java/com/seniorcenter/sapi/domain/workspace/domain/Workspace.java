package com.seniorcenter.sapi.domain.workspace.domain;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.seniorcenter.sapi.domain.membership.domain.Membership;
import com.seniorcenter.sapi.domain.workspace.presentation.dto.request.CreateWorkspaceRequestDto;
import com.seniorcenter.sapi.domain.workspace.presentation.dto.request.UpdateWorkspaceRequestDto;
import com.seniorcenter.sapi.global.database.BaseTimeEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "workspaces")
public class Workspace extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private String id;

	@Column(nullable = false)
	private String projectName;

	@Column(nullable = false)
	private String description;

	@Column(nullable = false)
	private String mainImage;

	@Column(nullable = false)
	private String domain;

	@OneToMany(mappedBy = "workspace", cascade = CascadeType.REMOVE, orphanRemoval = true)
	private List<Membership> memberships = new ArrayList<>();

	@Builder
	private Workspace(String projectName, String description, String mainImage, String domain) {
		this.projectName = projectName;
		this.description = description;
		this.mainImage = mainImage;
		this.domain = domain;
	}

	public static Workspace createWorkspace(CreateWorkspaceRequestDto requestDto, String mainImageUrl) {
		return Workspace.builder()
			.projectName(requestDto.projectName())
			.description(requestDto.description())
			.domain(requestDto.domain())
			.mainImage(mainImageUrl)
			.build();
	}

	public void updateWorkspace(UpdateWorkspaceRequestDto requestDto, String mainImage) {
		this.projectName = requestDto.projectName();
		this.description = requestDto.description();
		this.domain = requestDto.domain();
		this.mainImage = mainImage;
	}
}
