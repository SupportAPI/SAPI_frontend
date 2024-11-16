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

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Color color;

    @Builder
    private Membership(User user, Workspace workspace, Role role, InviteStatus inviteStatus, Color color) {
        this.user = user;
        this.workspace = workspace;
        this.role = role;
        this.inviteStatus = inviteStatus;
        this.readAuthority = true;
        this.updateAuthority = false;
        this.saveAuthority = false;
        this.deleteAuthority = false;
        this.color = color;
    }

    public static Membership createMembership(User user, Workspace workspace, Role role, InviteStatus inviteStatus, Color color) {
        return Membership.builder()
                .user(user)
                .workspace(workspace)
                .role(role)
                .inviteStatus(inviteStatus)
                .color(color)
                .build();
    }

    public void updateAuthorityForMaintainer() {
        this.readAuthority = true;
        this.updateAuthority = true;
        this.saveAuthority = true;
        this.deleteAuthority = true;
    }

    public void acceptInvite() {
        this.inviteStatus = InviteStatus.ACCEPTED;
    }

    public void updateRole(Role role) {
        this.role = role;
    }

    public void updateAuthority(boolean readAuthority, boolean updateAuthority, boolean saveAuthority,
                                boolean deleteAuthority) {
        this.readAuthority = readAuthority;
        this.updateAuthority = updateAuthority;
        this.saveAuthority = saveAuthority;
        this.deleteAuthority = deleteAuthority;
    }

    public void updateColor(Color color) {
        this.color = color;
    }
}
