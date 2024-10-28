package com.seniorcenter.sapi.domain.membership.domain;

import com.seniorcenter.sapi.domain.user.domain.User;
import com.seniorcenter.sapi.domain.workspace.domain.Workspace;
import com.seniorcenter.sapi.global.database.BaseTimeEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "memberships")
public class Membership extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "workspace_id", nullable = false)
	private Workspace workspace;

	@Column(nullable = false)
	@Enumerated(EnumType.STRING)
	private Role role;

	@Column(nullable = false)
	@Enumerated(EnumType.STRING)
	private InviteStatus inviteStatus;

	@Column(nullable = false)
	private Boolean readAuthority;

	@Column(nullable = false)
	private Boolean updateAuthority;

	@Column(nullable = false)
	private Boolean saveAuthority;

	@Column(nullable = false)
	private Boolean deleteAuthority;

	@Builder
	private Membership(User user, Workspace workspace, Role role, InviteStatus inviteStatus) {
		this.user = user;
		this.workspace = workspace;
		this.role = role;
		this.inviteStatus = inviteStatus;
		this.readAuthority = true;
		this.updateAuthority = false;
		this.saveAuthority = false;
		this.deleteAuthority = false;
	}

	public static Membership createMembership(User user, Workspace workspace, Role role, InviteStatus inviteStatus) {
		return Membership.builder()
			.user(user)
			.workspace(workspace)
			.role(role)
			.inviteStatus(inviteStatus)
			.build();
	}

	public void updateAuthorityForMaintainer() {
		this.readAuthority = true;
		this.updateAuthority = true;
		this.saveAuthority = true;
		this.deleteAuthority = true;
	}

	public void editReadAuthority(boolean readAuthority) {
		this.readAuthority = readAuthority;
	}

	public void editUpdateAuthority(boolean updateAuthority) {
		this.updateAuthority = updateAuthority;
	}

	public void editSaveAuthority(boolean saveAuthority) {
		this.saveAuthority = saveAuthority;
	}

	public void editDeleteAuthority(boolean deleteAuthority) {
		this.deleteAuthority = deleteAuthority;
	}
}
