package com.seniorcenter.sapi.domain.workspace.domain.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.seniorcenter.sapi.domain.workspace.domain.Workspace;

public interface WorkspaceRepository extends JpaRepository<Workspace, UUID> {
}
