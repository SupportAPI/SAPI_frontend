package com.seniorcenter.sapi.domain.environment.presentation;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.seniorcenter.sapi.domain.environment.presentation.dto.request.CreateEnvironmentCategoryRequestDto;
import com.seniorcenter.sapi.domain.environment.presentation.dto.request.UpdateEnvironmentCategoryRequestDto;
import com.seniorcenter.sapi.domain.environment.presentation.dto.request.UpdateEnvironmentRequestDto;
import com.seniorcenter.sapi.domain.environment.presentation.dto.response.EnvironmentCategoryResponseDto;
import com.seniorcenter.sapi.domain.environment.presentation.dto.response.EnvironmentListResponseDto;
import com.seniorcenter.sapi.domain.environment.presentation.dto.response.EnvironmentResponseDto;
import com.seniorcenter.sapi.domain.environment.service.EnvironmentService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/environment-categories")
@RestController
public class EnvironmentController {

	private final EnvironmentService environmentService;

	@PostMapping
	public EnvironmentCategoryResponseDto createEnvironmentCategory(
		@RequestBody CreateEnvironmentCategoryRequestDto requestDto) {
		return environmentService.createEnvironmentCategory(requestDto);
	}

	@PatchMapping("/{categoryId}")
	public void updateEnvironmentCategory(@PathVariable Long categoryId,
		@RequestBody UpdateEnvironmentCategoryRequestDto requestDto) {
		environmentService.updateEnvironmentCategory(categoryId, requestDto);
	}

	@DeleteMapping("/{categoryId}")
	public void deleteEnvironmentCategory(@PathVariable Long categoryId) {
		environmentService.deleteEnvironmentCategory(categoryId);
	}

	@PostMapping("/{categoryId}/environments")
	public EnvironmentResponseDto createEnvironment(@PathVariable Long categoryId) {
		return environmentService.createEnvironment(categoryId);
	}

	@GetMapping
	public List<EnvironmentListResponseDto> getEnvironments(@RequestParam UUID workspaceId) {
		return environmentService.getEnvironments(workspaceId);
	}

	@PatchMapping("/{categoryId}/environments/{environmentId}")
	public void updateEnvironment(@PathVariable Long environmentId,
		@RequestBody UpdateEnvironmentRequestDto requestDto) {
		environmentService.updateEnvironment(environmentId, requestDto);
	}

	@DeleteMapping("/{categoryId}/environments/{environmentId}")
	public void deleteEnvironment(@PathVariable Long environmentId) {
		environmentService.deleteEnvironment(environmentId);
	}
}
