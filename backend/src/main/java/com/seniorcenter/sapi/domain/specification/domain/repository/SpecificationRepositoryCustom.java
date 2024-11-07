package com.seniorcenter.sapi.domain.specification.domain.repository;

import java.util.List;
import java.util.UUID;

import com.seniorcenter.sapi.domain.statistics.presentation.dto.ConfirmedApiCountDto;

public interface SpecificationRepositoryCustom {

	List<ConfirmedApiCountDto> countConfirmedApiByManager(UUID workspaceId);
}
