package com.seniorcenter.sapi.domain.api.domain.repository;

import java.util.List;
import java.util.UUID;

import com.seniorcenter.sapi.domain.apitest.presentation.dto.response.ApiTestResponseDto;

public interface ApiRepositoryCustom {
	List<ApiTestResponseDto> findConfirmedApisByWorkspaceId(UUID workspaceId);
}
