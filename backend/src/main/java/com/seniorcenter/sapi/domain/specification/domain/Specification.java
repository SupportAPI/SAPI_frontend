package com.seniorcenter.sapi.domain.specification.domain;

import com.seniorcenter.sapi.domain.api.domain.Api;
import com.seniorcenter.sapi.domain.comment.domain.Comment;
import com.seniorcenter.sapi.domain.user.domain.User;
import com.seniorcenter.sapi.domain.workspace.domain.Workspace;
import com.seniorcenter.sapi.global.database.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static jakarta.persistence.FetchType.LAZY;
import static lombok.AccessLevel.PROTECTED;

@Entity
@Getter
@NoArgsConstructor(access = PROTECTED)
@Table(name = "specifications")
public class Specification extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Enumerated(EnumType.STRING)
    private TestStatus localStatus;

    @Enumerated(EnumType.STRING)
    private TestStatus serverStatus;

    private UUID confirmedApiId;

    private String apiGatewayId;

    private Long confirmUserId;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "workspace_id")
    private Workspace workspace;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "manager_id")
    private User manager;

    @OneToMany(mappedBy = "specification", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Api> apis = new ArrayList<>();

    @OneToMany(mappedBy = "specification", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    @Builder
    public Specification(UUID confirmedApiId, Workspace workspace) {
        this.localStatus = TestStatus.PENDING;
        this.serverStatus = TestStatus.PENDING;
        this.confirmedApiId = null;
        this.apiGatewayId = "";

        this.workspace = workspace;
    }

    public static Specification createSpecification(Workspace workspace) {
        return builder()
            .workspace(workspace)
            .build();
    }

    public void updateManager(User manager) {
        this.manager = manager;
    }

    public void updateConfirmedApiId(UUID confirmedApiId, Long confirmUserId) {
        this.confirmedApiId = confirmedApiId;
        this.confirmUserId = confirmUserId;
    }

    public void updateApiGatewayId(String apiGatewayId) {
        this.apiGatewayId = apiGatewayId;
    }

    public void updateTestStatus(String testType, TestStatus testStatus) {
        if (testType.equalsIgnoreCase("LOCAL"))
            this.localStatus = testStatus;
        if (testType.equalsIgnoreCase("SERVER")) {
            this.serverStatus = testStatus;
        }
    }
}
