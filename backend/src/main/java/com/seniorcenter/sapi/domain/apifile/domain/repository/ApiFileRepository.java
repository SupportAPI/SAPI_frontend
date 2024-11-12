package com.seniorcenter.sapi.domain.apifile.domain.repository;

import com.seniorcenter.sapi.domain.apifile.presentation.ApiFile;
import com.seniorcenter.sapi.domain.workspace.domain.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApiFileRepository extends JpaRepository<ApiFile, Long> {
    List<ApiFile> findByWorkspace(Workspace workspace);
}
