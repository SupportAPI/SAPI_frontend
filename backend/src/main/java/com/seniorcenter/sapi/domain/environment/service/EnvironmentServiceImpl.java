package com.seniorcenter.sapi.domain.environment.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.seniorcenter.sapi.domain.environment.domain.Environment;
import com.seniorcenter.sapi.domain.environment.domain.EnvironmentCategory;
import com.seniorcenter.sapi.domain.environment.domain.repository.EnvironmentCategoryRepository;
import com.seniorcenter.sapi.domain.environment.domain.repository.EnvironmentRepository;
import com.seniorcenter.sapi.domain.environment.presentation.dto.request.CreateEnvironmentCategoryRequestDto;
import com.seniorcenter.sapi.domain.environment.presentation.dto.request.CreateEnvironmentRequestDto;
import com.seniorcenter.sapi.domain.environment.presentation.dto.request.UpdateEnvironmentCategoryRequestDto;
import com.seniorcenter.sapi.domain.environment.presentation.dto.request.UpdateEnvironmentRequestDto;
import com.seniorcenter.sapi.domain.environment.presentation.dto.response.EnvironmentCategoryResponseDto;
import com.seniorcenter.sapi.domain.environment.presentation.dto.response.EnvironmentDetailResponseDto;
import com.seniorcenter.sapi.domain.environment.presentation.dto.response.EnvironmentListResponseDto;
import com.seniorcenter.sapi.domain.environment.presentation.dto.response.EnvironmentResponseDto;
import com.seniorcenter.sapi.domain.workspace.domain.Workspace;
import com.seniorcenter.sapi.domain.workspace.domain.repository.WorkspaceRepository;
import com.seniorcenter.sapi.global.error.exception.CustomException;
import com.seniorcenter.sapi.global.error.exception.MainException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EnvironmentServiceImpl implements EnvironmentService {

	private final EnvironmentRepository environmentRepository;
	private final EnvironmentCategoryRepository environmentCategoryRepository;
	private final WorkspaceRepository workspaceRepository;

	@Transactional
	@Override
	public EnvironmentCategoryResponseDto createEnvironmentCategory(CreateEnvironmentCategoryRequestDto requestDto) {
		Workspace workspace = workspaceRepository.findById(requestDto.workspaceId())
			.orElseThrow(() -> new MainException(CustomException.NOT_FOUND_WORKSPACE));
		EnvironmentCategory category = EnvironmentCategory.createEnvironmentCategory(workspace, requestDto);
		environmentCategoryRepository.save(category);
		return new EnvironmentCategoryResponseDto(category.getId(), category.getName());
	}

	@Override
	public List<EnvironmentCategoryResponseDto> getEnvironmentCategories(UUID workspaceId) {
		List<EnvironmentCategory> categories = environmentCategoryRepository.findByWorkspaceId(workspaceId);
		return categories.stream()
			.map(category -> new EnvironmentCategoryResponseDto(category.getId(), category.getName()))
			.toList();
	}

	@Transactional
	@Override
	public void updateEnvironmentCategory(Long categoryId, UpdateEnvironmentCategoryRequestDto requestDto) {
		EnvironmentCategory category = environmentCategoryRepository.findById(categoryId)
			.orElseThrow(() -> new MainException(CustomException.NOT_FOUND_ENVIRONMENT_CATEGORY));
		category.updateEnvironmentCategory(requestDto);
	}

	@Transactional
	@Override
	public void deleteEnvironmentCategory(Long categoryId) {
		EnvironmentCategory environmentCategory = environmentCategoryRepository.findById(categoryId)
				.orElseThrow(() -> new MainException(CustomException.NOT_FOUND_ENVIRONMENT_CATEGORY));

		if (environmentCategory.getName().equals("Local"))
			throw new MainException(CustomException.IMPOSSIBLE_REMOVE_LOCAL_ENVIRONMENT_CATEGORY);

		environmentCategoryRepository.deleteById(categoryId);
	}

	@Transactional
	@Override
	public EnvironmentResponseDto createEnvironment(Long categoryId, CreateEnvironmentRequestDto requestDto) {
		EnvironmentCategory category = environmentCategoryRepository.findById(categoryId)
			.orElseThrow(() -> new MainException(CustomException.NOT_FOUND_ENVIRONMENT_CATEGORY));

		Environment environment = Environment.createEnvironment(category, requestDto.orderIndex());
		environmentRepository.save(environment);
		return new EnvironmentResponseDto(environment.getId(), environment.getVariable(), environment.getType(),
			environment.getValue(), environment.getDescription(), environment.getOrderIndex());
	}

	@Override
	public EnvironmentDetailResponseDto getEnvironmentDetails(Long categoryId) {
		EnvironmentCategory category = environmentCategoryRepository.findById(categoryId)
			.orElseThrow(() -> new MainException(CustomException.NOT_FOUND_ENVIRONMENT_CATEGORY));

		List<EnvironmentResponseDto> environments = category.getEnvironments().stream()
			.map(env -> new EnvironmentResponseDto(
				env.getId(),
				env.getVariable(),
				env.getType(),
				env.getValue(),
				env.getDescription(),
				env.getOrderIndex()
			))
			.toList();

		return new EnvironmentDetailResponseDto(
			category.getId(),
			category.getName(),
			environments
		);
	}

	@Override
	public List<EnvironmentListResponseDto> getEnvironments(UUID workspaceId) {
		List<EnvironmentCategory> categories = environmentCategoryRepository.findByWorkspaceId(workspaceId);

		return categories.stream().map(category ->
			new EnvironmentListResponseDto(
				category.getId(),
				category.getName(),
				category.getEnvironments().stream()
					.map(env -> new EnvironmentListResponseDto.EnvironmentDto(
						env.getId(),
						env.getVariable(),
						env.getType(),
						env.getValue(),
						env.getDescription(),
						env.getOrderIndex()
					))
					.toList()
			)
		).toList();
	}

	@Transactional
	@Override
	public void updateEnvironment(Long environmentId, UpdateEnvironmentRequestDto requestDto) {
		Environment environment = environmentRepository.findById(environmentId)
			.orElseThrow(() -> new MainException(CustomException.NOT_FOUND_ENVIRONMENT));

		if (environmentRepository.existsByEnvironmentCategoryAndVariable(environment.getEnvironmentCategory(), requestDto.variable())) {
			throw new MainException(CustomException.DUPLICATE_VARIABLE_IN_CATEGORY);
		}

		environment.updateEnvironment(requestDto);
	}

	@Transactional
	@Override
	public void deleteEnvironment(Long environmentId) {
		environmentRepository.deleteById(environmentId);
	}
}
