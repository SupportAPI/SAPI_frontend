package com.seniorcenter.sapi.domain.workspace.service;

import java.util.List;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import com.seniorcenter.sapi.domain.workspace.presentation.dto.request.CreateWorkspaceRequestDto;
import com.seniorcenter.sapi.domain.workspace.presentation.dto.request.UpdateWorkspaceRequestDto;
import com.seniorcenter.sapi.domain.workspace.presentation.dto.response.WorkspaceInfoResponseDto;

public interface WorkspaceService {

	WorkspaceInfoResponseDto createWorkspace(CreateWorkspaceRequestDto requestDto, MultipartFile mainImage);
	WorkspaceInfoResponseDto getWorkspace(UUID workspaceId);
	List<WorkspaceInfoResponseDto> getWorkspaces();
	void updateWorkspace(UUID workspaceId, UpdateWorkspaceRequestDto requestDto, MultipartFile mainImage);
	void removeWorkspace(UUID workspaceId);
}
