package com.seniorcenter.sapi.domain.category.domain;

import com.seniorcenter.sapi.domain.workspace.domain.Workspace;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import static jakarta.persistence.FetchType.LAZY;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id", nullable = false)
    private Long id;

    private String name;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "workspace_id")
    private Workspace workspace;

    @Builder
    public Category(String name, Workspace workspace) {
        this.name = name;
        this.workspace = workspace;
    }

    public static Category createCategory(String name, Workspace workspace) {
        return builder()
                .name(name)
                .workspace(workspace)
                .build();
    }

}
