package com.seniorcenter.sapi.domain.workspace.presentation;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.seniorcenter.sapi.domain.workspace.presentation.dto.request.CreateWorkspaceRequestDto;
import com.seniorcenter.sapi.domain.workspace.presentation.dto.request.UpdateWorkspaceRequestDto;
import com.seniorcenter.sapi.domain.workspace.presentation.dto.response.WorkspaceInfoResponseDto;
import com.seniorcenter.sapi.domain.workspace.service.WorkspaceService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/workspaces")
@RequiredArgsConstructor
public class WorkspaceController {

	private final WorkspaceService workspaceService;

	@PostMapping
	public WorkspaceInfoResponseDto createWorkspace(@RequestPart("requestDto") CreateWorkspaceRequestDto requestDto,
		@RequestPart(value = "mainImage", required = false) MultipartFile mainImage) {
		return workspaceService.createWorkspace(requestDto, mainImage);
	}

	@GetMapping("/{workspaceId}")
	public WorkspaceInfoResponseDto getWorkspace(@PathVariable UUID workspaceId) {
		return workspaceService.getWorkspace(workspaceId);
	}

	@GetMapping
	public List<WorkspaceInfoResponseDto> getWorkspaces() {
		return workspaceService.getWorkspaces();
	}

	@PatchMapping("/{workspaceId}")
	public void updateWorkspace(@PathVariable UUID workspaceId,
		@RequestPart("requestDto") UpdateWorkspaceRequestDto requestDto,
		@RequestPart(value = "mainImage", required = false) MultipartFile mainImage) {
		workspaceService.updateWorkspace(workspaceId, requestDto, mainImage);
	}

	@DeleteMapping("/{workspaceId}")
	public void removeWorkspace(@PathVariable UUID workspaceId) {
		workspaceService.removeWorkspace(workspaceId);
	}
}
