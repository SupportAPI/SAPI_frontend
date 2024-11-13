package com.seniorcenter.sapi.domain.environment.service;

import java.util.List;
import java.util.UUID;

import com.seniorcenter.sapi.domain.environment.presentation.dto.request.CreateEnvironmentCategoryRequestDto;
import com.seniorcenter.sapi.domain.environment.presentation.dto.request.CreateEnvironmentRequestDto;
import com.seniorcenter.sapi.domain.environment.presentation.dto.request.UpdateEnvironmentCategoryRequestDto;
import com.seniorcenter.sapi.domain.environment.presentation.dto.request.UpdateEnvironmentRequestDto;
import com.seniorcenter.sapi.domain.environment.presentation.dto.response.EnvironmentCategoryResponseDto;
import com.seniorcenter.sapi.domain.environment.presentation.dto.response.EnvironmentDetailResponseDto;
import com.seniorcenter.sapi.domain.environment.presentation.dto.response.EnvironmentListResponseDto;
import com.seniorcenter.sapi.domain.environment.presentation.dto.response.EnvironmentResponseDto;

public interface EnvironmentService {
	EnvironmentCategoryResponseDto createEnvironmentCategory(CreateEnvironmentCategoryRequestDto requestDto);
	List<EnvironmentCategoryResponseDto> getEnvironmentCategories(UUID workspaceId);
	void updateEnvironmentCategory(Long categoryId, UpdateEnvironmentCategoryRequestDto requestDto);
	void deleteEnvironmentCategory(Long categoryId);

	EnvironmentResponseDto createEnvironment(Long categoryId, CreateEnvironmentRequestDto requestDto);
	EnvironmentDetailResponseDto getEnvironmentDetails(Long categoryId);
	List<EnvironmentListResponseDto> getEnvironments(UUID workspaceId);
	void updateEnvironment(Long environmentId, UpdateEnvironmentRequestDto requestDto);
	void deleteEnvironment(Long environmentId);
}
