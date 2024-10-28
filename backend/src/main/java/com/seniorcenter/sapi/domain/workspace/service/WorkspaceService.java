package com.seniorcenter.sapi.domain.workspace.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.seniorcenter.sapi.domain.workspace.presentation.dto.request.CreateWorkspaceRequestDto;
import com.seniorcenter.sapi.domain.workspace.presentation.dto.request.UpdateWorkspaceRequestDto;
import com.seniorcenter.sapi.domain.workspace.presentation.dto.response.WorkspaceInfoResponseDto;

public interface WorkspaceService {

	void createWorkspace(CreateWorkspaceRequestDto requestDto, MultipartFile mainImage);
	WorkspaceInfoResponseDto getWorkspace(Long workspaceId);
	List<WorkspaceInfoResponseDto> getWorkspaces();
	void updateWorkspace(Long workspaceId, UpdateWorkspaceRequestDto requestDto, MultipartFile mainImage);
	void removeWorkspace(Long workspaceId);
}
