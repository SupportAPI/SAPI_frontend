package com.seniorcenter.sapi.domain.apifile.presentation;

import com.seniorcenter.sapi.domain.workspace.domain.Workspace;
import com.seniorcenter.sapi.global.database.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "api_files")
public class ApiFile extends BaseTimeEntity  {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workspace_id", nullable = false)
    private Workspace workspace;

    @Column(nullable = false)
    private String fileName;

    @Lob
    @Column(nullable = false, columnDefinition = "LONGBLOB")
    private byte[] fileData;

    @Builder
    public ApiFile(Workspace workspace, String fileName, byte[] fileData) {
        this.workspace = workspace;
        this.fileName = fileName;
        this.fileData = fileData;
    }
}

