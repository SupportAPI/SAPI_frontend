package com.seniorcenter.sapi.domain.specification.domain.repository;

import java.util.List;
import java.util.UUID;

import com.seniorcenter.sapi.domain.statistics.presentation.dto.ConfirmedApiCountDto;

public interface SpecificationRepositoryCustom {
	UUID findWorkspaceIdByApiId(UUID apiId);
	List<ConfirmedApiCountDto> countConfirmedApiByManager(UUID workspaceId);
	Long countTotalSpecifications(UUID workspaceId);
	Long countLocalSuccessSpecifications(UUID workspaceId);
	Long countServerSuccessSpecifications(UUID workspaceId);
	Long countTotalSpecificationsByUser(UUID workspaceId, Long userId);
	Long countLocalSuccessSpecificationsByUser(UUID workspaceId, Long userId);
	Long countServerSuccessSpecificationsByUser(UUID workspaceId, Long userId);
}
