package com.seniorcenter.sapi.domain.workspace.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.seniorcenter.sapi.domain.workspace.domain.Workspace;

public interface WorkSpaceRepository extends JpaRepository<Workspace, Long> {
}
